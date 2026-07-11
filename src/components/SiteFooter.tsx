import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule/60 bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid gap-12 md:grid-cols-12 items-start">
          <div className="md:col-span-7">
            <div className="font-serif text-4xl md:text-5xl tracking-[-0.04em]">Racepace</div>
            <p className="mt-7 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Lasting editions of the races that changed us.
            </p>
          </div>
          <nav className="md:col-span-5 grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
            <FooterLink to="/shop" label="Editions" />
            <FooterLink to="/about" label="About" />
            <FooterLink to="/faq" label="FAQ" />
            <FooterLink to="/contact" label="Contact" />
          </nav>
        </div>
      </div>
      <div className="border-t border-rule/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-muted-foreground">
          <span>© {new Date().getFullYear()} Racepace</span>
          <span>Stockholm, Sweden</span>
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
