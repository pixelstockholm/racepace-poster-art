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
    a: "Orders are reviewed before production, then printed and shipped via the selected production partner. Expected delivery windows are shown at checkout once your shipping country is selected.",
  },
  {
    q: "What sizes do you offer?",
    a: "A3 (29.7 × 42 cm), A2 (42 × 59.4 cm), 50 × 70 cm, and 70 × 100 cm. A2 is the default size because it feels substantial without overpowering a room.",
  },
  {
    q: "What paper do you print on?",
    a: "Racepace editions are intended for archival matte paper with a refined, low-gloss finish. Final paper specifications are confirmed in the product details at checkout.",
  },
  {
    q: "Do posters come framed?",
    a: "No — we ship unframed in a rigid tube. This keeps shipping costs and damage risk down, and lets you pick a frame that matches your room. All our sizes fit standard off-the-shelf frames.",
  },
  {
    q: "Can I edit my poster after ordering?",
    a: "Yes, as long as the order has not been approved for print. Contact us with your order number and the change you need as soon as possible.",
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
    a: "Not immediately. Races need a verified route before checkout is enabled. You can request a race and we will prioritize additions based on demand.",
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
