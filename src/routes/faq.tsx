import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Racepace" },
      {
        name: "description",
        content:
          "Answers about shipping, sizing, paper quality, and returns for Racepace personalized marathon posters.",
      },
      { property: "og:title", content: "FAQ — Racepace" },
      {
        property: "og:description",
        content: "Shipping, sizing, paper quality and returns.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How long does shipping take?",
    a: "Posters print within 5 business days and ship via tracked courier. Europe arrives in 3–6 business days, North America in 5–9 business days, rest of world in 7–14 business days. Free worldwide shipping on orders over €100.",
  },
  {
    q: "What sizes do you offer?",
    a: "A3 (29.7 × 42 cm), A2 (42 × 59.4 cm), 50 × 70 cm, and 70 × 100 cm. A2 and 50 × 70 are our most popular — they're large enough to anchor a wall without overpowering it.",
  },
  {
    q: "What paper do you print on?",
    a: "230gsm archival matte paper with a fine tooth. Pigment inks rated for 100+ years without fading. Cut to size with a fine border so it sits well inside standard frames.",
  },
  {
    q: "Do posters come framed?",
    a: "No — we ship unframed in a rigid tube. This keeps shipping costs and damage risk down, and lets you pick a frame that matches your room. All our sizes fit standard off-the-shelf frames.",
  },
  {
    q: "Can I edit my poster after ordering?",
    a: "Yes, as long as we haven't started printing. Email hello@racepace.lovable.app with your order number and the change. Once your order moves to printing (usually within 24 hours) we can't make changes.",
  },
  {
    q: "What if I made a typo?",
    a: "If your poster arrives with an error caused by us, we'll reprint and ship a new one for free. If the typo was in the order itself, contact us within 14 days — we'll always work with you on a fair solution.",
  },
  {
    q: "Do you offer returns?",
    a: "Because each poster is made to order, we don't accept returns for change of mind. We do replace any poster damaged in transit or misprinted by us — just send a photo within 14 days of delivery.",
  },
  {
    q: "My race isn't on the list. Can I still order?",
    a: "Yes — switch to the manual entry on the customization page and type your race name. The design system handles any race, distance or event.",
  },
];

function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 lg:px-10 py-20 lg:py-28">
      <p className="eyebrow">FAQ</p>
      <h1 className="font-serif text-5xl md:text-6xl mt-6 leading-[1.02]">
        Questions, answered.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-xl">
        Anything we missed? Drop us a line — we read every email.
      </p>

      <Accordion type="single" collapsible className="mt-14">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-serif text-xl py-6 hover:no-underline hover:text-primary">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80 leading-relaxed pb-6">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
