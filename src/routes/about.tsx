import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Racepace" },
      {
        name: "description",
        content:
          "Racepace turns verified marathon routes and personal race details into editorial prints designed for the home.",
      },
      { property: "og:title", content: "About — Racepace" },
      {
        property: "og:description",
        content: "Verified marathon routes, personal race details, and editorial print design.",
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
        Marathon memories, designed to live with.
      </h1>
      <div className="mt-12 space-y-8 text-lg leading-relaxed text-foreground/85">
        <p>
          Racepace creates editorial marathon prints from verified race routes and
          personal finish details. Each edition is designed to hold the city, the course,
          the date, and the time without feeling like event merchandise.
        </p>
        <p>
          The format is intentionally restrained: large city typography, a real course
          silhouette, quiet race data, and paper-first color systems. The result should
          feel closer to a gallery print than a finisher certificate.
        </p>
        <p>
          Launch editions are added only after route review. Personalized orders are
          checked before production, then printed on archival matte paper and shipped
          from our production partner.
        </p>
      </div>
      <div className="hairline mt-16 mb-10" />
      <Link
        to="/shop"
        className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
      >
        Browse editions
      </Link>
    </main>
  );
}
