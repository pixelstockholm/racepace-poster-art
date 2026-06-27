import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-poster-room.jpg";
import { PosterPreview } from "@/components/PosterPreview";
import { getRoutePath } from "@/lib/raceRoutes";
import { RACES, findRaceById } from "@/lib/races";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Racepace — Marathon Posters for the Races You'll Never Forget" },
      {
        name: "description",
        content:
          "Limited-edition city marathon posters. Browse Berlin, NYC, Tokyo, London and more — each one printed on archival paper, personalized with your finish.",
      },
      { property: "og:title", content: "Racepace — Marathon Posters" },
      {
        property: "og:description",
        content:
          "Browse limited-edition city marathon posters, printed on archival paper.",
      },
    ],
  }),
  component: HomePage,
});

const FEATURED_IDS = ["berlin", "nyc", "tokyo", "london", "paris", "stockholm"];

function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12 lg:pt-24 lg:pb-20 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <p className="eyebrow">Limited-edition marathon prints</p>
            <h1 className="font-serif mt-6 text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              The races<br />
              you ran.<br />
              <span className="text-primary italic">Worth framing.</span>
            </h1>
            <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
              A growing collection of city marathon posters, designed around each course
              and printed on heavy archival paper. Browse the gallery — personalize when
              you find the one.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
              >
                Browse the collection
              </Link>
              <Link
                to="/about"
                className="text-sm tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-primary hover:border-primary transition-colors"
              >
                Our story
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <img
              src={heroImage}
              alt="A framed Berlin Marathon finisher poster hanging on a warm cream wall above an oak bench."
              width={1600}
              height={1920}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* THE COLLECTION */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight max-w-2xl">
                Six cities. One wall, eventually.
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-sm tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-primary hover:border-primary"
            >
              See all marathons →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {FEATURED_IDS.map((id) => {
              const race = findRaceById(id);
              if (!race) return null;
              return (
                <Link
                  key={id}
                  to="/create"
                  search={{ race: id }}
                  className="group block"
                >
                  <div className="bg-background p-5 lg:p-6 transition-transform group-hover:-translate-y-1">
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
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <div>
                      <div className="font-serif text-lg leading-tight">{race.city}</div>
                      <div className="text-xs text-muted-foreground tracking-wide uppercase mt-1">
                        {race.country}
                      </div>
                    </div>
                    <span className="text-xs tracking-widest uppercase text-muted-foreground group-hover:text-primary transition-colors">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CRAFT */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">The craft</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-6 leading-tight">
                Built like a print, not a dashboard.
              </h2>
            </div>
            <ol className="lg:col-span-8 grid sm:grid-cols-3 gap-10">
              {[
                {
                  n: "01",
                  t: "City-specific palettes",
                  d: "Every marathon gets its own colours, drawn from the city it runs through.",
                },
                {
                  n: "02",
                  t: "Course as hero",
                  d: "The route shape sits at the heart of the poster — instantly recognizable to anyone who ran it.",
                },
                {
                  n: "03",
                  t: "230gsm archival paper",
                  d: "Printed and shipped in a rigid tube within five business days, worldwide.",
                },
              ].map((s) => (
                <li key={s.n}>
                  <div className="font-serif text-primary text-3xl">{s.n}</div>
                  <div className="hairline mt-4 mb-4" />
                  <div className="font-serif text-xl">{s.t}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl mx-auto">
            {RACES.length} marathons. Find yours.
          </h2>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
          >
            Browse the collection
          </Link>
        </div>
      </section>
    </main>
  );
}
