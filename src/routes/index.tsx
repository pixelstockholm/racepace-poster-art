import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import heroAsset from "@/assets/hero-berlin-interior.png";
import { PosterPreview, type PosterConfig } from "@/components/PosterPreview";
import { getRoutePath } from "@/lib/raceRoutes";
import { findRaceById } from "@/lib/races";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Racepace — Marathon posters for your home" },
      {
        name: "description",
        content:
          "Personalized marathon prints, designed as objects to live with. Printed on archival paper and shipped worldwide.",
      },
      { property: "og:title", content: "Racepace — Marathon posters for your home" },
      {
        property: "og:description",
        content:
          "Personalized marathon prints, designed as objects to live with. Stockholm, Berlin, Paris, Tokyo, Chicago, Amsterdam.",
      },
    ],
  }),
  component: HomePage,
});

const FEATURED_IDS = ["berlin", "nyc"] as const;

const SAMPLE_TIMES: Record<string, { name: string; time: string }> = {
  stockholm: { name: "E. Sjöberg", time: "03:24:18" },
  berlin: { name: "D. Okafor", time: "02:58:42" },
  nyc: { name: "A. Dumas", time: "03:28:19" },
  paris: { name: "M. Lévesque", time: "03:41:05" },
  tokyo: { name: "H. Nakamura", time: "03:12:33" },
  chicago: { name: "J. Whitfield", time: "03:06:51" },
  amsterdam: { name: "L. de Vries", time: "03:33:09" },
};

function buildConfig(id: string): PosterConfig & { city: string; country: string } {
  const race = findRaceById(id)!;
  const s = SAMPLE_TIMES[id];
  return {
    name: s.name,
    race: race.name,
    date: race.date,
    time: s.time,
    theme: "cream",
    routePath: getRoutePath(id),
    location: `${race.city}, ${race.country}`,
    distanceKm: race.distanceKm,
    raceId: id,
    city: race.city,
    country: race.country,
  };
}

const FEATURED = FEATURED_IDS.map(buildConfig);

function HomePage() {
  return (
    <main className="bg-paper text-ink">
      {/* SECTION 1 — HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-start overflow-hidden">
        <img
          src={heroAsset}
          alt="A framed Berlin marathon edition in a warm, minimal interior."
          className="absolute inset-0 w-full h-full object-cover object-[56%_center] md:object-[64%_center]"
        />
        {/* Subtle top gradient for header readability */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/35 to-transparent pointer-events-none" />
        {/* Text readability gradient */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[58%] bg-gradient-to-r from-ink/64 via-ink/30 md:from-ink/55 md:via-ink/22 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-[27%] h-[42%] w-full bg-[radial-gradient(ellipse_at_left,rgba(10,8,4,0.38)_0%,rgba(10,8,4,0.2)_38%,rgba(10,8,4,0)_72%)] pointer-events-none md:hidden" />
        <div className="absolute inset-0 bg-ink/[0.06] pointer-events-none" />
        <div
          aria-hidden
          className="absolute hidden md:block pointer-events-none right-[13.2%] top-[8.4%] w-[21.2%] aspect-[3/4] overflow-hidden"
          style={{
            background:
              "linear-gradient(116deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.055) 18%, rgba(255,255,255,0) 43%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 24%)",
            mixBlendMode: "screen",
            opacity: 0.72,
          }}
        />

        <div
          className="relative z-10 text-paper px-6 lg:pl-[9%] max-w-[21rem] sm:max-w-sm md:max-w-2xl"
          style={{ textShadow: "0 2px 24px rgba(10,8,4,0.35), 0 1px 2px rgba(10,8,4,0.28)" }}
        >
          <h1 className="font-serif text-[2.45rem] sm:text-5xl lg:text-[3.5rem] leading-[1.02] md:leading-[1.05] tracking-tight">
            The race ends.
            <br />
            The story stays.
          </h1>
          <p className="mt-8 md:mt-10 text-sm md:text-base text-paper/86 leading-relaxed max-w-[18rem] md:max-w-sm">
            Personalized marathon prints made from real race routes.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-10 md:mt-12 text-[0.68rem] tracking-[0.24em] uppercase text-paper border-b border-paper/45 pb-1 hover:border-paper/80 transition-colors"
          >
            Personalize yours →
          </Link>
        </div>
      </section>

      {/* SECTION 2 — FEATURED POSTERS */}
      <section>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-28 lg:pt-36 pb-24 lg:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14 lg:mb-20">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
              Featured Editions
            </h2>
            <Link
              to="/shop"
              className="text-[0.68rem] tracking-[0.24em] uppercase border-b border-ink pb-1 hover:opacity-70"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-16 lg:gap-y-24">
            {FEATURED.map((p) => (
              <Link key={p.raceId} to="/create" search={{ race: p.raceId }} className="group block">
                {/* Studio wall product shot */}
                <div
                  className="relative overflow-hidden flex items-center justify-center p-8 lg:p-10 transition-transform group-hover:-translate-y-1"
                  style={{
                    aspectRatio: "4 / 5",
                    containerType: "inline-size",
                    "--frame-size": "clamp(4px, 1.05cqw, 6px)",
                    "--frame-highlight": "clamp(1.5px, 0.42cqw, 3px)",
                    background: "linear-gradient(180deg, #F8F6F0 0%, #F1EEE6 100%)",
                  } as CSSProperties}
                >
                  <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                      <filter id={`wall-${p.raceId}`}>
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.85"
                          numOctaves="2"
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
                      filter: `url(#wall-${p.raceId})`,
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
                        <PosterPreview config={p} />
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
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <div className="font-serif text-xl leading-tight">{p.city}</div>
                  <div className="text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground">
                    {p.country}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                tag: "01",
                name: "Choose your race",
                desc: "Start with a verified marathon route from the Racepace archive.",
              },
              {
                tag: "02",
                name: "Add your details",
                desc: "Personalize the edition with your name, finish time and race date.",
              },
              {
                tag: "03",
                name: "Reviewed before print",
                desc: "Every file is checked before production so the final poster feels considered.",
              },
            ].map((c) => (
              <div key={c.name}>
                <div className="text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground">
                  {c.tag}
                </div>
                <div className="hairline mt-5" />
                <h3 className="font-serif text-2xl md:text-3xl mt-6 leading-tight">{c.name}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[32ch]">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TRUST MARKERS */}
      <section className="border-t border-rule/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                title: "Verified routes",
                desc: "Launch editions use real GPX-derived routes reviewed before they enter the archive.",
              },
              {
                title: "Archival paper",
                desc: "Printed on heavy matte paper with a quiet, low-gloss gallery finish.",
              },
              {
                title: "Checked before print",
                desc: "Each personalized order is reviewed before production so the final edition feels considered.",
              },
              {
                title: "Secure checkout",
                desc: "Payments are handled through Shopify checkout, with taxes and shipping shown before payment.",
              },
              {
                title: "Made to order",
                desc: "Every poster is generated for one finisher, one race, one moment.",
              },
              {
                title: "Preview saved",
                desc: "Your personalization details are attached to the order before production approval.",
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="hairline mb-6" />
                <h3 className="font-serif text-2xl md:text-3xl leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[34ch]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 lg:py-32 text-center">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-tight">
            Find your race.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center h-11 px-8 bg-ink text-paper text-[0.68rem] tracking-[0.24em] uppercase hover:opacity-90 transition-opacity"
            >
              Browse editions
            </Link>
            <Link
              to="/shop"
              className="text-[0.68rem] tracking-[0.24em] uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
            >
              Browse all editions →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
