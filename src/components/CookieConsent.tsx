import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  getAnalyticsConsent,
  onAnalyticsConsentChange,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics";

export function CookieConsent() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>("declined");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const current = getAnalyticsConsent();
    setConsent(current);
    setIsOpen(current === null);

    return onAnalyticsConsentChange((next) => {
      setConsent(next);
      setIsOpen(next === null);
    });
  }, []);

  const choose = (value: AnalyticsConsent) => {
    setAnalyticsConsent(value);
    setConsent(value);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <section
      role="dialog"
      aria-label="Cookie preferences"
      aria-modal="false"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl border border-ink/20 bg-paper p-5 shadow-2xl sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="eyebrow">Your privacy</p>
          <h2 className="mt-2 font-serif text-xl">Choose how we use cookies</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            We use necessary storage to keep your cart working. With your permission, we also use
            Meta analytics to measure visits, cart activity and advertising performance. Read our{" "}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="h-10 border border-ink/30 px-4 text-[0.65rem] uppercase tracking-[0.18em] hover:border-ink"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="h-10 bg-ink px-4 text-[0.65rem] uppercase tracking-[0.18em] text-paper hover:bg-ink/85"
          >
            Accept analytics
          </button>
        </div>
      </div>
      <span className="sr-only">Current preference: {consent ?? "not selected"}</span>
    </section>
  );
}

