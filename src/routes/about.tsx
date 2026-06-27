import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Racepace" },
      {
        name: "description",
        content:
          "Racepace is a studio for finishers. We turn the data of your race into a poster you'll want to live with.",
      },
      { property: "og:title", content: "About — Racepace" },
      {
        property: "og:description",
        content: "A studio for finishers. Personalized marathon posters, designed to be lived with.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 lg:px-10 py-20 lg:py-28">
      <p className="eyebrow">About</p>
      <h1 className="font-serif text-5xl md:text-6xl mt-6 leading-[1.02]">
        A studio for finishers.
      </h1>
      <div className="mt-12 space-y-8 text-lg leading-relaxed text-foreground/85">
        <p>
          Racepace started with one finished marathon and a wall that needed something on it.
          The certificates were generic, the medals lived in a drawer, and the photos sat
          unprinted on a phone. We wanted a single object that held the entire day —
          the city, the time, the name — and looked like it belonged in the room.
        </p>
        <p>
          Every poster is built around the same typographic system: a single serif holds
          the headline, a clean sans holds the data, and one accent line anchors the page.
          No clip art. No clichés. The result is something quiet enough to look at every day,
          and confident enough to never be taken down.
        </p>
        <p>
          We print on 230gsm archival matte paper, package each poster in a rigid tube,
          and ship worldwide. Made in small batches in Stockholm.
        </p>
      </div>
      <div className="hairline mt-16 mb-10" />
      <Link
        to="/create"
        className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
      >
        Design your poster
      </Link>
    </main>
  );
}
