"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { StatusCard, SkeletonCard } from "./status-card"
import { StatusModal } from "./status-modal"
import { RegistrationSheet } from "./registration-sheet"
import { useHelpEnabled, toggleHelp } from "@/lib/hooks/use-help-enabled"
import { ForenseTooltip } from "@/components/ui/forense-tooltip"
import { Activity, AlertTriangle, Globe, Brain, Sparkles, Plus, Terminal, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiagnosta } from "@/hooks/use-diagnosta"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"
import { RedGlobal } from "./red-global"

// Cache: no-store para que mutateMine() siempre traiga datos frescos (fix Next.js caching)
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then((res) => res.json())

export function StatusGrid() {
  const helpEnabled = useHelpEnabled()
  const [selectedEndpoint, setSelectedEndpoint] = useState<any | null>(null)
  const [editingEndpoint, setEditingEndpoint] = useState<any | null>(null)
  const [deletingEndpoint, setDeletingEndpoint] = useState<any | null>(null)

  // ESTADO GLOBAL (Socio Goyo: Se desactiva la persistencia local para forzar siempre ON al cargar)
  const showGlobal = useDiagnostaStore(s => s.showGlobal)
  const setShowGlobal = useDiagnostaStore(s => s.setShowGlobal)
  const setUserNames = useDiagnostaStore(s => s.setUserEndpointNames)

  const [isSheetOpen, setSheetOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const handleToggleGlobal = (val: boolean) => {
    setShowGlobal(val)
  }

  // REGLA SRE: RONDA MÉDICA CADA 5 MINUTOS (300000ms)
  const { data: globalData, error: globalError, isLoading: globalLoading } = useSWR("/api/endpoints/global", fetcher, {
    refreshInterval: 300000,
  })

  // REGLA SRE: LOS NODOS DEL USUARIO TAMBIÉN SIGUEN LA RONDA MÉDICA
  const { data: mineData, error: mineError, isLoading: mineLoading, mutate: mutateMine } = useSWR("/api/endpoints", fetcher, {
    refreshInterval: 300000,
  })

  // Sincronización de nombres para filtrado de consola (Fix: Movido después de mineData)
  useEffect(() => {
    if (mineData) {
      setUserNames(mineData.map((ep: any) => ep.name))
    }
  }, [mineData, setUserNames])

  // INYECCIÓN DE TELEMETRÍA: Cuando llegan datos de la Ronda Médica, los enviamos a la Consola Neuronal
  useEffect(() => {
    // Inyectamos solo nodos del usuario o sumamos pilares si el toggle está ON (vía Socio Goyo)
    const userSources = (mineData || [])
    const globalSources = showGlobal ? (globalData || []) : []
    const sources = [...globalSources, ...userSources]

    if (sources.length > 0) {
      console.log('🔌 NEURAL_INJECT — sources:', sources.length)
      console.log('🔍 CAMPOS_REALES:', Object.keys(sources[0] || {}))
      console.log('🔌 PRIMER_ENDPOINT:', sources[0]?.name, sources[0]?.url)
      console.log('🔌 TIENE_INSIGHTS:', !!sources[0]?.quick_insights)
    }

    sources.forEach((endpoint: any) => {
      if (endpoint.quick_insights) {
        try {
          const insights = typeof endpoint.quick_insights === 'string'
            ? JSON.parse(endpoint.quick_insights)
            : endpoint.quick_insights

          if (Array.isArray(insights) && insights.length > 0) {
            console.log('✅ INYECTANDO:', endpoint.name, insights.length, 'insights')
            useDiagnostaStore.getState().addConsoleLines({
              name: endpoint.name,
              timestamp: endpoint.lastCheckedAt || endpoint.checkedAt || endpoint.checked_at || new Date().toISOString(),
              quick_insights: insights
            })
          }
        } catch (e) {
          console.error(`[Forense] Error parseando insights para ${endpoint.name}:`, e)
        }
      } else {
        // Log de diagnóstico si no hay insights (vía Socio Goyo)
        if (sources.length > 0) {
          console.log('❌ SIN_INSIGHTS:', endpoint.name, 'Campos:', Object.keys(endpoint))
        }
      }
    })
  }, [globalData, mineData, showGlobal])

  // LÓGICA DE TIEMPO FORENSE (Vía Socio Goyo)
  useEffect(() => {
    if (globalData && globalData.length > 0) {
      let latest: Date | null = null;
      globalData.forEach((ep: any) => {
        const checkAt = ep.lastCheckedAt || ep.checkedAt || ep.checked_at;
        if (checkAt) {
          const d = new Date(checkAt);
          if (!latest || d > latest) latest = d;
        }
      });
      if (latest) setLastUpdated((latest as Date).toLocaleTimeString('es-ES'));
    }
  }, [globalData])

  const { diagnosticos, triggerAnalysis } = useDiagnosta(mineData || [])
  const triggerRequested = useDiagnostaStore(s => s.triggerRequested)
  const setTriggerRequested = useDiagnostaStore(s => s.setTriggerRequested)

  useEffect(() => {
    if (triggerRequested && mineData && mineData.length > 0) {
      triggerAnalysis(mineData)
      setTriggerRequested(false)
    }
  }, [triggerRequested, mineData, triggerAnalysis, setTriggerRequested])

  const handleDelete = async () => {
    if (!deletingEndpoint) return

    const endpointId = deletingEndpoint.id || deletingEndpoint.endpoint_id
    console.log('🗑️ DELETE_INTENT:', endpointId, deletingEndpoint)

    if (!endpointId) {
      console.error('❌ ID undefined — no se puede eliminar')
      setDeletingEndpoint(null)
      return
    }

    try {
      const res = await fetch(`/api/endpoints/${endpointId}`, {
        method: 'DELETE',
      })

      console.log('🗑️ DELETE_STATUS:', res.status)

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        console.log('✅ DELETE_SUCCESS — Filas afectadas:', data.affected);
        // Si no afectó a ninguna fila, avisar por consola
        if (data.affected === 0) {
          console.error('⚠️ ALERTA: El nodo existe pero el usuario no es el dueño (o ya estaba borrado).');
        }
        // Filtrado optimista inmediato — la tarjeta desaparece sin esperar refetch
        mutateMine(
          (current: any[] | undefined) =>
            (current ?? []).filter((e: any) => e.id !== endpointId),
          { revalidate: true } // confirma con el servidor en background
        )
      }
    } catch (err) {
      console.error('❌ Error de red:', err)
    } finally {
      setDeletingEndpoint(null)
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

  // Filtramos nodos del sistema para que Área de Operaciones solo muestre los del usuario
  const userNodes = mineData?.filter((ep: any) => !ep.isSystem) || []
  const hasNodes = userNodes.length > 0
  const isLimitReached = userNodes.length >= 6

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
          {/* BOTÓN TOGGLE AYUDA (Dr. Grilo Intelligence) */}
          <ForenseTooltip
            alwaysShow
            title={helpEnabled ? "Enciclopedia Forense" : "Modo Experto Activo"}
            description={helpEnabled ? "Ayudas visuales activas. Pulsa para ocultar y ver la interfaz en modo experto." : "Ayudas ocultas. Pulsa para activar la Enciclopedia Forense."}
            side="bottom"
          >
            <button
              onClick={() => toggleHelp(!helpEnabled)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                helpEnabled
                  ? "border-atleta/30 bg-atleta/5 text-atleta"
                  : "border-white/10 bg-white/5 text-muted-foreground/40"
              )}
            >
              <HelpCircle className={cn("h-3 w-3", helpEnabled && "animate-pulse")} />
              {helpEnabled ? "Ayuda ON" : "Ayuda OFF"}
            </button>
          </ForenseTooltip>

          <ForenseTooltip
            title="Última Radiografía"
            description="Hora del último chequeo automático. Diagnosta realiza una ronda cada 5 minutos."
            insight="Cada Ronda genera dos lecturas por nodo: RED (velocidad del pulso) y PROTOCOLO (calidad de la respuesta)."
            side="bottom"
          >
            <span className="text-[10px] font-mono text-atleta/40 uppercase tracking-widest hidden sm:block cursor-help">
              RONDA MÉDICA: {lastUpdated || "En línea"}
            </span>
          </ForenseTooltip>

          <ForenseTooltip
            title="Filtro de Infraestructura"
            description="Oculta o muestra los 6 cimientos globales (GitHub, etc.). Mantén solo lo tuyo para un monitoreo enfocado."
            side="left"
          >
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
          </ForenseTooltip>
        </div>
      </div>

      {/* ── SECCIÓN 1: VIGILANCIA DE REFERENCIA GLOBAL (SALA DE CONSTANTES VITALES) ───────────── */}
      {showGlobal && (
        <section className="space-y-10">
          {/* CAPÍTULO I — Sala de Constantes Vitales */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.4em] tabular-nums">I</span>
              <ForenseTooltip
                title="Sala de Constantes Vitales"
                description="Los 6 pilares globales de Internet monitoreados en tiempo real. Siempre encendidos, siempre en verde."
                insight="Si estos caen y tu API también, el fallo es global. Si solo cae tu API, el problema es tuyo."
              >
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-3 cursor-help">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Sala de <span className="text-primary italic">Constantes Vitales</span></span>
                </h3>
              </ForenseTooltip>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
            <div className="flex items-center gap-6 shrink-0">
              <RedGlobal />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hidden xs:block">6 nodos de infraestructura crítica</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 auto-rows-fr">
            {globalData?.map((endpoint: any) => (
              <StatusCard
                key={endpoint.id}
                name={endpoint.name}
                url={endpoint.url}
                isHealthy={endpoint.isSuccess}
                ms={endpoint.latencyMs}
                response_preview={endpoint.response_preview}
                isReference={true}
                onClick={() => setSelectedEndpoint(endpoint)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── SECCIÓN 2: TUS NODOS VIGILADOS (ÁREA DE OPERACIONES) ────────────────────────── */}
      <section className="space-y-10">
        {/* CAPÍTULO II — Área de Operaciones */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[9px] font-black text-atleta/40 uppercase tracking-[0.4em] tabular-nums">II</span>
            <ForenseTooltip
              title="Área de Operaciones"
              description="Tus endpoints bajo vigilancia de Diagnosta. Cada nodo recibe una Ronda Médica cada 5 minutos."
              insight="Un nodo caído es un paciente en UCI — intervención inmediata."
            >
              <h3 className="text-lg md:text-2xl font-black uppercase tracking-[0.15em] text-foreground flex items-center gap-3 cursor-help">
                <Activity className="h-5 w-5 text-atleta" />
                <span>Área de <span className="text-atleta italic">Operaciones</span></span>
              </h3>
            </ForenseTooltip>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-atleta/30 to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 shrink-0">
            {userNodes.length} / 6 registrados
          </span>
        </div>

        {!hasNodes ? (
          <div className="flex flex-col items-center justify-center p-20 rounded-[3.5rem] bg-white/[0.01] border border-dashed border-white/5 space-y-8 text-center animate-in zoom-in-95 duration-700">
            <div className="h-20 w-20 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl relative">
              <Plus className="h-10 w-10 text-primary/30" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <div className="space-y-3">
              <h4 className="text-xl font-black text-foreground tracking-tight italic">Dr. Grilo aún no vigila ninguno de tus servicios</h4>
              <p className="text-sm text-muted-foreground/60 max-w-sm font-medium">Registra tu primera API y empieza a recibir diagnósticos clínicos automáticos.</p>
            </div>
            <ForenseTooltip
              title="Nuevo Paciente"
              description="Añade una API bajo vigilancia de Diagnosta. Máximo 6 nodos."
              insight="Diagnosta construye el historial clínico desde la primera Ronda Médica."
            >
              <button
                onClick={() => setSheetOpen(true)}
                className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-xs hover:bg-atleta transition-all shadow-xl shadow-primary/20"
              >
                Registrar primer paciente
              </button>
            </ForenseTooltip>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 auto-rows-fr">
            {userNodes?.map((endpoint: any) => (
              <StatusCard
                key={endpoint.id}
                name={endpoint.name}
                url={endpoint.url}
                isHealthy={endpoint.isSuccess}
                ms={endpoint.latencyMs}
                response_preview={endpoint.response_preview}
                iaReport={diagnosticos[endpoint.id]}
                onDiagnose={() => triggerAnalysis([endpoint])}
                onEdit={() => {
                  setEditingEndpoint(endpoint)
                  setSheetOpen(true)
                }}
                onDelete={() => setDeletingEndpoint(endpoint)}
                onClick={() => {
                  const ia = diagnosticos[endpoint.id];
                  if (ia) setSelectedEndpoint({ ...endpoint, ia_recipe: ia.ai_recipe, epidemiology: ia.epidemiology_report });
                  else setSelectedEndpoint(endpoint);
                }}
              />
            ))}

            {!isLimitReached && (
              <ForenseTooltip
                title="Nuevo Paciente"
                description="Añade una API bajo vigilancia de Diagnosta. Máximo 6 nodos."
                insight="Diagnosta construye el historial clínico desde la primera Ronda Médica."
                side="top"
              >
                <button
                  onClick={() => {
                    setEditingEndpoint(null)
                    setSheetOpen(true)
                  }}
                  className="group relative overflow-hidden rounded-[3rem] border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 p-8 flex flex-col items-center justify-center gap-6 transition-all duration-700 min-h-[380px] w-full"
                >
                  <div className="h-16 w-16 rounded-[1.8rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                    <Plus className="h-8 w-8 text-primary/40 group-hover:text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-black text-foreground/40 group-hover:text-foreground transition-colors uppercase tracking-[0.2em]">Registrar nuevo paciente</p>
                    <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em] italic">{6 - mineData.length} slots disponibles</p>
                  </div>
                </button>
              </ForenseTooltip>
            )}
          </div>
        )}
      </section>

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
                Deseas retirar la vigilancia sobre <span className="text-foreground">{deletingEndpoint.name}</span>.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all"
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
