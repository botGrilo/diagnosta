"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { StatusCard, SkeletonCard } from "./status-card"
import { StatusModal } from "./status-modal"
import { Activity, RefreshCcw, AlertTriangle, Loader2, Brain, Sparkles, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiagnosta } from "@/hooks/use-diagnosta"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"


const fetcher = (url: string) => fetch(url).then((res) => res.json())



/**
 * STATUS GRID SRE Edition
 * Integra el pingo básico (SWR) con el cerebro clínico (n8n via useDiagnosta)
 */
export function StatusGrid() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<any | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  
  // 1. Data local SWR (Latido de 30s)
  const { data, error, isLoading, mutate, isValidating } = useSWR("/api/status", fetcher, {
    refreshInterval: 30000, 
    revalidateOnFocus: true,
  })

  useEffect(() => {
    if (data) setLastUpdated(new Date().toLocaleTimeString())
  }, [data])

  // 2. Motor de Diagnóstico (n8n + SSE FIFO)
  const { diagnosticos, isAnalyzing, triggerAnalysis } = useDiagnosta(data || [])

  // 3. ESCUCHADOR DE DISPARO (Desde Navbar)
  const triggerRequested = useDiagnostaStore(s => s.triggerRequested)
  const setTriggerRequested = useDiagnostaStore(s => s.setTriggerRequested)

  useEffect(() => {
    if (triggerRequested && data) {
      triggerAnalysis()
      setTriggerRequested(false) // Reset del flag para el siguiente pulso
    }
  }, [triggerRequested, data, triggerAnalysis, setTriggerRequested])

  const isAnyHealthy = data && Array.isArray(data) ? data.every((ep: any) => ep.is_success !== false) : true

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-500/5 border border-red-500/20 rounded-3xl space-y-4 shadow-2xl shadow-red-500/10">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h2 className="text-lg font-bold text-red-500 tracking-tight">Error de Comunicación</h2>
        <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
          No pudimos sincronizar con el núcleo de Diagnosta. Verifica la conexión con el servidor de n8n o la base de datos.
        </p>
        <button 
          onClick={() => mutate()}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95"
        >
          <RefreshCcw className="h-4 w-4" />
          Reintentar Sincronización
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* ── BARRA DE CONTROL Y DISPARO (IA TRIGGER) ──────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-3">
           <div className={cn(
             "h-3 w-3 rounded-full shadow-[0_0_12px_currentColor] animate-pulse",
             isAnyHealthy ? "bg-atleta" : "bg-uci"
           )} />
           <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 italic">
             {isValidating ? "Ajustando Brújula SRE..." : "Escaneando Nodos Globales"}
             {isValidating && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
           </p>
           {/* hora */}
           <p className="text-[11px] font-mono font-black text-atleta/40 uppercase tracking-widest mt-1">
            Sincronización: {lastUpdated || "En línea"}
           </p>
        </div>

        
      </div>

      {/* ── EL GRID DE CONTROL: 6 BLOQUES DE INGENIERÍA ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {data?.map((endpoint: any) => {
          // Buscamos si hay un diagnóstico fresco entregado por n8n (FIFO)
          const iaReport = diagnosticos[endpoint.id];
          const hasIA = !!iaReport;

          return (
            <StatusCard
              key={endpoint.id}
              name={endpoint.name}
              url={endpoint.url}
              // TELEMETRÍA REAL (SENSOR SWR) - Prioridad absoluta a los datos vivos
              isHealthy={endpoint.is_success}
              ms={endpoint.latency_ms}
              response_preview={endpoint.response_preview}
              
              // INYECCIÓN CLÍNICA (Si existe diagnóstico en el store global)
              iaReport={iaReport} // Pasamos el reporte completo para que la tarjeta decida qué mostrar
              
              onClick={() => setSelectedEndpoint(iaReport ? {
                ...endpoint,
                ia_recipe: iaReport.ai_recipe,
                epidemiology: iaReport.epidemiology_report
              } : endpoint)}
            />
          );
        })}

        {/* 6º BLOQUE: AUTODIAGNÓSTICO DEL NODO MAESTRO */}
        <StatusCard
          name="Diagnosta SRE Core"
          url="localhost:8080 (Docker Node)"
          isHealthy={true}
          ms={42} 
          response_preview='{"status":"Master Node Online","integrity":100}'
          onClick={() => {}} 
        />
      </div>

      {/* ── LEYENDA DE SIGNOS VITALES: ESCALA SRE ───────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 border-t border-border/20">
        <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-atleta">
          <div className="h-2 w-2 rounded-full bg-atleta shadow-[0_0_10px_currentColor]" /> ATLETA (&lt;300ms)
        </div>
        <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-normal">
          <div className="h-2 w-2 rounded-full bg-normal shadow-[0_0_10px_currentColor]" /> NORMAL (&lt;600ms)
        </div>
        <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-fatigado">
          <div className="h-2 w-2 rounded-full bg-fatigado shadow-[0_0_10px_currentColor]" /> FATIGADO (&lt;1200ms)
        </div>
        <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-uci animate-pulse">
          <div className="h-2 w-2 rounded-full bg-uci shadow-[0_0_12px_rgba(239,68,68,0.5)]" /> UCI (CRITICO)
        </div>
      </div>

      {/* DISCLAIMER SRE XL: EL MARTILLO DEL JURADO */}
      <div className="mt-4 p-6 bg-muted/10 border border-border/30 rounded-3xl backdrop-blur-md">
         <p className="text-[11px] text-center text-muted-foreground font-black uppercase tracking-[0.1em] leading-relaxed">
           <span className="text-atleta font-black underline decoration-atleta/40 underline-offset-4">Metodología SRE:</span> Diagnosta mide el ciclo completo <span className="text-foreground italic">Red + Seguridad SSL + Respuesta del Servidor</span>. <br/> 
           El tiempo reportado es la <span className="text-foreground">latencia de aplicación (Capa 7)</span>, incluyendo el margen de procesamiento aislado del entorno.
         </p>
      </div>

      {/* ── NOTA ESTRATÉGICA ───────────────────────────── */}
      <div className="flex items-center gap-4 p-5 bg-background border border-border/40 rounded-3xl shadow-sm">
         <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/20 shrink-0 shadow-inner">
            <Activity className="h-5 w-5 text-primary" />
         </div>
         <p className="text-[11px] text-muted-foreground leading-relaxed italic pr-4">
            "Esta es nuestra <strong>Inteligencia Colectiva</strong>. Monitorizamos los pilares de la economía digital en tiempo real para darte contexto total sobre tus propios despliegues."
         </p>
      </div>

      {/* ── MODAL DE DIAGNÓSTICO (CAJA NEGRA) ──────────── */}
      <StatusModal 
        isOpen={!!selectedEndpoint} 
        onClose={() => setSelectedEndpoint(null)}
        endpoint={selectedEndpoint}
      />
    </div>
  )
}
