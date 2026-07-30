export type CampaignAttribution = Partial<
  Record<
    "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "fbclid",
    string
  >
>;

const ATTRIBUTION_KEY = "racepace_campaign_attribution";
const ATTRIBUTION_FIELDS: Array<keyof CampaignAttribution> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
];
const MAX_VALUE_LENGTH = 250;

let pendingAttribution: CampaignAttribution = {};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function sanitize(value: string | null): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, MAX_VALUE_LENGTH) : undefined;
}

function readStoredAttribution(): CampaignAttribution {
  if (!isBrowser()) return {};

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};

    return Object.fromEntries(
      ATTRIBUTION_FIELDS.flatMap((field) => {
        const value = typeof parsed[field] === "string" ? sanitize(parsed[field]) : undefined;
        return value ? [[field, value]] : [];
      }),
    );
  } catch {
    return {};
  }
}

export function captureCampaignAttribution(): void {
  if (!isBrowser()) return;

  const params = new URLSearchParams(window.location.search);
  const captured = Object.fromEntries(
    ATTRIBUTION_FIELDS.flatMap((field) => {
      const value = sanitize(params.get(field));
      return value ? [[field, value]] : [];
    }),
  ) as CampaignAttribution;

  if (Object.keys(captured).length > 0) {
    pendingAttribution = { ...pendingAttribution, ...captured };
  }
}

export function persistCampaignAttribution(): void {
  if (!isBrowser()) return;

  const attribution = { ...readStoredAttribution(), ...pendingAttribution };
  if (Object.keys(attribution).length > 0) {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  }
}

export function clearCampaignAttribution(): void {
  if (!isBrowser()) return;
  pendingAttribution = {};
  window.sessionStorage.removeItem(ATTRIBUTION_KEY);
}

export function getCampaignAttribution(): CampaignAttribution {
  return readStoredAttribution();
}

export function getCampaignLineAttributes(): Array<{ key: string; value: string }> {
  return Object.entries(getCampaignAttribution()).map(([key, value]) => ({
    key: `_${key}`,
    value,
  }));
}

export function addCampaignAttributionToUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    Object.entries(getCampaignAttribution()).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return rawUrl;
  }
}
