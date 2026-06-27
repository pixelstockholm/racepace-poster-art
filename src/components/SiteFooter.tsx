import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl leading-tight max-w-sm">
            Your race. Your story. On your wall.
          </p>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Racepace makes personalized posters for finishers. Printed on archival paper, shipped worldwide.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/create" className="hover:text-primary">Design a poster</Link></li>
            <li><Link to="/faq" className="hover:text-primary">Sizes &amp; paper</Link></li>
            <li><Link to="/faq" className="hover:text-primary">Shipping</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Racepace. All rights reserved.</span>
          <span className="tracking-widest uppercase">Made for finishers</span>
        </div>
      </div>
    </footer>
  );
}
