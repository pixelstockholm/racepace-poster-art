import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-balcony-morning.png.asset.json";
import { PosterPreview, type PosterConfig } from "@/components/PosterPreview";
import { RACE_ROUTES } from "@/lib/raceRoutes";
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

const FEATURED_IDS = ["stockholm", "berlin", "paris", "tokyo", "chicago", "amsterdam"] as const;

const SAMPLE_TIMES: Record<string, { name: string; time: string }> = {
  stockholm: { name: "E. Sjöberg",  time: "03:24:18" },
  berlin:    { name: "D. Okafor",   time: "02:58:42" },
  paris:     { name: "M. Lévesque", time: "03:41:05" },
  tokyo:     { name: "H. Nakamura", time: "03:12:33" },
  chicago:   { name: "J. Whitfield",time: "03:06:51" },
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
    routePath: RACE_ROUTES[id] ?? "",
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
      <section className="relative -mt-16 h-screen min-h-[600px] flex items-center justify-start">
        <img
          src={heroAsset.url}
          alt="Warm morning light on a balcony — coffee, running shoes, and a race medal."
          className="absolute inset-0 w-full h-full object-cover object-[50%_75%]"
        />
        {/* Subtle top gradient for header readability */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent pointer-events-none" />
        {/* Overall warmth overlay */}
        <div className="absolute inset-0 bg-ink/20 pointer-events-none" />

        <div
          className="relative z-10 text-paper px-6 lg:pl-[16%] max-w-3xl"
          style={{ textShadow: "0 2px 24px rgba(10,8,4,0.45), 0 1px 2px rgba(10,8,4,0.35)" }}
        >
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-tight">
            The race ends.
            <br />
            The story stays.
          </h1>
          <p className="mt-10 text-sm md:text-base text-paper/80 leading-relaxed max-w-sm">
            For the miles worth remembering.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-12 text-[0.68rem] tracking-[0.24em] uppercase text-paper border-b border-paper/40 pb-1 hover:border-paper/80 transition-colors"
          >
            Browse Editions →
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-16 lg:gap-y-24">
            {FEATURED.map((p) => (
              <Link
                key={p.raceId}
                to="/create"
                search={{ race: p.raceId }}
                className="group block"
              >
                {/* Interior staging: warm linen wall, oak shelf, soft daylight */}
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, #E7DFCE 0%, #DCD1BA 62%, #C9B998 100%)",
                  }}
                >
                  {/* Soft window light */}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(120% 80% at 18% 12%, rgba(255,244,220,0.55) 0%, rgba(255,244,220,0) 55%)",
                    }}
                  />
                  {/* Oak shelf at bottom */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[14%] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, #8A6A45 0%, #6E5132 60%, #4F3920 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,235,200,0.18)",
                    }}
                  />
                  {/* Cast shadow under poster */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      bottom: "12%",
                      width: "62%",
                      height: "10%",
                      background:
                        "radial-gradient(closest-side, rgba(40,28,16,0.32), rgba(40,28,16,0))",
                      filter: "blur(6px)",
                    }}
                  />
                  {/* The actual Racepace poster — leaning on the shelf */}
                  <div
                    className="absolute"
                    style={{
                      left: "50%",
                      bottom: "14%",
                      width: "62%",
                      transform: "translateX(-50%) rotate(-0.4deg)",
                      transition: "transform 700ms ease",
                      transformOrigin: "bottom center",
                    }}
                  >
                    <PosterPreview config={p} />
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

      {/* SECTION 3 — COLLECTIONS */}
      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              { tag: "N°01", name: "Signature", desc: "Editorial-inspired marathon posters." },
              { tag: "N°02", name: "Performance", desc: "Data-focused race prints." },
              { tag: "N°03", name: "Archive", desc: "Worldwide marathon editions." },
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

      {/* SECTION 4 — TESTIMONIALS */}
      <section className="border-t border-rule/60 bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 py-28 lg:py-40">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {[
              {
                quote:
                  "It doesn't feel like a finisher poster. It feels like something I'd buy even if I hadn't run.",
                name: "Elin Sjöberg",
                meta: "Stockholm, 2024",
              },
              {
                quote:
                  "Hangs above my reading chair. Three friends asked where the print was from before they noticed it was mine.",
                name: "Daniel Okafor",
                meta: "Berlin, 2023",
              },
            ].map((t) => (
              <figure key={t.name}>
                <blockquote className="font-serif text-2xl md:text-3xl leading-[1.25] italic text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8">
                  <div className="hairline w-10 mb-5" />
                  <div className="text-sm">{t.name}</div>
                  <div className="text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground mt-1.5">
                    {t.meta}
                  </div>
                </figcaption>
              </figure>
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
              to="/create"
              className="inline-flex items-center justify-center h-11 px-8 bg-ink text-paper text-[0.68rem] tracking-[0.24em] uppercase hover:opacity-90 transition-opacity"
            >
              Create Yours
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
