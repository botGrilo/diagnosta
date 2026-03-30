"use client"

import { StatusGrid } from "@/components/dashboard/status-grid"
import { NeuralConsole } from "@/components/dashboard/neural-console"
import { ForenseTooltip } from "@/components/ui/forense-tooltip"
import { Activity, Shield, Terminal } from "lucide-react"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"

/**
 * Dashboard Maestro de Diagnosta
 * Versión Modular v2.0 - Optimizado para el Hackathon
 */
export default function DashboardPage() {
  const panicMode = useDiagnostaStore(s => s.panicMode) || false

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* ── ELEMENTOS DE FONDO (Cyber Skin) ─────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-8 w-full px-6 py-10 relative z-10">
        
        {/* ── HEADER DEL DASHBOARD: ESCALA SRE ────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-3 border-b-2 border-border/20">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-atleta/90 font-black uppercase tracking-[0.3em] text-[11px]">
              <Shield className="h-6 w-6" />
              <span>Infraestructura Crítica</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground flex items-center gap-4">
              Panel de <span className="text-atleta italic underline decoration-atleta/20 underline-offset-8">Control</span>
            </h1>
            <p className="text-base text-muted-foreground font-bold tracking-tight">
              Telemetría extremo a extremo (Capa 7) — incluyendo ciclo completo de seguridad SSL y latencia de procesamiento.
            </p>
          </div>
        </header>

        {/* CONTEXT BOX XL: LA DEFENSA TÉCNICA */}
        <div className="bg-atleta/5 border-l-[6px] border-atleta p-6 rounded-r-3xl backdrop-blur-md animate-in fade-in slide-in-from-left duration-1000 shadow-[20px_0_40px_-20px_rgba(0,242,255,0.1)]">
           <p className="text-[14px] font-black text-atleta uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
             <Activity className="h-4 w-4" />
             ¿Qué mide cada número?
           </p>
           <p className="text-[13px] md:text-sm text-foreground/90 leading-relaxed font-bold max-w-4xl">
             Captura del ciclo <span className="text-atleta underline decoration-atleta/30 underline-offset-2">TCP + Negociación TLS/SSL + respuesta del servidor + transferencia</span>. <br className="hidden md:block"/>
             El mínimo físico de HTTPS es ~300 ms. Un resultado de <span className="text-atleta font-black text-lg">340 ms</span> es <span className="bg-atleta/20 px-2 py-0.5 rounded text-atleta">CONEXIÓN ÓPTIMA</span> — no es lag, es seguridad.
           </p>
        </div>

        {/* ── GRID DE MONITOREO (EL MOTOR SWR) ────────────────── */}
        <StatusGrid />

        {/* ── CONSOLA NEURONAL (INTELIGENCIA ARTIFICIAL) ───────── */}
        <section className="space-y-4 pt-10">
        {/* CAPÍTULO III — Análisis del Sistema (Neural Console) */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] tabular-nums">III</span>
              <span className="text-atleta font-mono text-sm">&gt;_</span>
              <ForenseTooltip
                title="Cortex Digital — Electrocardiograma"
                description="Flujo en tiempo real de cada pulso registrado. RED mide la velocidad de conexión. PROTOCOLO verifica que el servidor respondió correctamente."
                insight="Si el flujo se detiene, la Ronda Médica está en pausa."
              >
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-2 cursor-help">
                  Análisis del <span className="text-white/60 italic">Sistema</span>
                </h2>
              </ForenseTooltip>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <NeuralConsole panicMode={panicMode} />
        </section>

      </div>
    </div>
  )
}
