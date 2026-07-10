import { Link, useLocation } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navClass = `hidden md:inline text-xs tracking-[0.18em] uppercase pb-0.5 transition-colors ${
    isHome
      ? "text-paper/85 border-b border-transparent hover:text-paper hover:border-paper/45"
      : "text-foreground/75 border-b border-transparent hover:text-foreground hover:border-foreground/45"
  }`;

  return (
    <header className={`absolute top-0 inset-x-0 z-40 ${isHome ? "" : "relative bg-background/85 backdrop-blur-md border-b border-border"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className={`font-serif text-xl tracking-tight transition-colors ${isHome ? "text-paper hover:text-paper/70" : "text-foreground hover:text-primary"}`}
        >
          Racepace
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/shop" className={navClass}>Shop</Link>
            <Link to="/about" className={navClass}>About</Link>
            <Link to="/faq" className={navClass}>FAQ</Link>
          </nav>
          <CartDrawer triggerClassName={isHome ? "relative inline-flex items-center gap-2 text-sm tracking-wide text-paper hover:text-paper/70 transition-colors" : undefined} />
        </div>
      </div>
    </header>
  );
}
