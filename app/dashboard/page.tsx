"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Activity, Shield, Brain, Terminal, Zap, Sun, Moon, Settings } from "lucide-react";

const LOG_ENTRIES = [
  { time: "11:20 AM", speaker: "Diagnosta", speakerType: "diagnosta" as const, icon: "🛡️", message: "Detectada latencia inusual en el nodo Barcelona." },
  { time: "11:21 AM", speaker: "IA",        speakerType: "ia"        as const, icon: "🧠", message: "Analizando trazas... El retraso se debe a una consulta SQL sin índice en la tabla 'orders'." },
  { time: "11:22 AM", speaker: "Consejo",   speakerType: "consejo"   as const, icon: "💡", message: "Ejecute 'CREATE INDEX idx_orders_date ON orders(created_at)' para reducir la carga un 40%." },
];

const MONITORS = [
  { name: "API Pagos",      latency: "120ms", status: "ok"       as const, statusLabel: "Nominal",   deltaMs: -8  },
  { name: "API Usuarios",   latency: "450ms", status: "degraded" as const, statusLabel: "Degradado", deltaMs: +12 },
  { name: "API Inventario", latency: "85ms",  status: "ok"       as const, statusLabel: "Nominal",   deltaMs: -3  },
];

const STATUS_STYLES = {
  ok:       { dot: "status-dot-ok",       text: "text-primary",     value: "text-foreground"  },
  degraded: { dot: "status-dot-degraded", text: "text-amber-700",   value: "text-amber-700"   },
  down:     { dot: "status-dot-down",     text: "text-destructive",  value: "text-destructive" },
};

const SPEAKER_COLORS = {
  diagnosta: "text-emerald-400",
  ia:        "text-sky-400",
  consejo:   "text-amber-400",
};

function UptimeChart() {
  const points = "0,60 40,55 80,58 120,50 160,52 200,48 240,53 280,49 320,51 360,47 400,50";
  return (
    <svg viewBox="0 0 400 80" className="w-full h-16 mt-3" preserveAspectRatio="none">
      <defs>
        <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="oklch(0.75 0.18 155)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.75 0.18 155)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,60 ${points} 400,60 400,80 0,80`} fill="url(#uptimeGradient)" />
      <polyline points={points} fill="none" stroke="oklch(0.75 0.18 155)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MonitorCard({ name, latency, status, statusLabel, deltaMs }: typeof MONITORS[0]) {
  const styles = STATUS_STYLES[status];
  const improving = deltaMs < 0;
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-mono uppercase tracking-widest">{name}</span>
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
      </div>
      <div className="flex items-baseline gap-2">
        <p className={`text-2xl font-bold tabular-nums tracking-tight ${styles.value}`}>{latency}</p>
        <span className={`text-xs font-mono tabular-nums ${improving ? "text-primary" : "text-amber-600 dark:text-amber-400"}`}>
          {improving ? "↓" : "↑"}{Math.abs(deltaMs)}ms vs 1h
        </span>
      </div>
      <p className={`text-xs font-mono ${styles.text}`}>● {statusLabel}</p>
    </div>
  );
}

function ConsoleLine({ time, speaker, speakerType, icon, message }: typeof LOG_ENTRIES[0]) {
  return (
    <div className="flex items-baseline gap-2 leading-relaxed">
      <span className="inline-block shrink-0 text-[10px] font-mono font-medium bg-emerald-400/10 text-emerald-300/70 border border-emerald-400/20 px-1.5 py-0.5 rounded">
        {time}
      </span>
      <span className={`font-semibold font-mono shrink-0 ${SPEAKER_COLORS[speakerType]}`}>{icon} {speaker}:</span>
      <span className="text-slate-400 font-mono text-sm">{message}</span>
    </div>
  );
}

function NeuralConsole() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= LOG_ENTRIES.length) return;
    const timer = setTimeout(
      () => setVisibleCount((c) => c + 1),
      visibleCount === 0 ? 800 : 1500
    );
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <Brain className="text-cyan-500 h-5 w-5 shrink-0" />
        <h2 className="text-foreground font-semibold text-sm uppercase tracking-widest">
          Consola Neuronal de Diagnóstico
        </h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          LIVE
        </span>
      </div>
      <div className="bg-slate-950 rounded-lg p-4 overflow-hidden flex flex-col gap-3 min-h-[160px]">
        {LOG_ENTRIES.slice(0, visibleCount).map((entry, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ConsoleLine {...entry} />
          </div>
        ))}
        {visibleCount < LOG_ENTRIES.length && (
          <span className="animate-pulse text-cyan-400">▋</span>
        )}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center h-8 w-8 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-300"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full px-6 py-8">

        {/* ── HEADER ─────────────────────────────────────── */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Shield className="text-primary h-7 w-7" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Diagnosta</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Enlace directo a gestión de endpoints */}
            <Link
              href="/dashboard/endpoints"
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 hover:border-primary/40 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Endpoints
            </Link>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary tracking-wide">Guardián Activo</span>
            </div>
          </div>
        </header>

        {/* ── HERO CARD: Uptime Global ─────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-7 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-foreground/60 mb-1">Estado Global del Sistema</p>
              <p className="text-6xl font-bold tracking-tight leading-none tabular-nums text-foreground">99.98%</p>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-1">↑ Uptime Global — últimas 30 días</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-xs font-mono">Tiempo Real</span>
            </div>
          </div>
          <UptimeChart />
        </div>

        {/* ── GRID DE MONITORES ───────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Monitores de Servicio</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {MONITORS.map((m) => <MonitorCard key={m.name} {...m} />)}
          </div>
        </section>

        {/* ── CONSOLA NEURONAL ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Análisis en Progreso</h2>
          </div>
          <NeuralConsole />
        </section>

      </div>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="mt-auto border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 Diagnosta — El Guardián de APIs. Hackatón CubePath.</p>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <Link href="/aviso-legal" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Aviso Legal</Link>
            <span className="text-border">·</span>
            <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidad</Link>
            <span className="text-border">·</span>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
