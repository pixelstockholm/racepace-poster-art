import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Shipping, returns & terms — Racepace" },
      {
        name: "description",
        content:
          "Racepace terms of sale, including personalization, payment, shipping, cancellations, returns and complaints.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
      <p className="eyebrow">Shipping, returns & terms</p>
      <h1 className="mt-6 font-serif text-5xl leading-[1.02] md:text-6xl">
        Clear before you order.
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Last updated 30 July 2026.
      </p>

      <div className="mt-14 space-y-10 text-sm leading-7 text-muted-foreground">
        <TermsSection title="Seller">
          Racepace is a trading name based in Stockholm, Sweden. For order questions, complaints or
          other support, email{" "}
          <a className="text-ink underline underline-offset-2" href="mailto:hello@racepace.shop">
            hello@racepace.shop
          </a>
          .
        </TermsSection>

        <TermsSection title="The product">
          Racepace sells unframed, made-to-order marathon prints personalized with the race, route,
          name, finish time, race date and selected size shown in the order. Screen colors and the
          physical print can differ slightly because screens emit light while paper reflects it.
        </TermsSection>

        <TermsSection title="Prices and payment">
          Product prices are shown in the store. The final price, available payment methods,
          shipping charge and any applicable tax are shown in Shopify checkout before payment. An
          order is confirmed when you receive the order confirmation.
        </TermsSection>

        <TermsSection title="Review and production">
          Your personalization and preview are saved with the order. We review the production file
          before approving it for print. If you need to correct a name, time or date, contact us
          immediately with your order number. We can normally make changes until production is
          approved, but not after printing has begun.
        </TermsSection>

        <TermsSection title="Shipping and delivery">
          Available shipping services, costs and expected delivery windows are shown at checkout
          after you enter the destination. Delivery estimates are not guaranteed dates. If an order
          is materially delayed, contact us and we will investigate it with the production and
          shipping partners.
        </TermsSection>

        <TermsSection title="Personalized goods and cancellation">
          Every Racepace print is produced to the customer&apos;s specifications. The statutory
          right of withdrawal for distance purchases therefore does not apply to the completed
          personalized product. You may still contact us before production approval to request a
          cancellation. If work or production has already started, we may deduct reasonable costs
          that we cannot recover, where permitted by applicable law.
        </TermsSection>

        <TermsSection title="Damage, production errors and complaints">
          Your statutory consumer rights are not limited by these terms. If the print is damaged,
          defective or differs from the confirmed order because of a production error, contact us
          with the order number and clear photos. We will assess the issue and provide an
          appropriate remedy, normally a replacement, and where required by law a price reduction or
          refund. Consumers in Sweden have a statutory right to complain about an original fault for
          three years and a complaint made within two months after noticing the fault is always
          considered timely.
        </TermsSection>

        <TermsSection title="Disputes and applicable rights">
          Swedish law applies without removing any mandatory consumer rights that apply in your
          country of residence. If we cannot resolve a complaint together, eligible Swedish
          consumers can contact{" "}
          <a
            className="text-ink underline underline-offset-2"
            href="https://www.arn.se/"
            rel="noreferrer"
            target="_blank"
          >
            Allmänna reklamationsnämnden (ARN)
          </a>
          .
        </TermsSection>

        <TermsSection title="Privacy">
          Information about personal data, analytics and cookies is available in our{" "}
          <Link className="text-ink underline underline-offset-2" to="/privacy">
            privacy policy
          </Link>
          .
        </TermsSection>
      </div>
    </main>
  );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <p className="mt-3">{children}</p>
    </section>
  );
}
