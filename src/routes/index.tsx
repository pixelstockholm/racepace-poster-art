import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-poster-room.jpg";
import { PosterPreview } from "@/components/PosterPreview";
import { getRoutePath } from "@/lib/raceRoutes";
import { findRaceById } from "@/lib/races";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Racepace — The Marathon, Remembered Beautifully" },
      {
        name: "description",
        content:
          "Personalized marathon prints inspired by editorial design, timeless typography and the places that shaped your race.",
      },
      { property: "og:title", content: "Racepace — Editorial marathon prints" },
      {
        property: "og:description",
        content:
          "Collectible marathon posters designed like premium editorial print. Stockholm, Berlin, Paris, Tokyo, Boston, Amsterdam and more.",
      },
    ],
  }),
  component: HomePage,
});

const FEATURED_IDS = ["stockholm", "berlin", "paris", "tokyo", "boston", "amsterdam"];

function HomePage() {
  return (
    <main className="bg-paper text-ink">
      {/* SECTION 1 — HERO */}
      <section className="relative">
        <div className="w-full">
          <img
            src={heroImage}
            alt="A framed Racepace Signature marathon poster in a sunlit Scandinavian living room with an oak frame, linen curtains and a low oak table with books."
            width={1920}
            height={1280}
            className="w-full h-[62vh] md:h-[78vh] lg:h-[86vh] object-cover"
          />
        </div>
        <div className="mx-auto max-w-5xl px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-32 text-center">
          <p className="eyebrow">Racepace — Signature Edition</p>
          <h1 className="font-serif mt-8 text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight max-w-3xl mx-auto">
            The marathon,<br />
            <span className="italic">remembered beautifully.</span>
          </h1>
          <p className="mt-10 mx-auto max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Personalized marathon prints inspired by editorial design, timeless
            typography and the places that shaped your race.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            <Link
              to="/create"
              className="inline-flex items-center justify-center h-12 px-9 bg-ink text-paper text-[0.7rem] tracking-[0.22em] uppercase hover:opacity-90 transition-opacity"
            >
              Create Yours
            </Link>
            <Link
              to="/shop"
              className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-ink pb-1 hover:opacity-70 transition-opacity"
            >
              Browse Editions
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — COLLECTIONS */}
      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="text-center mb-16 lg:mb-24">
            <p className="eyebrow">Three Collections</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-5 leading-tight">
              A library, not a catalogue.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {[
              {
                no: "N°01",
                name: "Signature",
                tag: "Editorial",
                desc: "Editorial-inspired race posters. Quiet typography, considered colour, the route as hero.",
              },
              {
                no: "N°02",
                name: "Performance",
                tag: "Data",
                desc: "Data-driven race prints. Splits, elevation and pace, set in calm editorial form.",
              },
              {
                no: "N°03",
                name: "Collection",
                tag: "Worldwide",
                desc: "Fifty marathons and counting. From Stockholm to Tokyo, each one drawn from its city.",
              },
            ].map((c) => (
              <article
                key={c.no}
                className="group bg-card px-8 pt-10 pb-12 transition-shadow duration-500 shadow-[0_1px_2px_rgba(40,30,20,0.04)] hover:shadow-[0_18px_50px_-30px_rgba(40,30,20,0.35)]"
                style={{ aspectRatio: "3 / 4" }}
              >
                <div className="flex items-center justify-between text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
                  <span>{c.no}</span>
                  <span>{c.tag}</span>
                </div>
                <div className="hairline mt-6" />
                <div className="mt-auto flex h-full flex-col">
                  <div className="flex-1" />
                  <h3 className="font-serif text-4xl md:text-5xl leading-[1.02]">
                    {c.name}
                  </h3>
                  <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                    {c.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURED EDITIONS */}
      <section className="border-t border-rule/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-16 lg:mb-20">
            <div>
              <p className="eyebrow">Featured Editions</p>
              <h2 className="font-serif text-3xl md:text-5xl mt-5 leading-tight max-w-xl">
                Six cities, in print.
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[0.7rem] tracking-[0.22em] uppercase border-b border-ink pb-1 hover:opacity-70"
            >
              Browse all editions →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-20 gap-y-20">
            {FEATURED_IDS.map((id, i) => {
              const race = findRaceById(id);
              if (!race) return null;
              return (
                <Link
                  key={id}
                  to="/create"
                  search={{ race: id }}
                  className="group block"
                >
                  <div className="bg-paper p-5 lg:p-6 transition-all duration-500 ease-out group-hover:-translate-y-1 shadow-[0_1px_2px_rgba(40,30,20,0.04)] group-hover:shadow-[0_24px_60px_-32px_rgba(40,30,20,0.35)]">
                    <PosterPreview
                      config={{
                        name: "Your Name",
                        race: race.name,
                        date: race.date,
                        time: "03:24:17",
                        theme: "cream",
                        routePath: getRoutePath(id),
                        raceId: id,
                        location: `${race.city}, ${race.country}`,
                        distanceKm: 42.195,
                      }}
                    />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <div>
                      <div className="text-[0.6rem] tracking-[0.22em] uppercase text-muted-foreground">
                        N°{String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="font-serif text-xl mt-2 leading-tight">{race.city}</div>
                    </div>
                    <div className="text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
                      {race.country}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="text-center mb-16 lg:mb-20">
            <p className="eyebrow">How It Works</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-5 leading-tight">
              Four quiet steps.
            </h2>
          </div>
          <ol className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
            {[
              { n: "01", t: "Choose your race", icon: <IconFlag /> },
              { n: "02", t: "Add your result", icon: <IconClock /> },
              { n: "03", t: "Personalize your print", icon: <IconPen /> },
              { n: "04", t: "Printed and delivered", icon: <IconTube /> },
            ].map((s) => (
              <li key={s.n} className="text-center">
                <div className="mx-auto h-10 w-10 text-ink/70">{s.icon}</div>
                <div className="hairline w-12 mx-auto mt-8" />
                <div className="text-[0.6rem] tracking-[0.22em] uppercase text-muted-foreground mt-6">
                  Step {s.n}
                </div>
                <div className="font-serif text-lg mt-3 leading-snug">{s.t}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 5 — STORY */}
      <section className="border-t border-rule/60 bg-secondary/40">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-28 lg:py-40 text-center">
          <p className="eyebrow">Our Story</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-6 leading-[1.08] italic">
            A race deserves more<br />than a medal.
          </h2>
          <p className="mt-10 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Racepace turns marathon achievements into timeless printed objects —
            designed to live in your home long after race day.
          </p>
          <div className="hairline w-16 mx-auto mt-12" />
          <p className="mt-8 text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
            Trackstar celebrates performance · Racepace celebrates memory
          </p>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS */}
      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="text-center mb-16">
            <p className="eyebrow">In Their Words</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            {[
              {
                quote:
                  "It doesn't feel like a finisher poster. It feels like something I'd have bought anyway, even without the time on it.",
                name: "Elin Sjöberg",
                meta: "Stockholm Marathon, 2024",
              },
              {
                quote:
                  "Hangs above my reading chair. Three friends have asked where the print is from before they noticed it was mine.",
                name: "Daniel Okafor",
                meta: "Berlin Marathon, 2023",
              },
            ].map((t) => (
              <figure key={t.name} className="text-center md:text-left">
                <blockquote className="font-serif text-2xl md:text-3xl leading-[1.25] italic">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8">
                  <div className="hairline w-10 mb-5 mx-auto md:mx-0" />
                  <div className="text-sm">{t.name}</div>
                  <div className="text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground mt-1.5">
                    {t.meta}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- minimal line icons ---------- */

function IconFlag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
function IconPen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
      <path d="M14 6l3 3" />
    </svg>
  );
}
function IconTube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
      <path d="M4 9h16M4 15h16" />
    </svg>
  );
}
