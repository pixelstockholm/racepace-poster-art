import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-rule/60 bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid gap-12 md:grid-cols-12 items-start">
          <div className="md:col-span-6">
            <div className="font-serif text-2xl tracking-tight">Racepace</div>
            <p className="mt-5 text-sm text-muted-foreground max-w-sm leading-relaxed">
              A race deserves more than a medal. Editorial marathon prints,
              printed on archival paper and shipped worldwide.
            </p>
          </div>
          <nav className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <FooterLink to="/shop" label="Shop" />
            <FooterLink to="/about" label="About" />
            <FooterLink to="/faq" label="FAQ" />
            <FooterLink to="/contact" label="Contact" />
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground hover:text-ink"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>
      <div className="border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
          <span>© {new Date().getFullYear()} Racepace</span>
          <span>Printed in Europe</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground hover:text-ink"
    >
      {label}
    </Link>
  );
}
