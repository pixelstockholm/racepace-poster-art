import { Link, useLocation } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navClass = cn(
    "hidden md:inline text-[0.62rem] tracking-[0.22em] uppercase transition-colors",
    isHome ? "text-paper/72 hover:text-paper" : "text-foreground/65 hover:text-foreground",
  );

  return (
    <header
      className={cn(
        "inset-x-0 z-40",
        isHome
          ? "absolute top-0 bg-transparent text-paper"
          : "relative bg-background text-foreground border-b border-rule/60",
      )}
    >
      <div className="px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            "font-serif text-xl tracking-[-0.03em] transition-opacity hover:opacity-65",
            isHome ? "text-paper" : "text-foreground",
          )}
        >
          Racepace
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className={navClass}>
              Editions
            </Link>
            <Link to="/about" className={navClass}>
              About
            </Link>
            <Link to="/faq" className={navClass}>
              FAQ
            </Link>
          </nav>
          <CartDrawer
            triggerClassName={
              isHome
                ? "relative inline-flex items-center gap-2 text-sm tracking-wide text-paper hover:text-paper/72 transition-colors"
                : undefined
            }
          />
        </div>
      </div>
    </header>
  );
}
