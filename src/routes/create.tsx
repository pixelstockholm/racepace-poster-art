import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { PosterPreview, type PosterTheme } from "@/components/PosterPreview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { RACES, findRaceById } from "@/lib/races";
import { getRoutePath, isRouteVerified } from "@/lib/raceRoutes";

import {
  fetchPosterProduct,
  formatShopifyMoney,
  useCartStore,
  type ShopifyVariant,
} from "@/lib/shopify";
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

function CreatePage() {
  const { race: raceParam } = Route.useSearch();
  const initialRaceId = raceParam && findRaceById(raceParam) ? raceParam : "berlin";

  // Form state
  const [raceId, setRaceId] = useState<string>(initialRaceId);
  const [customRace, setCustomRace] = useState<string>("");
  const [useCustom, setUseCustom] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("03:24:17");
  const [date, setDate] = useState(findRaceById(initialRaceId)?.date ?? "");
  const [theme, setTheme] = useState<PosterTheme>("cream");
  const [size, setSize] = useState<string>("A2");
  const [racePickerOpen, setRacePickerOpen] = useState(false);
  const currentRace = findRaceById(raceId);

  // When race changes, auto-fill the date
  useEffect(() => {
    if (!useCustom) {
      const r = findRaceById(raceId);
      if (r) setDate(r.date);
    }
  }, [raceId, useCustom]);

  const raceLabel = useCustom ? customRace : (currentRace?.name ?? "");
  const routeAvailable = useCustom ? false : isRouteVerified(raceId);

  // Shopify product
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["poster-product"],
    queryFn: fetchPosterProduct,
    enabled: routeAvailable,
  });

  const variantBySize = useMemo(() => {
    const map = new Map<string, ShopifyVariant>();
    product?.node.variants.edges.forEach((e) => {
      const sizeOpt = e.node.selectedOptions.find((o) => o.name.toLowerCase() === "size");
      if (sizeOpt) map.set(sizeOpt.value, e.node);
    });
    return map;
  }, [product]);

  const selectedVariant = variantBySize.get(size);
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
        description: "Choose an available edition or request this race for the archive.",
      });
      return;
    }
    if (!product || !selectedVariant) return;
    if (!raceLabel.trim()) {
      toast.error("Please choose or enter a race.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    const timeMatch = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(time.trim());
    if (
      !timeMatch ||
      Number(timeMatch[1]) > 23 ||
      Number(timeMatch[2]) > 59 ||
      Number(timeMatch[3]) > 59
    ) {
      toast.error("Time should look like HH:MM:SS (e.g. 03:24:17).");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      toast.error("Please enter a valid race date.");
      return;
    }
    if (!selectedVariant.availableForSale) {
      toast.error("This size is currently unavailable.");
      return;
    }

    const raceYear = date.slice(0, 4);

    const attributes = [
      { key: "Name", value: name.trim() },
      { key: "Race", value: raceLabel.trim() },
      { key: "Date", value: date || "—" },
      { key: "Finish time", value: time.trim() },
      { key: "Size", value: size },
      { key: "_race_id", value: raceId },
      { key: "_race_city", value: currentRace?.city ?? "" },
      { key: "_race_country", value: currentRace?.country ?? "" },
      { key: "_race_year", value: raceYear },
      { key: "_route_verified", value: String(routeAvailable) },
      { key: "_poster_theme", value: theme },
      { key: "_poster_size", value: size },
      { key: "_design_status", value: "pending_review" },
      { key: "_fulfillment_status", value: "awaiting_admin_approval" },
      { key: "_source", value: "racepace_web" },
      { key: "_production_schema", value: "1" },
    ];

    const added = await addItem({
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      productTitle: `${currentRace?.city ?? "Racepace"} Marathon Edition ${raceYear}`,
      imageUrl: product.node.images.edges[0]?.node?.url ?? null,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
      attributes,
    });

    if (added) {
      trackAddToCart({
        content_ids: [selectedVariant.id],
        content_name: `${currentRace?.city ?? "Racepace"} Marathon Edition ${raceYear}`,
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

  const sizes = ["A3", "A2", "50x70cm", "70x100cm"];
  const editionCity = useCustom ? customRace || "Custom race" : (currentRace?.city ?? "Race");
  const editionLocation = currentRace
    ? `${currentRace.city}, ${currentRace.country}`
    : "Route pending";

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-10 pb-24">
      <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="eyebrow">Racepace Edition</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">
            {editionCity} Edition
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            A personalized marathon print built around the route, city and details of your race.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[0.62rem] tracking-[0.22em] uppercase">
          <span className="border border-border px-3 py-2 text-muted-foreground">
            {editionLocation}
          </span>
          <span
            className={`border px-3 py-2 ${routeAvailable ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}
          >
            {routeAvailable ? "Verified route" : "Archive queue"}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Form */}
        <div className="lg:col-span-5 space-y-8">
          {/* Race picker */}
          <div>
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl leading-none">01</span>
              <Label className="eyebrow">Edition</Label>
            </div>
            <div className="mt-3 space-y-3">
              {!useCustom ? (
                <Popover open={racePickerOpen} onOpenChange={setRacePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between h-12 rounded-none font-normal text-left"
                    >
                      <span className="truncate">
                        {findRaceById(raceId)?.name ?? "Select a race…"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search marathons…" />
                      <CommandList>
                        <CommandEmpty>No race found.</CommandEmpty>
                        <CommandGroup>
                          {RACES.map((race) => (
                            <CommandItem
                              key={race.id}
                              value={`${race.name} ${race.city}`}
                              onSelect={() => {
                                setRaceId(race.id);
                                setRacePickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  raceId === race.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{race.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {race.city}, {race.country}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  value={customRace}
                  onChange={(e) => setCustomRace(e.target.value)}
                  placeholder="Enter your race name"
                  className="h-12 rounded-none"
                />
              )}
              <button
                type="button"
                onClick={() => setUseCustom((v) => !v)}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                {useCustom ? "← Pick from list" : "Race not listed? Request archive addition →"}
              </button>
              {!routeAvailable && !useCustom && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This route is in the archive queue and is not available for checkout yet.
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-6 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl leading-none">02</span>
              <Label className="eyebrow">Personal details</Label>
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
                className="mt-3 h-12 rounded-none"
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
                  className="mt-3 h-12 rounded-none tabular-nums"
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
                  className="mt-3 h-12 rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <span className="font-serif text-2xl leading-none">03</span>
              <Label className="eyebrow">Format</Label>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sizes.map((s) => {
                const v = variantBySize.get(s);
                const active = size === s;
                const unavailable = !v?.availableForSale;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    disabled={unavailable}
                    className={cn(
                      "border p-3 flex flex-col items-start text-left transition-colors",
                      active && !unavailable
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50 disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    <span className="text-sm">{s}</span>
                    <span className="text-xs text-muted-foreground mt-1 tabular-nums">
                      {v?.availableForSale ? formatShopifyMoney(v.price) : "Unavailable"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to cart */}
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="eyebrow">Total</span>
              <span className="font-serif text-3xl tabular-nums">
                {selectedVariant ? formatShopifyMoney(selectedVariant.price) : "—"}
              </span>
            </div>
            <Button
              onClick={handleAdd}
              disabled={
                !selectedVariant?.availableForSale || isAdding || productLoading || !routeAvailable
              }
              className="w-full h-14 rounded-none bg-ink text-paper text-sm tracking-widest uppercase hover:bg-ink/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !routeAvailable ? (
                "Route coming soon"
              ) : productLoading ? (
                "Loading…"
              ) : (
                "Add to cart"
              )}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Printed on archival matte paper. Each route is reviewed before production.
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <div className="bg-secondary/40 border border-border p-8 lg:p-14 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <PosterPreview
                config={{
                  name,
                  race: raceLabel,
                  date,
                  time,
                  theme,
                  routePath: getRoutePath(useCustom ? undefined : raceId),
                  raceId: useCustom ? undefined : raceId,
                  location: useCustom
                    ? undefined
                    : (() => {
                        const r = findRaceById(raceId);
                        return r ? `${r.city}, ${r.country}` : undefined;
                      })(),
                  distanceKm: 42.195,
                }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Live preview · final print on 230gsm archival matte paper.
          </p>
        </div>
      </div>
    </main>
  );
}
