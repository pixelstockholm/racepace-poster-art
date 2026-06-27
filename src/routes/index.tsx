import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-poster-room.jpg";
import featuredImage from "@/assets/featured-posters.jpg";
import { PosterPreview } from "@/components/PosterPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Racepace — Personalized Marathon Posters" },
      {
        name: "description",
        content:
          "Your race. Your story. On your wall. Premium personalized marathon posters printed on archival paper.",
      },
      { property: "og:title", content: "Racepace — Personalized Marathon Posters" },
      {
        property: "og:description",
        content:
          "Your race. Your story. On your wall. Premium personalized marathon posters.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12 lg:pt-24 lg:pb-20 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <p className="eyebrow">Personalized · Numbered · Yours</p>
            <h1 className="font-serif mt-6 text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Your race.<br />
              Your story.<br />
              <span className="text-primary italic">On your wall.</span>
            </h1>
            <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
              A premium poster designed around the run you'll never forget. Your name,
              your race, your finishing time — printed on heavy archival paper.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/create"
                className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
              >
                Design yours
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

      {/* HOW IT WORKS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">How it works</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-6 leading-tight">
                Three steps, one poster you'll never take down.
              </h2>
            </div>
            <ol className="lg:col-span-8 grid sm:grid-cols-3 gap-10">
              {[
                {
                  n: "01",
                  t: "Pick your race",
                  d: "Choose from major marathons worldwide, or enter your own. We auto-fill the date.",
                },
                {
                  n: "02",
                  t: "Add your time",
                  d: "Your name. Your finishing time. Six color themes. Four sizes. Live preview.",
                },
                {
                  n: "03",
                  t: "We print &amp; ship",
                  d: "Printed on 230gsm archival paper, packaged in a rigid tube and shipped worldwide.",
                },
              ].map((s) => (
                <li key={s.n}>
                  <div className="font-serif text-primary text-3xl">{s.n}</div>
                  <div className="hairline mt-4 mb-4" />
                  <div className="font-serif text-xl" dangerouslySetInnerHTML={{ __html: s.t }} />
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: s.d }} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FEATURED EXAMPLES */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow">Finishers</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight max-w-2xl">
                Made for the runs people frame.
              </h2>
            </div>
            <Link
              to="/create"
              className="text-sm tracking-widest uppercase border-b border-foreground pb-0.5 hover:text-primary hover:border-primary"
            >
              Start your poster →
            </Link>
          </div>
          <img
            src={featuredImage}
            alt="Three framed marathon posters on a gallery wall: New York, Stockholm, and London."
            width={1600}
            height={1104}
            loading="lazy"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* LIVE THEME PREVIEW */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow">Six themes</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-6 leading-tight">
              From midnight ink to warm cream.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Each poster is built around a typographic hierarchy that holds up across
              every theme — so it looks intentional on any wall, in any room.
            </p>
            <Link
              to="/create"
              className="mt-10 inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
            >
              Customize yours
            </Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 gap-6">
            {(["cream", "midnight", "ember"] as const).map((theme) => (
              <PosterPreview
                key={theme}
                config={{
                  name: "Alex Müller",
                  race: theme === "midnight" ? "Tokyo Marathon" : theme === "ember" ? "Boston Marathon" : "Stockholm Marathon",
                  date: theme === "midnight" ? "2025-03-02" : theme === "ember" ? "2025-04-21" : "2025-05-31",
                  time: theme === "midnight" ? "03:18:07" : theme === "ember" ? "03:11:42" : "03:24:17",
                  theme,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
