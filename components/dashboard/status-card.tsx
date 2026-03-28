import { PulseIndicator } from "./pulse-indicator"
import { cn } from "@/lib/utils"
// Inyectamos el cerebro para la lógica de la Card
import { getStatusDetails } from "@/lib/status-utils"
interface StatusCardProps {
  name: string
  url: string
  isHealthy: boolean | null
  ms: number | null
  response_preview?: string | null
  onClick?: () => void
  iaReport?: any // Reporte de n8n (FIFO)
}

export function StatusCard({ name, url, isHealthy, ms, response_preview, onClick, iaReport }: StatusCardProps) {
  const status = getStatusDetails(ms, isHealthy, response_preview || null);
  const ia = iaReport?.ai_recipe;
  const isCriticalIA = ia?.resumen_clinico?.gravedad === 'ROJO';

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-2xl p-8 md:p-10",
        "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:scale-[1.03] hover:-translate-y-3",
        isCriticalIA ? "border-uci/60 shadow-[0_40px_80px_-20px_rgba(239,68,68,0.3)] shadow-uci/20" : "hover:border-primary/60 hover:shadow-[0_40px_80px_-20px_rgba(0,242,255,0.2)]",
        "cursor-pointer active:scale-95 flex flex-col justify-between min-h-[300px]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* LADO IZQUIERDO: Identidad (60%) */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "h-4 w-4 rounded-full mt-2 shadow-[0_0_15px_currentColor] transition-all duration-500", 
              isHealthy ? status.color.replace('text-', 'bg-') : "bg-red-500 shadow-red-500/50",
              isCriticalIA && "animate-pulse"
            )} />
            <div className="space-y-1">
              <h3 className="font-black text-[1.6rem] text-foreground group-hover:text-primary transition-colors tracking-tighter leading-tight truncate max-w-[180px]">
                {name}
              </h3>
              <div className={cn(
                "inline-flex items-center px-4 py-1 rounded-full border border-white/5 bg-white/5",
                "text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm",
                status.isVerified ? "text-atleta" : "text-muted-foreground/60"
              )}>
                {status.isVerified ? "✓ Verificado" : "~ Conexión"}
              </div>
            </div>
          </div>
          <p className="inline-block text-[10px] font-mono text-muted-foreground/30 tracking-widest bg-muted/10 px-3 py-1.5 rounded-xl border border-border/20 truncate max-w-[150px]">
            {url.replace('https://', '')}
          </p>
        </div>
        
        {/* LADO DERECHO: Métricas Vivas (Sensor SWR) */}
        <div className="flex flex-col items-end text-right min-w-[130px] transition-all duration-700">
          <div className={cn(
            "text-5xl md:text-6xl font-black italic tabular-nums tracking-tighter leading-none transition-all duration-700", 
            isCriticalIA ? "text-uci" : status.color,
            "group-hover:drop-shadow-[0_0_20px_currentColor]" 
          )}>
            {ms ?? '--'}<span className="text-xs not-italic font-black opacity-30 ml-0.5">MS</span>
          </div>
          <p className={cn(
            "text-[10px] font-black uppercase tracking-widest mt-2 whitespace-pre-line leading-none opacity-80", 
            isCriticalIA ? "text-uci" : status.color
          )}>
             {isCriticalIA ? "UCI — CRITICO" : status.label}
          </p>
        </div>
      </div>

      {/* ── SECCIÓN CENTRAL: DIAGNÓSTICO IA (FIFO) ──────────── */}
      {ia ? (
        <div className="mt-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700">
           <div className={cn("absolute top-0 left-0 w-1 h-full", isCriticalIA ? "bg-uci" : "bg-atleta")} />
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
             <span className="h-1.5 w-1.5 rounded-full bg-atleta" /> Diagnóstico SRE
           </p>
           <p className="text-[11px] font-bold italic text-foreground/90 leading-relaxed pr-4">
             "{ia.resumen_clinico.descripcion_humana}"
           </p>
        </div>
      ) : (
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] italic mb-4 text-center">
            Trazabilidad Capa 7 (Latidos)
          </p>
          <div className="flex items-end gap-1.5 h-10 opacity-40 group-hover:opacity-100 transition-all duration-700 px-2 justify-center">
            {[0.3, 0.5, 0.2, 0.4, 0.6, 0.3, 0.5, 0.8].map((h, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 rounded-full transition-all duration-1000", 
                  i === 7 ? status.bg : "bg-muted-foreground/20"
                )}
                style={{ 
                  height: `${h * 100}%`,
                  transitionDelay: `${i * 30}ms`
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className={cn(
        "absolute bottom-0 left-0 h-1.5 w-full opacity-40 group-hover:opacity-100 transition-all duration-700", 
        isCriticalIA ? "bg-uci shadow-[0_0_20px_rgba(239,68,68,0.8)]" : status.bg
      )} />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-muted" />
            <div className="h-5 w-32 rounded bg-muted" />
          </div>
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
        <div className="h-6 w-16 rounded-full bg-muted" />
      </div>
    </div>
  )
}
