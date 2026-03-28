import Link from "next/link";

export function Footer() {
  return (
        <footer className="mt-auto border-t border-border/40 bg-card/50">
      <div className="container max-w-6xl mx-auto px-4 h-14 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-xs text-muted-foreground">
            © 2026 Diagnosta — El Guardián de APIs. Hackatón CubePath.
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            Elaborado por{" "}
            <a 
              href="https://josegrillo.vercel.app/" 
              target="_blank" 
              className="text-primary/60 hover:text-primary transition-colors underline underline-offset-2 decoration-primary/20"
            >
              Jose Grillo
            </a>
          </span>
        </div>
        <nav className="flex items-center gap-6" aria-label="Legal">
          <Link href="/aviso-legal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Aviso Legal</Link>
          <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidad</Link>
          <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
        </nav>
      </div>
    </footer>

  );
}
