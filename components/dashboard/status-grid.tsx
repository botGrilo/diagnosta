"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { StatusCard, SkeletonCard } from "./status-card"
import { StatusModal } from "./status-modal"
import { RegistrationSheet } from "./registration-sheet"
import { Activity, AlertTriangle, Globe, Brain, Sparkles, Wand2, Plus, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiagnosta } from "@/hooks/use-diagnosta"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"
import { RedGlobal } from "./red-global"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StatusGrid() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<any | null>(null)
  const [editingEndpoint, setEditingEndpoint] = useState<any | null>(null)
  const [deletingEndpoint, setDeletingEndpoint] = useState<any | null>(null)
  
  const [showGlobal, setShowGlobal] = useState<boolean>(true)
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  
  useEffect(() => {
    const saved = localStorage.getItem("diagnosta_show_global")
    if (saved !== null) setShowGlobal(saved === "true")
  }, [])

  const handleToggleGlobal = (val: boolean) => {
    setShowGlobal(val)
    localStorage.setItem("diagnosta_show_global", String(val))
  }

  // REGLA SRE: RONDA MÉDICA CADA 5 MINUTOS (300000ms)
  const { data: globalData, error: globalError, isLoading: globalLoading } = useSWR("/api/endpoints/global", fetcher, {
    refreshInterval: 300000, 
  })

  // REGLA SRE: LOS NODOS DEL USUARIO TAMBIÉN SIGUEN LA RONDA MÉDICA
  const { data: mineData, error: mineError, isLoading: mineLoading, mutate: mutateMine } = useSWR("/api/endpoints/mine", fetcher, {
    refreshInterval: 300000,
  })

  // LÓGICA DE TIEMPO FORENSE (Vía Socio Goyo)
  // Hallamos el MAX(checked_at) de los pilares globales para la 'Identidad de la Radiografía'
  useEffect(() => {
    if (globalData && globalData.length > 0) {
      // Encontramos el check más reciente entre todos los pilares
      let latest: Date | null = null;
      
      globalData.forEach((ep: any) => {
        const checkAt = ep.lastCheckedAt || ep.checkedAt || ep.checked_at;
        if (checkAt) {
          const d = new Date(checkAt);
          if (!latest || d > latest) latest = d;
        }
      });

      if (latest) {
        setLastUpdated((latest as Date).toLocaleTimeString('es-ES'));
      }
    }
  }, [globalData])

  // Solo pasar mineData al hook — pilares se analizan en Red Global
  const { diagnosticos, triggerAnalysis } = useDiagnosta(mineData || [])

  const triggerRequested = useDiagnostaStore(s => s.triggerRequested)
  const setTriggerRequested = useDiagnostaStore(s => s.setTriggerRequested)

  // DISPARO BAJO DEMANDA (Manual o desde Store)
  useEffect(() => {
    if (triggerRequested && mineData && mineData.length > 0) {
      triggerAnalysis(mineData)
      setTriggerRequested(false)
    }
  }, [triggerRequested, mineData, triggerAnalysis, setTriggerRequested])

  const handleDelete = async () => {
    if (!deletingEndpoint) return
    try {
      const res = await fetch(`/api/endpoints/${deletingEndpoint.id}`, { method: 'DELETE' })
      if (res.ok) {
        mutateMine()
        setDeletingEndpoint(null)
      }
    } catch (err) {
      console.error("Error al eliminar:", err)
    }
  }

  if (globalError || mineError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h2 className="text-lg font-black text-red-500 tracking-tight">Error de Sincronización</h2>
      </div>
    )
  }

  if (globalLoading || mineLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const hasNodes = mineData && mineData.length > 0
  const isLimitReached = mineData && mineData.length >= 6

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* ── TOGGLE BAR (SALA DE MONITOREO / RONDA MÉDICA) ────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 rounded-[2.2rem] p-5 px-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* IZQUIERDA: CONTEXTO */}
        <div className="flex items-center gap-4 relative">
           <Brain className="h-5 w-5 text-primary/60 shrink-0" />
           <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic">
             Vigilancia de Referencia Global
           </p>
        </div>

        {/* DERECHA: CONTROLES */}
        <div className="flex items-center gap-6 relative">
           <span className="text-[10px] font-mono text-atleta/40 uppercase tracking-widest hidden sm:block">
             RONDA MÉDICA: {lastUpdated || "En línea"}
           </span>
           <button 
             onClick={() => handleToggleGlobal(!showGlobal)}
             className={cn(
               "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-white/10",
               showGlobal && "bg-primary"
             )}
           >
             <span className={cn(
               "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
               showGlobal ? "translate-x-5" : "translate-x-0"
             )} />
           </button>
        </div>
      </div>

      {/* ── SECCIÓN 1: PILARES GLOBALES (SOLO SENSOR) ───────────── */}
      {showGlobal && (
        <section className="space-y-10">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-primary flex items-center gap-4 italic shrink-0">
              <Globe className="h-6 w-6" /> Pilares Globales
            </h3>
            <div className="flex items-center gap-8">
                {/* BOTÓN SOLO NAVEGACIÓN (CONSTANTES VITALES) */}
                <RedGlobal />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hidden xs:block">6 nodos de infraestructura crítica</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {globalData?.map((endpoint: any) => (
              <StatusCard
                key={endpoint.id}
                name={endpoint.name}
                url={endpoint.url}
                isHealthy={endpoint.isSuccess}
                ms={endpoint.latencyMs}
                response_preview={endpoint.response_preview}
                isReference={true} // DECISIÓN 4: Dashboard de Pilares es SOLO SENSOR (Sin IA)
                onClick={() => setSelectedEndpoint(endpoint)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── SECCIÓN 2: TUS NODOS VIGILADOS (SENSOR + DIAGNÓSTICO) ────────────────────────── */}
      <section className="space-y-10">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black uppercase tracking-[0.1em] md:tracking-[0.3em] text-atleta flex items-center gap-4 italic">
            <Activity className="h-6 w-6" /> Tus Nodos Vigilados
          </h3>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
              {mineData?.length || 0} / 6 registrados
            </span>
          </div>
        </div>

        {!hasNodes ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center p-20 rounded-[3.5rem] bg-white/[0.01] border border-dashed border-white/5 space-y-8 text-center animate-in zoom-in-95 duration-700">
             <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl relative">
                <Plus className="h-10 w-10 text-primary/30" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
             </div>
             <div className="space-y-3">
                <h4 className="text-xl font-black text-foreground tracking-tight italic">Dr. Grilo aún no vigila ninguno de tus servicios</h4>
                <p className="text-sm text-muted-foreground/60 max-w-sm font-medium">Registra tu primera API y empieza a recibir diagnósticos clínicos automáticos sobre la salud de tu infra.</p>
             </div>
             <button 
               onClick={() => setSheetOpen(true)}
               className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-xs hover:bg-atleta transition-all shadow-xl shadow-primary/20 active:scale-95"
             >
                Registrar primer nodo
             </button>
          </div>
        ) : (
          /* GRID DE CARDS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {mineData?.map((endpoint: any) => (
              <StatusCard
                key={endpoint.id}
                name={endpoint.name}
                url={endpoint.url}
                isHealthy={endpoint.isSuccess}
                ms={endpoint.latencyMs}
                response_preview={endpoint.response_preview}
                iaReport={diagnosticos[endpoint.id]}
                onDiagnose={() => triggerAnalysis([endpoint])} // DIAGNÓSTICO BAJO DEMANDA (Activo)
                onEdit={() => {
                  setEditingEndpoint(endpoint)
                  setSheetOpen(true)
                }}
                onDelete={() => setDeletingEndpoint(endpoint)}
                onClick={() => {
                   const ia = diagnosticos[endpoint.id];
                   if (ia) setSelectedEndpoint({...endpoint, ia_recipe: ia.ai_recipe, epidemiology: ia.epidemiology_report});
                   else setSelectedEndpoint(endpoint);
                }}
              />
            ))}
            
            {/* SLOT PARA NUEVO (Solo si < 6) */}
            {!isLimitReached && (
              <button 
                onClick={() => {
                  setEditingEndpoint(null)
                  setSheetOpen(true)
                }}
                className="group relative overflow-hidden rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 p-8 flex flex-col items-center justify-center gap-6 transition-all duration-700 min-h-[380px]"
              >
                 <div className="h-16 w-16 rounded-[1.8rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-700">
                    <Sparkles className="h-8 w-8 text-primary/40 group-hover:text-primary animate-pulse" />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-sm font-black text-foreground/40 group-hover:text-foreground transition-colors uppercase tracking-[0.2em]">Registrar nuevo nodo</p>
                    <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em] italic">{6 - mineData.length} slots disponibles</p>
                 </div>
              </button>
            )}
          </div>
        )}
      </section>

      {/* MODAL CONFIRMACIÓN ELIMINAR */}
      {deletingEndpoint && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setDeletingEndpoint(null)} />
           <div className="relative w-full max-w-sm bg-card border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
              <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
                 <Terminal className="h-8 w-8" />
              </div>
              <div className="text-center space-y-3">
                 <h3 className="text-xl font-black text-foreground tracking-tighter">¿Eliminar vigilancia?</h3>
                 <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest px-4">
                   Deseas retirar la vigilancia sobre <span className="text-foreground">{deletingEndpoint.name}</span>.<br />El historial se conservará.
                 </p>
              </div>
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={handleDelete}
                   className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                 >
                   Sí, eliminar vigilancia
                 </button>
                 <button 
                   onClick={() => setDeletingEndpoint(null)}
                   className="w-full py-4 rounded-2xl bg-white/5 text-muted-foreground font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all"
                 >
                   Cancelar
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* COMPONENTES DE CAPA SUPERIOR */}
      <StatusModal 
        isOpen={!!selectedEndpoint} 
        onClose={() => setSelectedEndpoint(null)}
        endpoint={selectedEndpoint}
      />

      <RegistrationSheet 
        isOpen={isSheetOpen}
        onClose={() => {
          setSheetOpen(false)
          setEditingEndpoint(null)
        }}
        endpoint={editingEndpoint}
        onSuccess={() => mutateMine()}
      />
    </div>
  )
}
