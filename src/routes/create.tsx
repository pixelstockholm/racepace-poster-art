import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PosterPreview } from "@/components/PosterPreview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { findRaceById, raceEditionSubtitle, raceEditionTitle } from "@/lib/races";
import { getRoutePath, isRouteVerified } from "@/lib/raceRoutes";

import { fetchPosterProduct, useCartStore, type ShopifyVariant } from "@/lib/shopify";
import { trackAddToCart, trackViewContent } from "@/lib/analytics";

export const Route = createFileRoute("/create")({
  validateSearch: (search: Record<string, unknown>) => ({
    race: typeof search.race === "string" ? search.race : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Personalize your poster — Racepace" },
      {
        name: "description",
        content:
          "Add your name, finishing time and date to a Racepace marathon poster. Live preview as you customize.",
      },
      { property: "og:title", content: "Personalize your poster — Racepace" },
      {
        property: "og:description",
        content: "Personalize a premium marathon poster in minutes.",
      },
    ],
  }),
  component: CreatePage,
});

function formatVariantPrice(variant?: ShopifyVariant): string {
  if (!variant) return "Preparing";
  const amount = Number.parseFloat(variant.price.amount);
  const currency = variant.price.currencyCode === "SEK" ? "SEK" : variant.price.currencyCode;
  return `${currency} ${Number.isFinite(amount) ? amount.toFixed(0) : variant.price.amount}`;
}

function normalizeSizeValue(value: string): string {
  return value.toLowerCase().replace(/[×x]/g, "x").replace(/\s/g, "");
}

function variantSizeKey(variant: ShopifyVariant): string | null {
  const candidates = [
    variant.title,
    ...variant.selectedOptions.flatMap((option) => [option.name, option.value]),
  ].map(normalizeSizeValue);

  if (candidates.some((value) => value.includes("70x100"))) return "70x100cm";
  if (candidates.some((value) => value.includes("50x70"))) return "50x70cm";
  if (candidates.some((value) => value.includes("30x40") || value === "a3")) return "30x40cm";
  return null;
}

