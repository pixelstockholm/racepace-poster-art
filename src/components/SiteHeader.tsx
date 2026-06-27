import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-xl tracking-tight text-foreground hover:text-primary transition-colors"
        >
          Racepace
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide">
          <Link to="/shop" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
            Shop
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
            About
          </Link>
          <Link to="/faq" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
            FAQ
          </Link>
          <Link to="/contact" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link
            to="/shop"
            className="hidden md:inline text-sm tracking-widest uppercase border-b border-foreground pb-0.5 hover:border-primary hover:text-primary transition-colors"
          >
            Browse posters
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
