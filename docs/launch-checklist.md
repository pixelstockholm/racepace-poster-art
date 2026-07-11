# Racepace launch checklist

Do not enable real payments until every required item is checked.

## Storefront

- [ ] Production environment defines all three `VITE_SHOPIFY_*` values.
- [ ] Product variants and prices match Shopify for A3, A2, 50x70cm, and 70x100cm.
- [ ] A test cart reaches Shopify checkout with every field in `order-contract.md`.
- [ ] Build and lint pass from a clean checkout.

## Private admin app

- [ ] The implementation satisfies `order-contract.md`.
- [ ] Webhook endpoint is HTTPS and subscribed to `orders/paid`.
- [ ] HMAC failure returns 401; duplicate valid delivery returns 200 without side effects.
- [ ] Failed processing is visible and alertable.
- [ ] Shopify recovery/import has been tested.
- [ ] Production handoff is impossible until manual approval.

## First paid validation

- [ ] Shopify Payments test mode has passed end to end.
- [ ] One low-risk real order has passed payment, admin review, approval, production, and completion.
- [ ] Refund and reprint ownership is documented.
