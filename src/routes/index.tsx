import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-racepace-berlin-v2.jpg";
import stockholmInterior from "@/assets/interior-stockholm.jpg";
import { PosterPreview, type PosterConfig } from "@/components/PosterPreview";
import { getRoutePath } from "@/lib/raceRoutes";
import { findRaceById } from "@/lib/races";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Racepace — The race, remembered" },
      {
        name: "description",
        content:
          "Personalized marathon editions made from verified race routes. Printed on archival paper and made to live with.",
      },
      { property: "og:title", content: "Racepace — The race, remembered" },
      {
        property: "og:description",
        content:
          "Personalized marathon editions made from verified race routes and finished with your result.",
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
      <section className="home-hero bg-paper">
        <div className="relative h-[66svh] min-h-[500px] max-h-[760px] overflow-hidden bg-secondary">
          <img
            src={heroAsset}
            alt="The Racepace Berlin edition displayed in a quiet Scandinavian interior."
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
        </div>
        <div className="px-6 lg:px-10 py-9 lg:py-12 border-b border-rule/60">
          <div className="grid md:grid-cols-12 gap-8 md:items-end border-t border-ink/30 pt-6 lg:pt-8">
            <div className="md:col-span-7">
              <p className="home-kicker text-muted-foreground">Racepace / Stockholm</p>
              <h1 className="font-serif text-[clamp(3.6rem,7vw,7.5rem)] leading-[0.84] tracking-[-0.055em] mt-6">
                The race, remembered.
              </h1>
            </div>
            <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col lg:flex-row md:items-start lg:items-end md:justify-between gap-8">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[29rem]">
                Personalized editions composed from the course you ran and the result you earned.
              </p>
              <Link
                to="/shop"
                className="home-link text-ink border-ink/40 hover:border-ink shrink-0"
              >
                View editions <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-28 md:py-40 lg:py-48">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <p className="home-kicker text-muted-foreground lg:col-span-3">Made for what remains</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="font-serif text-[clamp(2.7rem,5.5vw,5.75rem)] leading-[0.98] tracking-[-0.04em] max-w-[13ch]">
              Not a souvenir.
              <br />A record of becoming.
            </h2>
            <p className="mt-10 md:mt-14 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground">
              The finish line is brief. What it took to reach it is not. Racepace turns the exact
              details of your race into a considered object for the life that follows.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="grid grid-cols-2 items-end gap-8 mb-16 lg:mb-24">
            <div>
              <p className="home-kicker text-muted-foreground">The archive / 01</p>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.035em] mt-5">
                Selected races
              </h2>
            </div>
            <Link to="/shop" className="home-link justify-self-end border-ink/40 hover:border-ink">
              Full archive <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-16">
            {FEATURED.map((p) => (
              <Link key={p.raceId} to="/create" search={{ race: p.raceId }} className="group block">
                <div className="edition-stage relative overflow-hidden flex items-center justify-center p-10 md:p-14 lg:p-20 aspect-[4/5]">
                  <div
                    className="edition-frame relative"
                    style={{
                      width: "76%",
                      padding: "10px",
                      background: "#0B0B0B",
                      boxShadow: "0 24px 40px -22px rgba(30,24,16,0.35)",
                    }}
                  >
                    {/* Mat */}
                    <div style={{ background: "#FFFFFF", padding: "10px" }}>
                      <PosterPreview config={p} />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between gap-4 border-t border-rule/70 pt-4">
                  <div>
                    <div className="home-kicker text-muted-foreground">Edition</div>
                    <div className="font-serif text-2xl md:text-3xl leading-tight mt-2">
                      {p.city}
                    </div>
                  </div>
                  <div className="home-kicker text-muted-foreground">{p.country}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="grid lg:grid-cols-2 min-h-[42rem]">
          <div className="relative min-h-[34rem] lg:min-h-full overflow-hidden">
            <img
              src={stockholmInterior}
              alt="A Stockholm marathon edition displayed at home."
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="px-6 md:px-12 lg:px-[10vw] py-20 lg:py-28 flex flex-col justify-between">
            <p className="home-kicker text-paper/55">From race to edition</p>
            <div className="mt-24 lg:mt-32">
              <h2 className="font-serif text-4xl md:text-6xl leading-[0.96] tracking-[-0.035em] max-w-[10ch]">
                Yours in every detail.
              </h2>
              <p className="mt-8 max-w-md text-sm md:text-base leading-relaxed text-paper/65">
                Course, city, date, name and finishing time—brought together with the restraint of a
                permanent object.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-36">
          <p className="home-kicker text-muted-foreground mb-16">The making / 02</p>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            {[
              {
                tag: "N°01",
                name: "Route",
                desc: "Drawn from verified race data—not an approximation.",
              },
              {
                tag: "N°02",
                name: "Result",
                desc: "Personalized with the details that made the race yours.",
              },
              {
                tag: "N°03",
                name: "Edition",
                desc: "Composed, reviewed and printed as an object to keep.",
              },
            ].map((c) => (
              <div key={c.name}>
                <div className="text-[0.62rem] tracking-[0.24em] uppercase text-muted-foreground">
                  {c.tag}
                </div>
                <div className="hairline mt-6" />
                <h3 className="font-serif text-3xl md:text-4xl mt-7 leading-tight">{c.name}</h3>
                <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-[30ch]">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/45">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-36">
          <div className="grid lg:grid-cols-12 gap-12 mb-20">
            <p className="home-kicker text-muted-foreground lg:col-span-3">Our standard / 03</p>
            <h2 className="font-serif text-4xl md:text-6xl leading-[0.98] tracking-[-0.035em] lg:col-span-7 lg:col-start-5">
              Considered before it reaches you.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                title: "True to the course",
                desc: "Every route begins with race data and is reviewed before entering the archive.",
              },
              {
                title: "Made to live with",
                desc: "Printed on substantial matte paper, chosen for quiet detail and lasting presence.",
              },
              {
                title: "Considered by hand",
                desc: "Every personalized edition is checked before print. Nothing leaves unfinished.",
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

      <section>
        <div className="mx-auto max-w-5xl px-6 lg:px-10 py-32 lg:py-48 text-center">
          <p className="home-kicker text-muted-foreground mb-8">The race is already yours</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.92] tracking-[-0.045em]">
            A finish worth keeping.
          </h2>
          <div className="mt-12 flex items-center justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-between gap-12 min-w-60 h-13 px-7 bg-ink text-paper text-[0.65rem] tracking-[0.22em] uppercase hover:bg-ink/88 transition-colors"
            >
              Find your race <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
