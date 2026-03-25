import Link from "next/link";

export function Footer() {
  return (
        <footer className="mt-auto border-t border-border/40 bg-card/50">
      <div className="container max-w-6xl mx-auto px-4 h-14 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          © 2026 Diagnosta — El Guardián de APIs. Hackatón CubePath.
        </span>
        <nav className="flex items-center gap-6" aria-label="Legal">
          <Link href="/aviso-legal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Aviso Legal</Link>
          <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidad</Link>
          <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
        </nav>
      </div>
    </footer>

  );
}
