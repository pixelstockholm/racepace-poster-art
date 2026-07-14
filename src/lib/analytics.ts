export type AnalyticsConsent = "accepted" | "declined";

const CONSENT_KEY = "racepace_analytics_consent";
const CONSENT_EVENT = "racepace:analytics-consent";
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

type MetaEventData = Record<string, string | number | string[] | Array<Record<string, unknown>>>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"];
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (!isBrowser()) return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function setAnalyticsConsent(value: AnalyticsConsent): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onAnalyticsConsentChange(
  listener: (value: AnalyticsConsent | null) => void,
): () => void {
  if (!isBrowser()) return () => undefined;

  const handleConsent = (event: Event) => {
    listener((event as CustomEvent<AnalyticsConsent>).detail ?? getAnalyticsConsent());
  };
  const handleOpen = () => listener(null);

  window.addEventListener(CONSENT_EVENT, handleConsent);
  window.addEventListener("racepace:open-cookie-settings", handleOpen);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handleConsent);
    window.removeEventListener("racepace:open-cookie-settings", handleOpen);
  };
}

export function openCookieSettings(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("racepace:open-cookie-settings"));
}

function initializeMetaPixel(): boolean {
  if (!isBrowser() || !META_PIXEL_ID || getAnalyticsConsent() !== "accepted") return false;

  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    } as Window["fbq"];

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.racepaceMetaPixel = "true";
    document.head.appendChild(script);
  }

  if (!document.documentElement.dataset.metaPixelInitialized) {
    window.fbq?.("init", META_PIXEL_ID);
    document.documentElement.dataset.metaPixelInitialized = "true";
  }

  return true;
}

function track(event: string, data?: MetaEventData): void {
  if (!initializeMetaPixel()) return;
  if (data) window.fbq?.("track", event, data);
  else window.fbq?.("track", event);
}

export function trackPageView(): void {
  track("PageView");
}

export function trackViewContent(data: MetaEventData): void {
  track("ViewContent", data);
}

export function trackAddToCart(data: MetaEventData): void {
  track("AddToCart", data);
}

export function trackInitiateCheckout(data: MetaEventData): void {
  track("InitiateCheckout", data);
}

