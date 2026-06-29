import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PosterPreview } from "@/components/PosterPreview";
import { RACES } from "@/lib/races";
import { getRoutePath } from "@/lib/raceRoutes";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop marathon posters — Racepace" },
      {
        name: "description",
        content:
          "Browse the full Racepace collection of city marathon posters. Personalize any print with your name, time and date.",
      },
      { property: "og:title", content: "Shop marathon posters — Racepace" },
      {
        property: "og:description",
        content:
          "Limited-edition city marathon posters. Berlin, NYC, Tokyo, London and more — printed on archival paper.",
      },
    ],
  }),
  component: ShopPage,
});

const CONTINENT_OF: Record<string, string> = {
  Germany: "Europe", "United Kingdom": "Europe", France: "Europe", Italy: "Europe",
  Spain: "Europe", Portugal: "Europe", Greece: "Europe", Netherlands: "Europe",
  Denmark: "Europe", Norway: "Europe", Sweden: "Europe", Finland: "Europe",
  Iceland: "Europe", Austria: "Europe", Ireland: "Europe", "Czechia": "Europe",
  Hungary: "Europe", Poland: "Europe", "Türkiye": "Europe",
  "United States": "Americas", Canada: "Americas",
  Japan: "Asia",
  Australia: "Oceania",
  "South Africa": "Africa",
};

const FILTERS = ["All", "Europe", "Americas", "Asia", "Oceania", "Africa"] as const;
type Filter = (typeof FILTERS)[number];

function ShopPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RACES.filter((r) => {
      if (filter !== "All" && CONTINENT_OF[r.country] !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 pb-24">
      {/* Header */}
      <header className="mb-12">
        <p className="eyebrow">The collection</p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-4 leading-[0.95] tracking-tight">
          Every major. Every memory.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
          Limited-edition city marathon prints, each built around its course and its colours.
          Browse the gallery, then make one yours.
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-6 justify-between mb-10 pb-6 border-b border-border">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-widest uppercase">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                f === filter
                  ? "text-foreground border-b border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {f}
            </button>
          ))}
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search marathons or cities…"
          className="h-10 rounded-none max-w-xs"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">No marathons match your search.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {filtered.map((race) => (
            <Link
              key={race.id}
              to="/create"
              search={{ race: race.id }}
              className="group block"
            >
              {/* Plastered white wall with framed poster */}
              <div
                className="relative overflow-hidden flex items-center justify-center p-10 lg:p-14 transition-transform group-hover:-translate-y-1"
                style={{
                  aspectRatio: "4 / 5",
                  background:
                    "radial-gradient(120% 80% at 22% 14%, #FBF9F4 0%, #F3F0E8 55%, #E8E3D6 100%)",
                }}
              >
                <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
                  <defs>
                    <filter id={`wall-shop-${race.id}`}>
                      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                  </defs>
                </svg>
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{ filter: `url(#wall-shop-${race.id})`, opacity: 0.18, mixBlendMode: "multiply" }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(90% 60% at 25% 10%, rgba(255,250,235,0.55) 0%, rgba(255,250,235,0) 60%)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.08) 100%)",
                  }}
                />
                <div
                  className="relative"
                  style={{
                    width: "78%",
                    padding: "10px",
                    background: "#0B0B0B",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 50px -22px rgba(30,24,16,0.45), 0 14px 24px -14px rgba(30,24,16,0.28)",
                  }}
                >
                  <div style={{ background: "#FFFFFF", padding: "10px" }}>
                    <PosterPreview
                      config={{
                        name: "Your Name",
                        race: race.name,
                        date: race.date,
                        time: "03:24:17",
                        theme: "cream",
                        routePath: getRoutePath(race.id),
                        raceId: race.id,
                        location: `${race.city}, ${race.country}`,
                        distanceKm: race.distanceKm,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <div className="font-serif text-lg leading-tight">{race.city}</div>
                  <div className="text-xs text-muted-foreground tracking-wide uppercase mt-1">
                    {race.country}
                  </div>
                </div>
                <span className="text-xs tracking-widest uppercase text-muted-foreground group-hover:text-primary transition-colors">
                  Personalize →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
