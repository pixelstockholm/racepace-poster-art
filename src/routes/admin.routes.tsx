import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { gpxToRoute, type GpxRouteResult } from "@/lib/gpx";
import { PosterPreview, type PosterConfig } from "@/components/PosterPreview";
import { RACES, findRaceById } from "@/lib/races";

export const Route = createFileRoute("/admin/routes")({
  head: () => ({
    meta: [{ title: "Admin — Import GPX route" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminRoutesPage,
});

function AdminRoutesPage() {
  if (!import.meta.env.DEV) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Racepace admin</p>
        <h1 className="mt-4 font-serif text-4xl">Private production tool.</h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          Route import and production review tools are not exposed on the public storefront. Order
          operations require authenticated access to the private Racepace admin system.
        </p>
      </main>
    );
  }

  return <AdminRoutesTool />;
}

function AdminRoutesTool() {
  const [raceId, setRaceId] = useState<string>("berlin");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [tolerance, setTolerance] = useState<number>(0.00015);
  const [gpxText, setGpxText] = useState<string>("");
  const [result, setResult] = useState<GpxRouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const race = findRaceById(raceId);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setGpxText(text);
      parse(text, tolerance);
    };
    reader.readAsText(file);
  }

  function parse(text: string, tol: number) {
    try {
      setError(null);
      setResult(gpxToRoute(text, { tolerance: tol }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResult(null);
    }
  }

  const entry = useMemo(() => {
    if (!result || !race) return null;
    return {
      id: `${race.id}-${year}`,
      race_id: race.id,
      marathon_name: race.name,
      city: race.city,
      country: race.country,
      year,
      gpx_file_url: "",
      svg_path: result.svgPath,
      route_bounds: result.bounds,
      route_source_url: sourceUrl,
      route_verified: true,
      route_notes: notes || undefined,
    };
  }, [result, race, year, sourceUrl, notes]);

  const entryJson = entry ? JSON.stringify(entry, null, 2) : "";

  const previewConfig: PosterConfig | null =
    race && result
      ? {
          name: "Sample Runner",
          race: race.name,
          date: race.date,
          time: "03:24:18",
          theme: "cream",
          routePath: result.svgPath,
          location: `${race.city}, ${race.country}`,
          distanceKm: race.distanceKm,
          raceId: race.id,
        }
      : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Racepace admin</p>
        <h1 className="mt-2 font-serif text-4xl">Import GPX route</h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600">
          Upload a real GPX file from the official race organiser or a verified finisher. The system
          simplifies the track, projects it, and normalizes it into the poster route area. Preview,
          then copy the JSON entry into{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">
            src/data/verifiedRoutes.json
          </code>
          .
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <Label htmlFor="race">Race</Label>
            <select
              id="race"
              value={raceId}
              onChange={(e) => setRaceId(e.target.value)}
              className="mt-1 block w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
            >
              {RACES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
              />
            </div>
            <div>
              <Label htmlFor="tol">Simplify tolerance (deg)</Label>
              <Input
                id="tol"
                type="number"
                step="0.00001"
                value={tolerance}
                onChange={(e) => {
                  const t = parseFloat(e.target.value);
                  setTolerance(Number.isFinite(t) ? t : 0.00015);
                  if (gpxText) parse(gpxText, Number.isFinite(t) ? t : 0.00015);
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="src">Source URL (organiser / GPX origin)</Label>
            <Input
              id="src"
              placeholder="https://…"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="gpx">GPX file</Label>
            <Input
              id="gpx"
              type="file"
              accept=".gpx,application/gpx+xml,application/xml,text/xml"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          <div>
            <Label htmlFor="gpxtext">…or paste GPX XML</Label>
            <Textarea
              id="gpxtext"
              rows={6}
              value={gpxText}
              onChange={(e) => setGpxText(e.target.value)}
              placeholder="<?xml version=…"
              className="font-mono text-xs"
            />
            <Button
              type="button"
              className="mt-2"
              variant="secondary"
              onClick={() => parse(gpxText, tolerance)}
              disabled={!gpxText.trim()}
            >
              Parse
            </Button>
          </div>

          {error && (
            <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {result && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-700">
              <dt>Source points</dt>
              <dd className="text-right">{result.sourcePoints.toLocaleString()}</dd>
              <dt>Simplified</dt>
              <dd className="text-right">{result.pointCount.toLocaleString()}</dd>
              <dt>Track length</dt>
              <dd className="text-right">{result.distanceKm.toFixed(2)} km</dd>
              <dt>Lat range</dt>
              <dd className="text-right">
                {result.bounds.minLat.toFixed(4)} → {result.bounds.maxLat.toFixed(4)}
              </dd>
              <dt>Lon range</dt>
              <dd className="text-right">
                {result.bounds.minLon.toFixed(4)} → {result.bounds.maxLon.toFixed(4)}
              </dd>
            </dl>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-lg bg-neutral-100 p-6">
            {previewConfig ? (
              <div className="mx-auto max-w-sm">
                <PosterPreview config={previewConfig} />
              </div>
            ) : (
              <p className="py-24 text-center text-sm text-neutral-500">
                Upload a GPX file to preview.
              </p>
            )}
          </div>

          {entry && (
            <div>
              <div className="flex items-center justify-between">
                <Label>JSON entry</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(entryJson);
                      toast.success("Copied entry to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const blob = new Blob([entryJson], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${entry.id}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
              <Textarea readOnly rows={14} value={entryJson} className="mt-2 font-mono text-xs" />
              <p className="mt-2 text-xs text-neutral-500">
                Append this object to the <code>routes</code> array in{" "}
                <code>src/data/verifiedRoutes.json</code> and commit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
