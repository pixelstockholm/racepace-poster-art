import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { PosterPreview, THEMES, type PosterTheme } from "@/components/PosterPreview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { getRoutePath } from "@/lib/raceRoutes";

import { fetchPosterProduct, useCartStore, type ShopifyVariant } from "@/lib/shopify";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Design your poster — Racepace" },
      {
        name: "description",
        content:
          "Customize your marathon poster: name, race, finishing time, color theme and size. Live preview as you design.",
      },
      { property: "og:title", content: "Design your poster — Racepace" },
      {
        property: "og:description",
        content: "Design a premium personalized marathon poster in minutes.",
      },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  // Form state
  const [raceId, setRaceId] = useState<string>("berlin");
  const [customRace, setCustomRace] = useState<string>("");
  const [useCustom, setUseCustom] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("03:24:17");
  const [date, setDate] = useState(findRaceById("berlin")?.date ?? "");
  const [theme, setTheme] = useState<PosterTheme>("cream");
  const [size, setSize] = useState<string>("A2");
  const [racePickerOpen, setRacePickerOpen] = useState(false);

  // When race changes, auto-fill the date
  useEffect(() => {
    if (!useCustom) {
      const r = findRaceById(raceId);
      if (r) setDate(r.date);
    }
  }, [raceId, useCustom]);

  const raceLabel = useCustom
    ? customRace
    : findRaceById(raceId)?.name ?? "";

  // Shopify product
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["poster-product"],
    queryFn: fetchPosterProduct,
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

  const handleAdd = async () => {
    if (!product || !selectedVariant) return;
    if (!raceLabel.trim()) {
      toast.error("Please choose or enter a race.");
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
      { key: "Theme", value: THEMES[theme].label },
      { key: "Size", value: size },
    ];

    await addItem({
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      productTitle: product.node.title,
      imageUrl: product.node.images.edges[0]?.node?.url ?? null,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
      attributes,
    });

    toast.success("Added to cart", {
      description: `${raceLabel.trim()} · ${size}`,
    });
  };

  const sizes = ["A3", "A2", "50x70cm", "70x100cm"];

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-10 pb-24">
      <div className="mb-10">
        <p className="eyebrow">Design</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">
          Build your poster.
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Every detail updates the preview in real time. When it feels right, add it to your cart.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Form */}
        <div className="lg:col-span-5 space-y-8">
          {/* Race picker */}
          <div>
            <Label className="eyebrow">Race</Label>
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
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                {useCustom ? "← Pick from list" : "Race not listed? Enter it manually →"}
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="eyebrow">Finisher name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alexander Müller"
              className="mt-3 h-12 rounded-none"
              maxLength={40}
            />
          </div>

          {/* Time & date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="time" className="eyebrow">Finish time</Label>
              <Input
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:MM:SS"
                className="mt-3 h-12 rounded-none tabular-nums"
              />
            </div>
            <div>
              <Label htmlFor="date" className="eyebrow">Race date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-3 h-12 rounded-none"
              />
            </div>
          </div>

          {/* Theme */}
          <div>
            <Label className="eyebrow">Color theme</Label>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(Object.keys(THEMES) as PosterTheme[]).map((key) => {
                const t = THEMES[key];
                const active = theme === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setTheme(key)}
                    className={cn(
                      "border p-3 flex items-center gap-3 text-left transition-colors",
                      active
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50",
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-8 w-8 inline-block border border-black/10"
                      style={{ backgroundColor: t.bg }}
                    />
                    <span className="text-sm">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size */}
          <div>
            <Label className="eyebrow">Size</Label>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sizes.map((s) => {
                const v = variantBySize.get(s);
                const active = size === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "border p-3 flex flex-col items-start text-left transition-colors",
                      active
                        ? "border-foreground"
                        : "border-border hover:border-foreground/50",
                    )}
                  >
                    <span className="text-sm">{s}</span>
                    <span className="text-xs text-muted-foreground mt-1 tabular-nums">
                      {v ? `${v.price.currencyCode} ${parseFloat(v.price.amount).toFixed(0)}` : "—"}
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
                {selectedVariant
                  ? `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
                  : "—"}
              </span>
            </div>
            <Button
              onClick={handleAdd}
              disabled={!selectedVariant || isAdding || productLoading}
              className="w-full h-14 rounded-none text-sm tracking-widest uppercase"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : productLoading ? (
                "Loading…"
              ) : (
                "Add to cart"
              )}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Free worldwide shipping on orders over €100. Printed and shipped within 5 business days.
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
