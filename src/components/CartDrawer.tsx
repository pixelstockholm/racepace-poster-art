import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore, lineKeyOf } from "@/lib/shopify";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);
  const syncCart = useCartStore((s) => s.syncCart);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode ?? "";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center gap-2 text-sm tracking-wide text-foreground hover:text-primary transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-serif text-2xl">Your cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Your cart is empty."
              : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">Nothing here yet.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-6">
                {items.map((item) => {
                  const key = lineKeyOf(item);
                  return (
                    <div key={key} className="flex gap-4 border-b border-border pb-6">
                      <div className="w-20 h-28 bg-secondary flex-shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: "#E8EEF6" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-base leading-tight">{item.productTitle}</h4>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                          {item.selectedOptions.map((o) => o.value).join(" · ")}
                        </p>
                        <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                          {item.attributes
                            .filter((a) => !a.key.startsWith("_"))
                            .map((a) => (
                              <li key={a.key}>
                                <span className="text-foreground/70">{a.key}:</span> {a.value}
                              </li>
                            ))}
                        </ul>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(key, item.quantity - 1)}
                              className="h-6 w-6 inline-flex items-center justify-center border border-border hover:border-foreground"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm w-6 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(key, item.quantity + 1)}
                              className="h-6 w-6 inline-flex items-center justify-center border border-border hover:border-foreground"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm tabular-nums">
                              {item.price.currencyCode}{" "}
                              {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(key)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border bg-background">
                <div className="flex justify-between text-sm">
                  <span className="uppercase tracking-widest text-muted-foreground text-xs">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl tabular-nums">
                    {currency} {totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-none h-12 text-sm tracking-widest uppercase"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Checkout <ExternalLink className="h-3.5 w-3.5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
