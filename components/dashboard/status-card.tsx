"use client"

import { cn } from "@/lib/utils"
// Inyectamos el cerebro para la lógica de la Card
import { getStatusDetails } from "@/lib/status-utils"
import { MoreVertical, Settings, History, Trash2, Brain } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StatusCardProps {
  name: string
  url: string
  isHealthy: boolean | null
  ms: number | null
  response_preview?: string | null
  onClick?: () => void
  onDiagnose?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onViewHistory?: () => void
  iaReport?: any
  isReference?: boolean
}

export function StatusCard({ 
  name, url, isHealthy, ms, response_preview, onClick, onDiagnose, onEdit, onDelete, onViewHistory, iaReport, isReference 
}: StatusCardProps) {
  const status = getStatusDetails(ms, isHealthy, response_preview || null);
  const ia = iaReport?.ai_recipe;
  const isCriticalIA = ia?.resumen_clinico?.gravedad === 'ROJO';

  return (
    <div 
      className={cn(
        "group relative overflow-hidden",
        "flex flex-col justify-between",
        "min-h-[280px] md:min-h-[380px]",
        "rounded-2xl md:rounded-[2.5rem]",
        "border border-border/40",
        "bg-card/30 backdrop-blur-sm md:backdrop-blur-2xl",
        "p-5 md:p-10",
        "transition-all duration-700",
        "md:hover:scale-[1.03] md:hover:-translate-y-3",
        isCriticalIA 
          ? "border-uci/60 md:shadow-[0_40px_80px_-20px_rgba(239,68,68,0.3)]" 
          : "md:hover:border-primary/60 md:hover:shadow-[0_40px_80px_-20px_rgba(0,242,255,0.2)]",
        "cursor-pointer active:scale-95",
        isReference ? "border-l-4 border-l-primary/20" : "border-l-4 border-l-atleta/20"
      )}
      onClick={onClick}
    >
      {/* MENÚ DE GESTIÓN (⋮) - Solo para nodos del usuario */}
      {!isReference && (
        <div className="absolute top-6 right-8 z-10" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-white/5 transition-all">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-white/10 rounded-2xl p-2 shadow-2xl">
              <DropdownMenuItem onClick={onEdit} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors focus:bg-primary/10 focus:text-primary">
                <Settings className="h-4 w-4" />
                <span className="font-bold text-[11px] uppercase tracking-widest">Editar configuración</span>
              </DropdownMenuItem>
              <div className="h-px bg-white/5 my-2" />
              <DropdownMenuItem onClick={onDelete} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors focus:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
                <span className="font-bold text-[11px] uppercase tracking-widest">Eliminar nodo</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* PARTE SUPERIOR (flex-1 para empujar el botón al fondo) */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                "h-4 w-4 rounded-full mt-2 shadow-[0_0_15px_currentColor]", 
                isHealthy ? status.color.replace('text-', 'bg-') : "bg-red-500 shadow-red-500/50",
                isCriticalIA && "animate-pulse"
              )} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* REGLA 3: Truncado estricto del nombre */}
                  <h3 className="font-black text-xl md:text-[1.6rem] text-foreground tracking-tight md:tracking-tighter truncate max-w-[140px] md:max-w-[160px]">
                    {name}
                  </h3>
                  {isReference && (
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[8px] font-black text-primary tracking-widest uppercase">Referencia</span>
                  )}
                </div>
                {/* REGLA 3: Truncado de URL */}
                <p className="text-[10px] font-mono text-muted-foreground/30 truncate max-w-[150px]">{url.replace('https://', '')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end text-right min-w-[120px]">
            <div className={cn(
              "text-5xl font-black italic tabular-nums tracking-tighter leading-none", 
              isCriticalIA ? "text-uci" : status.color
            )}>
              {ms ?? '--'}<span className="text-xs not-italic font-black opacity-30 ml-0.5">MS</span>
            </div>
            {/* REGLA 4: Label con altura fija y line-clamp */}
            <p className={cn(
              "text-[9px] font-black uppercase tracking-widest mt-2 whitespace-pre-line line-clamp-2 min-h-[2.2rem]", 
              isCriticalIA ? "text-uci" : status.color
            )}>
               {isCriticalIA ? "UCI — CRITICO" : status.label}
            </p>
          </div>
        </div>

        {/* SECCIÓN IA (Ajustada para line-clamp) */}
        {ia && (
          <div className="mt-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 relative overflow-hidden">
             <div className={cn("absolute top-0 left-0 w-1 h-full", isCriticalIA ? "bg-uci" : "bg-atleta")} />
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-atleta" /> Diagnóstico Dr. Grilo
             </p>
             <p className="text-[11px] font-bold italic text-foreground/90 leading-relaxed pr-4 line-clamp-3">
               "{ia.resumen_clinico.descripcion_humana}"
             </p>
          </div>
        )}
      </div>

      {/* PARTE INFERIOR: Acciones del Socio Goyo */}
      {!isReference ? (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (ia) onClick?.(); // Si ya hay IA, el botón abre el modal directamente
            else onDiagnose?.();
          }}
          className={cn(
            "mt-8 w-full group/btn flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest",
            ia 
              ? "border-primary/20 bg-primary/5 text-primary/60 hover:bg-primary/10 hover:text-primary" 
              : "border-atleta/20 bg-atleta/5 text-atleta/60 hover:text-atleta hover:bg-atleta/10"
          )}
        >
          <Brain className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
          {ia ? "Ver expediente clínico completo" : "Solicitar diagnóstico Dr. Grilo"}
        </button>
      ) : isReference ? (
        <div className="mt-8 pt-6 border-t border-white/5 opacity-20">
           <div className="flex items-end gap-1.5 h-10 px-2 justify-center">
             {[0.3, 0.5, 0.2, 0.8, 0.4].map((h, i) => (
               <div key={i} className="w-2 rounded-full bg-muted-foreground/20" style={{ height: `${h * 100}%` }} />
             ))}
           </div>
        </div>
      ) : null}

      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-full opacity-20 group-hover:opacity-100 transition-all duration-700", 
        isCriticalIA ? "bg-uci shadow-[0_0_20px_rgba(239,68,68,0.8)]" : status.bg
      )} />
    </div>
  )
}


export function SkeletonCard() {
  return (
    <div className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-sm p-10 animate-pulse min-h-[380px]">
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          <div className="h-4 w-4 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-white/10 rounded-lg" />
            <div className="h-3 w-24 bg-white/5 rounded-lg" />
          </div>
        </div>
        <div className="h-12 w-20 bg-white/10 rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-20 w-full bg-white/5 rounded-2xl" />
        <div className="h-10 w-full bg-primary/5 rounded-2xl" />
      </div>
    </div>
  )
}
