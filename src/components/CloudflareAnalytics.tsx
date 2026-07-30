import { useEffect } from "react";

// Cloudflare's site token is public by design and appears in the browser snippet.
const CLOUDFLARE_TOKEN =
  import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim() ?? "933bdaad372e418897d6b543463d6a55";

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
