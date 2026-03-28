"use client"
import { cn } from '@/lib/utils'

/**
 * MEDICAL GAUGE v2.0 (SRE Critical Monitor)
 * Diseño de monitor de signos vitales (ECG) para visualización de latencia técnica.
 */
export function MedicalGauge({ value, label }: { value: number, label: string }) {
  // Escala de saturación (Monitor UCI): < 300ms (Estable), < 800ms (Crítico), > 800ms (Colapso)
  const isHealthy = value < 300
  const isWarning = value >= 300 && value < 800
  const isCritical = value >= 800
  
  // Posición del 0 al 100 basada en un umbral dinámico de 1200ms para SRE
  const fillPercentage = Math.min((value / 1200) * 100, 100)
  
  return (
    <div className="space-y-4 group">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
           <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">{label}</span>
           <div className="flex items-center gap-2">
              <div className={cn(
                "h-1.5 w-4 rounded-full transition-all duration-700",
                isHealthy ? "bg-atleta" : isWarning ? "bg-amber-500 shadow-[0_0_10px_#f59e0b20]" : "bg-uci shadow-[0_0_15px_#f43f5e40]"
              )} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-foreground/80">
                SENSOR: {isHealthy ? 'SANO' : isWarning ? 'ESTRÉS_CAP 7' : 'UCI_REQUERIDA'}
              </span>
           </div>
        </div>
        <span className={cn(
          "text-4xl font-black tabular-nums tracking-tighter italic transition-all duration-500",
          isHealthy ? "text-atleta" : isWarning ? "text-amber-500 drop-shadow-lg" : "text-uci animate-pulse"
        )}>
          {value}<span className="text-sm not-italic opacity-20 ml-1">ms</span>
        </span>
      </div>
      
      {/* MONITOR ECG (GRID TÉCNICO) */}
      <div className="h-10 w-full bg-slate-950/80 border border-white/5 rounded-xl relative overflow-hidden group-hover:bg-slate-900/80 transition-colors shadow-inner">
        {/* Rejilla Médica de Fondo (Simulación ECG) */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
            backgroundSize: '10px 10px' 
          }} 
        />
        
        {/* Línea de Base */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />

        {/* Barra de Pulso Dinámica con Glow Reactivo */}
        <div className={cn(
          "absolute inset-y-0 left-0 transition-all duration-1000 ease-out flex items-center shadow-2xl",
          isHealthy ? "bg-atleta/40 shadow-atleta/40" : 
          isWarning ? "bg-amber-500/40 shadow-amber-500/20" : 
          "bg-uci/60 shadow-uci/40"
        )} style={{ width: `${fillPercentage}%` }}>
           {/* Puntero Láser (Efecto Scanline) */}
           <div className={cn(
             "absolute right-0 h-full w-1 animate-pulse",
             isHealthy ? "bg-atleta" : isWarning ? "bg-amber-500" : "bg-uci"
           )} />
        </div>
      </div>

      {/* RANGOS DE TRIAGE SRE */}
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-1 italic">
        <span className={isHealthy ? "text-atleta/80" : ""}>Óptimo &lt;300ms</span>
        <span className={isWarning ? "text-amber-500/80" : ""}>Alerta &lt;800ms</span>
        <span className={isCritical ? "text-uci/80" : ""}>UCI &gt;800ms</span>
      </div>
    </div>
  )
}
