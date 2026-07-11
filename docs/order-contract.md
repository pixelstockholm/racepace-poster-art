# Racepace paid-order contract

This is the launch contract between the storefront, Shopify, and the private admin app.
The admin app is the system of record for production state; Shopify is the system of
record for payment and customer order data.

## Shopify event

- Subscribe to `orders/paid` (not `orders/create`) so unpaid orders never enter production.
- Verify `X-Shopify-Hmac-Sha256` against the raw request body before parsing JSON.
- Persist `X-Shopify-Event-Id` with a unique constraint. A repeated event returns HTTP 200
  without repeating side effects.
- Persist the Shopify order GraphQL ID with a unique constraint as a second idempotency guard.
- Return a non-2xx response on temporary storage failure so Shopify retries the event.
- Never log the webhook secret, full customer record, or raw authorization headers.

## Required line-item data

Every Racepace poster line must contain:

- Shopify variant ID, title, quantity, unit price, and currency
- `Name`, `Race`, `Date`, `Finish time`, `Size`
- `_race_id`, `_race_city`, `_race_country`, `_race_year`
- `_route_verified=true`
- `_poster_theme`, `_poster_size`
- `_design_status=pending_review`
- `_fulfillment_status=awaiting_admin_approval`
- `_source=racepace_web`
- `_production_schema=1`

Reject the line into an `issue` state when a required field is missing, the route is not
verified, the schema is unsupported, or the paid Shopify price/variant is unexpected.
Never silently fill missing production data from current race defaults.

## State machine

Allowed production transitions:

`pending_review -> in_review -> approved -> production -> completed`

`pending_review`, `in_review`, and `approved` may transition to `issue`. Refund state is
recorded separately from production state.

Only an authenticated, explicit manual action may perform `in_review -> approved` for the
first ten orders. Webhooks and imports can only create or update an order in
`pending_review`/`issue`; they must never approve or send it to production.

## Recovery

The admin app must provide an authenticated “Import from Shopify” action accepting an order
ID or order name. It fetches the canonical order through Shopify Admin GraphQL, then runs the
same validation and idempotent upsert used by the webhook. It must not be a separate parsing
path.

## Minimum launch test

1. Place one Shopify test-mode order for every size variant.
2. Confirm exact price, currency, race, year, name, time, size, and all hidden attributes.
3. Replay the same signed webhook twice; exactly one admin order must exist.
4. Force storage failure; confirm non-2xx and successful Shopify retry.
5. Delete the admin test order and restore it through “Import from Shopify”.
6. Confirm no production handoff is possible before manual approval.
7. Approve manually and confirm exactly one production handoff.
