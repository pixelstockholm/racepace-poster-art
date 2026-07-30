import { useEffect } from "react";

const CLOUDFLARE_TOKEN = import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

export function CloudflareAnalytics() {
  useEffect(() => {
    if (!CLOUDFLARE_TOKEN || document.querySelector("script[data-racepace-cloudflare]")) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token: CLOUDFLARE_TOKEN });
    script.dataset.racepaceCloudflare = "true";
    document.head.appendChild(script);
  }, []);

  return null;
}
