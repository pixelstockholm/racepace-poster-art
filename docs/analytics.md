# Racepace analytics

## Production variables

- `VITE_META_PIXEL_ID`: Meta dataset/pixel ID. Meta events load only after analytics consent.
- `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN`: Cloudflare Web Analytics site token. The beacon is
  privacy-first and measures anonymous page views and performance without cookies.

## Funnel events

- `PageView`: every storefront route after Meta analytics consent.
- `ViewContent`: the poster creator after product data is available and consent is accepted.
- `AddToCart`: after Shopify confirms that the personalized line was added.
- `InitiateCheckout`: immediately before the Shopify checkout redirect.
- `Purchase`: sent from the Shopify/Meta partner integration, not from the storefront.

Campaign parameters (`utm_*` and `fbclid`) are retained for the browser session after analytics
consent and attached to Shopify line attributes. They are also forwarded into the initial checkout
redirect, although Shopify may remove them when it canonicalizes the checkout URL.

## Launch verification

1. Open a private window with Meta Test Events running.
2. Visit a URL containing test `utm_source`, `utm_medium`, `utm_campaign` and `utm_content`.
3. Accept analytics and verify `PageView`.
4. Open an edition and verify `ViewContent`.
5. Add a personalized print and verify `AddToCart`.
6. Start checkout and verify `InitiateCheckout`.
7. Confirm the Shopify cart line contains the private campaign attributes.
8. Confirm Cloudflare Web Analytics records the anonymous page view.
