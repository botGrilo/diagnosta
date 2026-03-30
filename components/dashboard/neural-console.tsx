"use client"
import { useEffect, useRef, useMemo } from 'react'
import { useDiagnostaStore } from '@/lib/store/diagnosta-store'
import { cn } from '@/lib/utils'
import { ForenseTooltip } from '@/components/ui/forense-tooltip'


const CAT_CONFIG = {
  RED:  { label: 'Red',       color: 'text-atleta',    dot: 'bg-atleta' },
  PROT: { label: 'Protocolo', color: 'text-amber-400', dot: 'bg-amber-400' },
}

// Nombres de pilares globales hardcodeados (vía Socio Goyo)
const GLOBAL_PILLAR_NAMES = [
  'Diagnosta (Core)', 'CubePath', 'CoinGecko Ping', 
  'midu.dev', 'GitHub API', 'Hackathon API'
]

export function NeuralConsole({ panicMode = false }: { panicMode?: boolean }) {
  const logs = useDiagnostaStore(s => s.consoleLogs)
  const showGlobal = useDiagnostaStore(s => s.showGlobal)
  const userNames = useDiagnostaStore(s => s.userEndpointNames)
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // LÓGICA DE FILTRADO FORENSE (Socio Goyo: Filtrado en render para limpiar lo acumulado)
  const filteredLogs = useMemo(() => {
    let result = logs.length > 0 ? logs : []
    
    // Si pilares están ocultos, filtrar sus líneas del historial
    if (!showGlobal) {
      result = result.filter(log => 
        !GLOBAL_PILLAR_NAMES.includes(log.endpoint_name)
      )
    }
    
    return result.slice(-50)
  }, [logs, showGlobal])

  // Motor Cíclico (Socio Goyo: Simulación de vida si no hay telemetría fresca)
  useEffect(() => {
    if (filteredLogs.length === 0) return
    
    const interval = setInterval(() => {
      // Solo rotar si el último dato tiene más de 30 segundos — estamos en reposo
      const lastLog = filteredLogs[filteredLogs.length - 1]
      const age = lastLog ? Date.now() - new Date(lastLog.timestamp).getTime() : 99999
      
      if (age > 30000) {
        useDiagnostaStore.getState().rotateConsoleLog()
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [filteredLogs.length])

  // Auto-scroll INTELIGENTE (Socio Goyo: Solo si el log es reciente)
  useEffect(() => {
    const el = scrollContainerRef.current
    const lastLog = filteredLogs[filteredLogs.length - 1]
    if (el && lastLog) {
      const age = Date.now() - new Date(lastLog.timestamp).getTime()
      if (age < 10000) { // <--- Solo scroll si es telemetría fresca (<10s)
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      }
    }
  }, [filteredLogs.length])

  return (
    <div className={cn(
      "rounded-[2.5rem] border overflow-hidden transition-all duration-500 bg-[#01040a]/80 backdrop-blur-xl",
      panicMode
        ? "border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
        : "border-white/10"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-8 py-5 border-b",
        panicMode ? "border-red-500/20 bg-red-950/20" : "border-white/5 bg-[#01040a]"
      )}>
        <div className="flex items-center gap-3">
          <span className={cn("text-base font-black italic", panicMode ? "text-red-400" : "text-atleta")}>⬡</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 italic">
            Consola Neuronal de Diagnóstico
          </span>
          <div className="flex items-center gap-2">
            <ForenseTooltip
              title="RED — Capa de Red"
              description="Mide la velocidad del paquete entre tú y el servidor. Es el pulso del sistema: qué tan rápido late la conexión."
              insight="Menos de 300ms es zona ATLETA. Más de 1200ms activa protocolo UCI."
              side="bottom"
            >
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-atleta/10 border border-atleta/20 text-atleta cursor-help">RED</span>
            </ForenseTooltip>
            <ForenseTooltip
              title="PROTOCOLO — Capa de Aplicación"
              description="Verifica que el servidor respondió correctamente. Es la presión arterial: no basta llegar rápido, hay que llegar bien."
              insight="Un status 200 es salud total. Un 500 es fallo estructural aunque la latencia sea baja."
              side="bottom"
            >
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400/10 border border-amber-400/20 text-amber-400 cursor-help">PROTOCOLO</span>
            </ForenseTooltip>
          </div>
        </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            panicMode ? "bg-red-500 shadow-[0_0_10px_rgb(239,68,68)]" : "bg-atleta shadow-[0_0_10px_rgb(45,212,191)]"
          )} />
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.4em] italic",
            panicMode ? "text-red-400" : "text-atleta"
          )}>
            {panicMode ? "ALERTA" : "LIVE"}
          </span>
        </div>
      </div>

      {/* Logs — Cascada animada con highlight de línea más reciente */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "h-44 overflow-y-auto p-4 space-y-2 font-mono scroll-smooth flex flex-col",
          panicMode ? "bg-red-950/10" : "bg-transparent"
        )}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2dd4bf40 transparent' }}
      >
        {filteredLogs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-atleta animate-ping" />
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black italic">
              Esperando próxima Ronda Médica...
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const cfg = CAT_CONFIG[log.cat as keyof typeof CAT_CONFIG] || CAT_CONFIG.RED
            const time = new Date(log.timestamp).toLocaleTimeString('es-ES', {
              hour: '2-digit', minute: '2-digit', second: '2-digit'
            })
            const isNewest = index === filteredLogs.length - 1
            return (
              <div
                key={log.id}
                className={cn(
                  "flex items-center gap-3 text-sm transition-all duration-500",
                  isNewest
                    ? "opacity-100 bg-white/[0.03] rounded-lg px-2 py-1"
                    : "opacity-60"
                )}
              >
                <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-black bg-white/5 text-slate-400 tabular-nums">
                  {time}
                </span>
                <div className={cn("flex items-center gap-1.5 shrink-0", cfg.color)}>
                  <div className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    cfg.dot,
                    isNewest && "animate-pulse"
                  )} />
                  <span className="font-black text-[11px] uppercase tracking-wide">{cfg.label}:</span>
                </div>
                <span className={cn(
                  "leading-snug text-sm",
                  panicMode ? "text-red-200" : "text-slate-200"
                )}>
                  {log.msg}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
