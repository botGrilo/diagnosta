"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHelpEnabled } from "@/lib/hooks/use-help-enabled"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface ForenseTooltipProps {
  children: React.ReactNode        // elemento activador — botón, icono, métrica
  title: string                    // obligatorio
  description: string              // obligatorio
  icon?: React.ReactNode           // opcional — Lucide icon. Default: icono de ayuda '?'
  insight?: string                 // opcional — frase del Dr. Grilo en caja teal
  metrics?: { label: string; value: string }[]  // opcional — fila de métricas
  side?: 'top' | 'bottom' | 'left' | 'right'   // default: 'top'
  align?: 'start' | 'center' | 'end'            // default: 'start'
  disabled?: boolean               // fuerza ocultar independiente del estado global
  alwaysShow?: boolean             // bypass para el estado global (ej: para el botón de ayuda)
}

/**
 * COMPONENTE FORENSE TOOLTIP (EL OJO DEL DR. GRILO)
 * 
 * Un tooltip inteligente que vive en una capa superior (HoverCard) y se adapta
 * a la información disponible, colapsando secciones no enviadas.
 */
export function ForenseTooltip({
  children, title, description,
  icon, insight, metrics,
  side = 'top', align = 'start', disabled = false, alwaysShow = false
}: ForenseTooltipProps) {
  const helpEnabled = useHelpEnabled()
  
  // Si ayuda desactivada globalmente y no forzamos visibilidad -> solo renderiza children
  if ((!helpEnabled && !alwaysShow) || disabled) return <>{children}</>

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side={side} 
        align={align} 
        sideOffset={12}
        className="w-72 p-0 overflow-hidden border border-white/10 bg-[#01040a]/95 backdrop-blur-xl rounded-2xl shadow-2xl z-[150]"
      >
        
        {/* Caja 1 — Identidad (Siempre visible) */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-xl bg-atleta/10 border border-atleta/20 flex items-center justify-center text-atleta shrink-0">
              {icon || <HelpCircle className="h-4 w-4" />}
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
              {title}
            </h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Caja 2 — Métricas (Solo si metrics viene con datos) */}
        {metrics && metrics.length > 0 && (
          <div className="px-4 py-3 border-b border-white/5 grid grid-cols-2 gap-2 bg-white/[0.02]">
            {metrics.map((m, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  {m.label}
                </p>
                <p className="text-xs font-black text-atleta">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Caja 3 — Insight Dr. Grilo (Solo si el campo insight está presente) */}
        {insight && (
          <div className="p-4 bg-atleta/5 border-t border-atleta/10 relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-atleta" />
             <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded-full bg-atleta/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-atleta" />
                </div>
                <p className="text-[10px] italic text-atleta/80 leading-relaxed pr-2">
                  "{insight}"
                </p>
             </div>
          </div>
        )}

      </HoverCardContent>
    </HoverCard>
  )
}