function CreatePage() {
  const { race: raceParam } = Route.useSearch();
  const initialRaceId = raceParam && findRaceById(raceParam) ? raceParam : "berlin";
  const raceId = initialRaceId;

  // Form state
  const [name, setName] = useState("");
  const [time, setTime] = useState("03:24:17");
  const [date, setDate] = useState(findRaceById(initialRaceId)?.date ?? "");
  const [size, setSize] = useState<string>("50x70cm");
  const currentRace = findRaceById(raceId);

  const raceLabel = currentRace?.name ?? "";
  const routeAvailable = isRouteVerified(raceId);

  // Shopify product
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["poster-product"],
    queryFn: fetchPosterProduct,
    enabled: routeAvailable,
    retry: false,
  });

  const variantBySize = useMemo(() => {
    const map = new Map<string, ShopifyVariant>();
    product?.node.variants.edges.forEach((e) => {
      const key = variantSizeKey(e.node);
      if (key) map.set(key, e.node);
    });
    return map;
  }, [product]);

  const selectedVariant = variantBySize.get(normalizeSizeValue(size));
  const selectedVariantUnavailable = Boolean(selectedVariant && !selectedVariant.availableForSale);
  const addItem = useCartStore((s) => s.addItem);
  const isAdding = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!selectedVariant || !currentRace) return;
    trackViewContent({
      content_ids: [selectedVariant.id],
      content_name: `${currentRace.city} Marathon Edition`,
      content_type: "product",
      value: Number(selectedVariant.price.amount),
      currency: selectedVariant.price.currencyCode,
    });
  }, [currentRace, selectedVariant]);

  const handleAdd = async () => {
    if (!routeAvailable) {
      toast.error("This route is not ready yet.", {
        description: "Return to the archive and choose an available edition.",
      });
      return;
    }
    if (!product || !selectedVariant) return;
    if (!raceLabel.trim()) {
      toast.error("Please choose an available edition.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^\d{1,2}:\d{2}:\d{2}$/.test(time.trim())) {
      toast.error("Time should look like HH:MM:SS (e.g. 03:24:17).");
      return;
    }

    const attributes = [
      { key: "Name", value: name.trim() },
      { key: "Race", value: raceLabel.trim() },
      { key: "Date", value: date || "—" },
      { key: "Finish time", value: time.trim() },
      { key: "Edition color", value: currentRace ? `${currentRace.city} palette` : "Custom" },
      { key: "Size", value: normalizeSizeValue(size) },
      { key: "_race_id", value: raceId },
      { key: "_race_city", value: currentRace?.city ?? "" },
      { key: "_race_country", value: currentRace?.country ?? "" },
      { key: "_route_verified", value: String(routeAvailable) },
      { key: "_poster_theme", value: "city_palette" },
      { key: "_poster_size", value: normalizeSizeValue(size) },
      { key: "_design_status", value: "pending_review" },
      { key: "_fulfillment_status", value: "awaiting_admin_approval" },
      { key: "_source", value: "racepace_web" },
    ];

    const added = await addItem({
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      productTitle: product.node.title,
      imageUrl: product.node.images.edges[0]?.node?.url ?? null,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
      attributes,
    });

    if (added) {
      trackAddToCart({
        content_ids: [selectedVariant.id],
        content_name: `${currentRace?.city ?? "Racepace"} Marathon Edition`,
        content_type: "product",
        value: Number(selectedVariant.price.amount),
        currency: selectedVariant.price.currencyCode,
        num_items: 1,
      });
      toast.success("Added to cart", {
        description: `${raceLabel.trim()} · ${size}`,
      });
    } else {
      toast.error("Could not add the poster to your cart.", {
        description: "Nothing was charged. Please try again.",
      });
    }
  };

  const sizes = [
    { value: "30x40cm", label: "Classic", detail: "30x40 cm" },
    { value: "50x70cm", label: "Gallery", detail: "50x70 cm", badge: "Most popular" },
    { value: "70x100cm", label: "Statement", detail: "70x100 cm" },
  ];
  const editionCity = currentRace?.city ?? "Race";
  const editionLocation = currentRace
    ? `${currentRace.city}, ${currentRace.country}`
    : "Route pending";

  const selectedPrice = selectedVariant
    ? formatVariantPrice(selectedVariant)
    : productError
      ? "Setup needed"
      : "Preparing";

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-6 pb-24">
      <a
        href="/shop"
        className="mb-6 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to archive
      </a>

      <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="eyebrow">Racepace Edition</p>
          <h1 className="font-serif text-4xl md:text-[3.25rem] mt-3 leading-[0.98] tracking-tight">
            {editionCity} Edition
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            Personalize the route with your name, finish time and race date.
          </p>
        </div>
        <div className="hidden lg:block text-right text-[0.62rem] tracking-[0.22em] uppercase text-muted-foreground">
          {editionLocation}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Form */}
        <div className="lg:col-span-5 space-y-7">
          {/* Edition */}
          <div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <Label className="eyebrow">Edition</Label>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                01
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-start justify-between gap-4 py-1">
                <div>
                  <p className="font-serif text-xl leading-tight">
                    {currentRace ? raceEditionTitle(currentRace) : "Selected edition"} ·{" "}
                    <span className="text-foreground/70">
                      {currentRace ? raceEditionSubtitle(currentRace) : editionLocation}
                    </span>
                  </p>
                  {currentRace && (
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {currentRace.country}
                    </p>
                  )}
                </div>
                <a
                  href="/shop"
                  className="shrink-0 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Change
                </a>
              </div>
              {!routeAvailable && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This route is in the archive queue and is not available for checkout yet.
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <Label className="eyebrow">Finisher details</Label>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                02
              </span>
            </div>
            <div>
              <Label htmlFor="name" className="eyebrow">
                Finisher name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alexander Müller"
                className="mt-3 h-12 rounded-none border-border bg-transparent shadow-none"
                maxLength={40}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="time" className="eyebrow">
                  Finish time
                </Label>
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="HH:MM:SS"
                  className="mt-3 h-12 rounded-none border-border bg-transparent shadow-none tabular-nums"
                />
              </div>
              <div>
                <Label htmlFor="date" className="eyebrow">
                  Race date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-3 h-12 rounded-none border-border bg-transparent shadow-none"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
              <Label className="eyebrow">Format</Label>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                03
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sizes.map((s) => {
                const v = variantBySize.get(normalizeSizeValue(s.value));
                const active = size === s.value;
                return (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={cn(
                      "relative min-h-[94px] border p-4 flex flex-col items-start text-left transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50",
                    )}
                  >
                    {s.badge && (
                      <span
                        className={cn(
                          "mb-3 text-[0.56rem] uppercase tracking-[0.16em]",
                          active ? "text-background/70" : "text-muted-foreground",
                        )}
                      >
                        {s.badge}
                      </span>
                    )}
                    <span className="font-serif text-xl leading-none">{s.label}</span>
                    <span
                      className={cn(
                        "mt-2 text-[0.62rem] uppercase tracking-[0.16em]",
                        active ? "text-background/70" : "text-muted-foreground",
                      )}
                    >
                      {s.detail}
                    </span>
                    <span
                      className={cn(
                        "mt-auto pt-4 text-xs tabular-nums",
                        active ? "text-background/70" : "text-muted-foreground",
                      )}
                    >
                      {v
                        ? formatVariantPrice(v)
                        : productError
                          ? "Setup needed"
                          : productLoading
                          ? "Checking"
                          : "Unavailable"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to cart */}
          <div className="pt-5 border-t border-border">
            <div className="mb-5 space-y-2.5 text-xs text-muted-foreground">
              {[
                routeAvailable ? "Verified race route" : "Route pending verification",
                "Matte archival paper",
                "Unframed print in standard frame sizes",
                "Shipping shown securely at checkout",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-px w-5 bg-border" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="eyebrow">Total</span>
              <span className="font-serif text-3xl tabular-nums">{selectedPrice}</span>
            </div>
            <Button
              onClick={handleAdd}
              disabled={
                !selectedVariant ||
                isAdding ||
                productLoading ||
                !routeAvailable
              }
              className="w-full h-14 rounded-none bg-ink text-paper text-sm tracking-widest uppercase hover:bg-ink/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !routeAvailable ? (
                "Route coming soon"
              ) : productLoading ? (
                "Preparing checkout..."
              ) : productError ? (
                "Shopify setup missing"
              ) : selectedVariantUnavailable ? (
                "Try checkout"
              ) : (
                "Add personalized print"
              )}
            </Button>
            {productError && (
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Shopify storefront configuration is not available in this environment.
              </p>
            )}
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
              <span>Preview saved</span>
              <span>Unframed print</span>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <div className="border border-border bg-secondary/30 p-5 sm:p-6 lg:p-7">
            <div className="mb-4 flex items-center justify-between gap-4 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
              <span>Live preview</span>
              <span>{selectedPrice}</span>
            </div>
            <div
              className="relative overflow-hidden flex items-center justify-center px-8 py-5 sm:py-6"
              style={{
                background: "linear-gradient(180deg, #F8F6F0 0%, #F1EEE6 100%)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.08]"
                style={{
                  background:
                    "radial-gradient(80% 60% at 35% 12%, rgba(255,255,255,0.95), transparent 58%), radial-gradient(75% 75% at 50% 55%, transparent 58%, rgba(48,38,24,0.13) 100%)",
                }}
              />
              <div className="relative w-full max-w-[248px] sm:max-w-[258px] lg:max-w-[264px]">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-[5%] translate-y-[6%]"
                  style={{
                    background:
                      "radial-gradient(80% 80% at 50% 50%, rgba(31,25,18,0.25) 0%, rgba(31,25,18,0.14) 46%, rgba(31,25,18,0) 78%)",
                    filter: "blur(14px)",
                  }}
                />
                <div className="relative bg-[#090909] p-[5px] shadow-[0_18px_36px_-28px_rgba(28,22,14,0.8)]">
                  <div className="relative overflow-hidden">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 z-10"
                      style={{
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 22%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <PosterPreview
                      config={{
                        name,
                        race: raceLabel,
                        date,
                        time,
                        theme: "cream",
                        routePath: getRoutePath(raceId),
                        raceId,
                        size,
                        location: (() => {
                          const r = findRaceById(raceId);
                          return r ? `${r.city}, ${r.country}` : undefined;
                        })(),
                        distanceKm: 42.195,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center leading-relaxed">
              Your preview and personalization details are saved with the order before production
              approval.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
