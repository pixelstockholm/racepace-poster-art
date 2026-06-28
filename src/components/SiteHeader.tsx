import { Link, useLocation } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className={`sticky top-0 z-40 ${isHome ? "" : "bg-background/85 backdrop-blur-md border-b border-border"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className={`font-serif text-xl tracking-tight transition-colors ${isHome ? "text-paper hover:text-paper/70" : "text-foreground hover:text-primary"}`}
        >
          Racepace
        </Link>
        <nav className={`hidden md:flex items-center gap-10 text-sm tracking-wide ${isHome ? "text-paper" : ""}`}>
          <Link to="/shop" className={`transition-colors ${isHome ? "hover:text-paper/70" : "hover:text-primary"}`} activeProps={{ className: "text-primary" }}>
            Shop
          </Link>
          <Link to="/about" className={`transition-colors ${isHome ? "hover:text-paper/70" : "hover:text-primary"}`} activeProps={{ className: "text-primary" }}>
            About
          </Link>
          <Link to="/faq" className={`transition-colors ${isHome ? "hover:text-paper/70" : "hover:text-primary"}`} activeProps={{ className: "text-primary" }}>
            FAQ
          </Link>
          <Link to="/contact" className={`transition-colors ${isHome ? "hover:text-paper/70" : "hover:text-primary"}`} activeProps={{ className: "text-primary" }}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link
            to="/shop"
            className={`hidden md:inline text-sm tracking-widest uppercase pb-0.5 transition-colors ${isHome ? "text-paper border-b border-paper/40 hover:border-paper" : "text-foreground border-b border-foreground hover:border-primary hover:text-primary"}`}
          >
            Browse posters
          </Link>
          <CartDrawer triggerClassName={isHome ? "relative inline-flex items-center gap-2 text-sm tracking-wide text-paper hover:text-paper/70 transition-colors" : undefined} />
        </div>
      </div>
    </header>
  );
}
