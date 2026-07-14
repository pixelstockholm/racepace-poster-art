import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PosterPreview } from "@/components/PosterPreview";
import { RACES, raceEditionSubtitle, raceEditionTitle } from "@/lib/races";
import { getRoutePath, isRouteVerified } from "@/lib/raceRoutes";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop marathon posters — Racepace" },
      {
        name: "description",
        content:
          "Browse verified Racepace marathon editions. Personalize available prints with your name, time and date.",
      },
      { property: "og:title", content: "Shop marathon posters — Racepace" },
      {
        property: "og:description",
        content: "Verified city marathon editions, printed on archival paper after design review.",
      },
    ],
  }),
  component: ShopPage,
});

const CONTINENT_OF: Record<string, string> = {
  Germany: "Europe",
  "United Kingdom": "Europe",
  France: "Europe",
  Italy: "Europe",
  Spain: "Europe",
  Portugal: "Europe",
  Greece: "Europe",
  Netherlands: "Europe",
  Denmark: "Europe",
  Norway: "Europe",
  Sweden: "Europe",
  Finland: "Europe",
  Iceland: "Europe",
  Austria: "Europe",
  Ireland: "Europe",
  Czechia: "Europe",
  Hungary: "Europe",
  Poland: "Europe",
  Türkiye: "Europe",
  "United States": "Americas",
  Canada: "Americas",
  Japan: "Asia",
  Australia: "Oceania",
  "South Africa": "Africa",
};

const FILTERS = ["All", "Europe", "Americas", "Asia", "Oceania", "Africa"] as const;
type Filter = (typeof FILTERS)[number];

const FEATURED_ORDER = [
  "berlin",
  "nyc",
  "london",
  "stockholm",
  "san-francisco",
  "big-sur",
  "hamburg",
  "gold-coast",
  "edinburgh",
  "knysna",
  "oulu",
];

