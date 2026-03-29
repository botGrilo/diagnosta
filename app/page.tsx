import Link from "next/link";
import { Suspense } from "react"; 
import { Shield, Brain, Globe, Bell, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AuthModal } from "@/components/layout/auth-modal";
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";

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

import { GlobalStatusWidget } from "@/components/layout/global-status-widget";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

     



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
     

      {/* ── LIVE STATUS WIDGET ──────────────────────── */}
      <section className="px-6 py-12">
        <GlobalStatusWidget />
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



      {/* --- INYECCIÓN DEL MODAL --- */}
      {/* Usamos Suspense porque AuthModal lee los QueryParams, 
          así no perjudicamos el SEO de la Landing Page */}
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>

    </div>
  );
}
