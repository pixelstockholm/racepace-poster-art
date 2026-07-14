import { createFileRoute } from "@tanstack/react-router";
import { openCookieSettings } from "@/lib/analytics";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & cookies — Racepace" },
      {
        name: "description",
        content: "How Racepace handles order information, analytics and cookies.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
      <p className="eyebrow">Privacy & cookies</p>
      <h1 className="mt-6 font-serif text-5xl leading-[1.02] md:text-6xl">Your data, clearly.</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">Last updated 14 July 2026.</p>

      <div className="mt-14 space-y-10 text-sm leading-7 text-muted-foreground">
        <PolicySection title="What we collect">
          We process the details needed to personalize and fulfil your order, including your name,
          email, delivery address, race details, selected print size and payment status. Payment
          details are handled by Shopify and its payment providers; Racepace does not receive your
          full card details.
        </PolicySection>
        <PolicySection title="Why we use it">
          We use this information to create your personalized artwork, provide checkout, review the
          production file, deliver the order, support you and meet accounting or legal obligations.
        </PolicySection>
        <PolicySection title="Service providers">
          Shopify provides checkout and order processing. Prodigi produces and ships approved
          prints. Lovable hosts the storefront. These providers receive only the information needed
          to perform their part of the service.
        </PolicySection>
        <PolicySection title="Analytics and advertising">
          If you choose “Accept analytics”, Meta technology records events such as page views,
          product views, cart activity and checkout starts. Shopify may also send checkout and
          purchase events to Meta. We use these events to measure advertising and improve the store.
          Analytics does not load on this storefront when you choose “Necessary only”.
        </PolicySection>
        <PolicySection title="Cookies and local storage">
          Necessary local storage keeps your cart and privacy preference available between visits.
          Advertising and analytics storage is optional. You can change your choice at any time.
        </PolicySection>
        <PolicySection title="Retention and your rights">
          Order records are retained only as long as needed for fulfilment, support, accounting and
          legal requirements. Depending on where you live, you may request access, correction,
          deletion, restriction or a copy of your personal information.
        </PolicySection>
        <PolicySection title="Contact">
          For privacy questions or requests, contact Racepace at{" "}
          <a className="text-ink underline underline-offset-2" href="mailto:hello@racepace.shop">
            hello@racepace.shop
          </a>
          .
        </PolicySection>
      </div>

      <button
        type="button"
        onClick={openCookieSettings}
        className="mt-12 border-b border-ink/40 pb-1 text-[0.65rem] uppercase tracking-[0.2em] text-ink hover:border-ink"
      >
        Change cookie settings
      </button>
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <p className="mt-3">{children}</p>
    </section>
  );
}

