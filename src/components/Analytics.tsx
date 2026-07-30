import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  getAnalyticsConsent,
  onAnalyticsConsentChange,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics";
import {
  captureCampaignAttribution,
  clearCampaignAttribution,
  persistCampaignAttribution,
} from "@/lib/attribution";

export function Analytics() {
  const href = useRouterState({ select: (state) => state.location.href });
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    captureCampaignAttribution();
    const current = getAnalyticsConsent();
    setConsent(current);
    if (current === "accepted") persistCampaignAttribution();

    return onAnalyticsConsentChange((next) => {
      setConsent(next);
      if (next === "accepted") persistCampaignAttribution();
      if (next === "declined") clearCampaignAttribution();
    });
  }, []);

  useEffect(() => {
    captureCampaignAttribution();
    if (consent === "accepted") persistCampaignAttribution();
    if (consent === "accepted") trackPageView();
  }, [consent, href]);

  return null;
}