function editionRank(id: string): number {
  const index = FEATURED_ORDER.indexOf(id);
  return index === -1 ? 999 : index;
}

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
    }).sort((a, b) => {
      const verifiedRank = Number(isRouteVerified(b.id)) - Number(isRouteVerified(a.id));
      if (verifiedRank !== 0) return verifiedRank;

      const curatedRank = editionRank(a.id) - editionRank(b.id);
      if (curatedRank !== 0) return curatedRank;

      return a.city.localeCompare(b.city);
    });
  }, [query, filter]);
  const availableEditions = filtered.filter((race) => isRouteVerified(race.id));
  const archiveQueue = filtered.filter((race) => !isRouteVerified(race.id));

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 pb-24">
      {/* Header */}
      <header className="mb-12">
        <p className="eyebrow">The collection</p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-4 leading-[0.95] tracking-tight">
          Find your marathon edition.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
          Choose a verified race route, then personalize it with your name, finish time and race
          date.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="border border-border px-3 py-2">From 590 kr</span>
          <span className="border border-border px-3 py-2">Real GPX routes</span>
          <span className="border border-border px-3 py-2">Reviewed before print</span>
        </div>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-7 gap-y-12">
            {availableEditions.map((race) => {
              const verified = isRouteVerified(race.id);
              const CardShell = verified ? Link : "div";

              return (
                <CardShell
                  key={race.id}
                  {...(verified ? { to: "/create", search: { race: race.id } } : {})}
                  className={`group block ${verified ? "" : "cursor-not-allowed opacity-70"}`}
                >
                  {/* Studio wall product shot */}
                  <div
                    className="relative overflow-hidden flex items-center justify-center p-8 lg:p-9 transition-transform group-hover:-translate-y-1"
                    style={{
                      aspectRatio: "4 / 5",
                      containerType: "inline-size",
                      "--frame-size": "clamp(3.5px, 1.05cqw, 6px)",
                      "--frame-highlight": "clamp(1.5px, 0.42cqw, 3px)",
                      background: "linear-gradient(180deg, #F8F6F0 0%, #F1EEE6 100%)",
                    } as CSSProperties}
                  >
                    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
                      <defs>
                        <filter id={`wall-shop-${race.id}`}>
                          <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.58"
                            numOctaves="3"
                            stitchTiles="stitch"
                          />
                          <feColorMatrix type="saturate" values="0" />
                        </filter>
                      </defs>
                    </svg>
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        filter: `url(#wall-shop-${race.id})`,
                        opacity: 0.11,
                        mixBlendMode: "multiply",
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(75% 52% at 33% 18%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.2) 42%, rgba(255,255,255,0) 72%)",
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(120,104,82,0.06), rgba(255,255,255,0) 28%, rgba(60,48,36,0.045) 100%), radial-gradient(95% 70% at 50% 52%, rgba(0,0,0,0) 58%, rgba(48,38,24,0.07) 100%)",
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute left-[12%] right-[12%] top-[17%] h-px opacity-40"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(96,78,55,0.16), transparent)",
                      }}
                    />
                    {!verified && (
                      <div className="absolute right-4 top-4 z-10 bg-paper/90 px-3 py-1 text-[0.58rem] tracking-[0.22em] uppercase text-foreground shadow-sm">
                        Coming soon
                      </div>
                    )}
                    <div className="relative w-[76%]">
                      <div
                        aria-hidden
                        className="absolute inset-0 translate-x-[5%] translate-y-[6%]"
                        style={{
                          background:
                            "radial-gradient(80% 80% at 50% 50%, rgba(31,25,18,0.28) 0%, rgba(31,25,18,0.16) 46%, rgba(31,25,18,0) 78%)",
                          filter: "blur(14px)",
                        }}
                      />
                      <div
                        className="relative"
                        style={{
                          padding: "var(--frame-size)",
                          background:
                            "linear-gradient(135deg, #050505 0%, #151515 52%, #050505 100%)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.12), inset 1px 0 0 rgba(255,255,255,0.06), 0 16px 30px -24px rgba(28,22,14,0.72)",
                        }}
                      >
                        <div
                          aria-hidden
                          className="absolute left-0 top-0 bottom-0"
                          style={{
                            width: "var(--frame-highlight)",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.02) 35%, rgba(0,0,0,0.35))",
                          }}
                        />
                        <div className="relative overflow-hidden">
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
                          <div
                            aria-hidden
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(115deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0) 42%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 24%)",
                              mixBlendMode: "screen",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                      <div className="font-serif text-lg leading-tight">
                        {raceEditionTitle(race)}
                      </div>
                      <div className="mt-1 text-xs tracking-[0.08em] text-muted-foreground">
                        {raceEditionSubtitle(race)}
                      </div>
                      <div className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground/70">
                        {race.country}
                      </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
                          From
                        </div>
                        <div className="font-serif text-lg tabular-nums">590 kr</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
                      <span className="border border-border px-2.5 py-1">Verified route</span>
                      <span className="border border-border px-2.5 py-1">Name + time + date</span>
                    </div>
                    <span className="mt-4 block text-[0.65rem] tracking-widest uppercase text-muted-foreground group-hover:text-primary transition-colors">
                      {verified ? "Personalize yours →" : "Request →"}
                    </span>
                  </div>
                </CardShell>
              );
            })}
          </div>

          {archiveQueue.length > 0 && (
            <section className="mt-24 border-t border-border pt-14">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Archive queue</p>
                  <h2 className="mt-3 font-serif text-3xl md:text-4xl tracking-tight">
                    More races, currently being prepared.
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  These editions are listed for demand signals only. Checkout opens after the route
                  has been verified and reviewed for print.
                </p>
              </div>
              <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {archiveQueue.map((race) => (
                  <div key={race.id} className="bg-background p-5">
                    <div className="font-serif text-xl leading-tight">{raceEditionTitle(race)}</div>
                    <div className="mt-1 text-xs tracking-[0.08em] text-muted-foreground">
                      {raceEditionSubtitle(race)}
                    </div>
                    <div className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground/70">
                      {race.country}
                    </div>
                    <div className="mt-5 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                      Request edition →
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
