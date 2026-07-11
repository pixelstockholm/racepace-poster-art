import { Link, useLocation } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navClass =
    "hidden md:inline text-[0.62rem] tracking-[0.22em] uppercase transition-opacity text-foreground/65 hover:text-foreground";

  return (
    <header className="relative inset-x-0 z-40 bg-background border-b border-rule/60">
      <div className="px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-xl tracking-[-0.03em] transition-opacity text-foreground hover:opacity-60"
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
                ? "relative inline-flex items-center gap-2 text-sm tracking-wide text-foreground hover:text-foreground/65 transition-colors"
                : undefined
            }
          />
        </div>
      </div>
    </header>
  );
}
