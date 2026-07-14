import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  getAnalyticsConsent,
  onAnalyticsConsentChange,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics";

export function Analytics() {
  const href = useRouterState({ select: (state) => state.location.href });
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    setConsent(getAnalyticsConsent());
    return onAnalyticsConsentChange(setConsent);
  }, []);

  useEffect(() => {
    if (consent === "accepted") trackPageView();
  }, [consent, href]);

  return null;
}

