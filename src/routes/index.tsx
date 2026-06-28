import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero-exact.jpg.asset.json";
import stockholmInterior from "@/assets/interior-stockholm.jpg";
import berlinInterior from "@/assets/interior-berlin.jpg";
import parisInterior from "@/assets/interior-paris.jpg";
import tokyoInterior from "@/assets/interior-tokyo.jpg";
import chicagoInterior from "@/assets/interior-chicago.jpg";
import amsterdamInterior from "@/assets/interior-amsterdam.jpg";

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

const FEATURED = [
  { id: "stockholm", city: "Stockholm", country: "Sweden", image: stockholmInterior },
  { id: "berlin", city: "Berlin", country: "Germany", image: berlinInterior },
  { id: "paris", city: "Paris", country: "France", image: parisInterior },
  { id: "tokyo", city: "Tokyo", country: "Japan", image: tokyoInterior },
  { id: "chicago", city: "Chicago", country: "United States", image: chicagoInterior },
  { id: "amsterdam", city: "Amsterdam", country: "Netherlands", image: amsterdamInterior },
];

function HomePage() {
  return (
    <main className="bg-paper text-ink">
      {/* SECTION 1 — HERO (exact reference image, no overlay) */}
      <section className="relative -mt-16 bg-paper">
        <div className="relative w-full" style={{ aspectRatio: "1536 / 929" }}>
          <img
            src={heroAsset.url}
            alt="Racepace — Marathon posters designed to belong in your home."
            width={1536}
            height={929}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Invisible click targets aligned to the buttons baked into the image */}
          <Link
            to="/create"
            aria-label="Create Yours"
            className="absolute"
            style={{ left: "4.9%", top: "60.8%", width: "9.8%", height: "6.5%" }}
          />
          <Link
            to="/shop"
            aria-label="Browse Posters"
            className="absolute"
            style={{ left: "18.2%", top: "60.8%", width: "11%", height: "6.5%" }}
          />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-14 lg:gap-y-20">
            {FEATURED.map((p) => (
              <Link
                key={p.id}
                to="/create"
                search={{ race: p.id }}
                className="group block"
              >
                <div className="overflow-hidden bg-secondary/30 shadow-[0_1px_2px_rgba(40,30,20,0.04)] transition-shadow duration-500 group-hover:shadow-[0_24px_60px_-28px_rgba(40,30,20,0.35)]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={p.image}
                      alt={`${p.city} marathon poster framed in a styled interior.`}
                      width={1280}
                      height={1280}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
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
