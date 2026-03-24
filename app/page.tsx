import Link from "next/link";
import { Suspense } from "react"; 
import { Shield, Brain, Globe, Bell, ArrowRight, Play } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModal } from "@/components/auth-modal";

const FEATURES = [
  {
    icon: Brain,
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
    title: "IA Diagnóstico",
    description:
      "El motor neuronal analiza patrones de latencia y detecta la causa raíz antes de que el usuario lo reporte.",
  },
  {
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Status Público",
    description:
      "Genera páginas de status públicas por endpoint. Tus clientes ven en tiempo real si el servicio funciona.",
  },
  {
    icon: Bell,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    title: "Alertas Predictivas",
    description:
      "No espera el corte total. Detecta degradación y alerta con Telegram o email antes del downtime.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

     

      {/* ── NAVBAR ─────────────────────────────────── */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground tracking-tight">Diagnosta</span>
          </div>
          <nav className="flex items-center gap-6">
             {/* Botón de tema */}
            <ThemeToggle />
            <Link
              href="?auth=login"
              className="text-sm font-semibold bg-primary text-primary-foreground rounded-lg px-5 py-2 hover:opacity-90 transition-opacity shadow-sm"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28 gap-8 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.46 0.18 155 / 8%) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Monitoreo en Tiempo Real
        </div>

        <h1 className="relative text-5xl sm:text-7xl font-extrabold text-foreground tracking-tighter leading-none max-w-3xl">
          Diagnosta: El Guardián<br />
          <span className="text-primary">Inteligente de tus APIs</span>
        </h1>

        <p className="relative text-lg text-muted-foreground max-w-xl leading-relaxed">
          Detecta caídas, analiza latencias con IA y alerta a tu equipo{" "}
          <strong className="text-foreground">antes</strong> de que el cliente lo note.
        </p>

                <div className="relative flex flex-col items-center gap-4 justify-center">
          <Link
            href="?auth=register"
            id="cta-empezar"
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-8 py-3.5 text-base font-bold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-lg shadow-primary/25"
          >
            Empezar Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <Link href="?auth=login" className="text-foreground hover:underline font-medium">Inicia Sesión</Link>
          </p>
        </div>

      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-28 w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            Por qué Diagnosta
          </p>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Más que un monitor de uptime
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, color, bg, title, description }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors duration-300"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Diagnosta — Hackatón CubePath
          </p>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <Link href="/aviso-legal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Aviso Legal</Link>
            <span className="text-border">·</span>
            <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidad</Link>
            <span className="text-border">·</span>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
          </nav>
        </div>
      </footer>

      {/* --- INYECCIÓN DEL MODAL --- */}
      {/* Usamos Suspense porque AuthModal lee los QueryParams, 
          así no perjudicamos el SEO de la Landing Page */}
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>

    </div>
  );
}
