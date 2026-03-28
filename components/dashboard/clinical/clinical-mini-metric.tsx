"use client"
import { cn } from '@/lib/utils'

interface MiniMetricProps {
  label: string
  value: string | number
  sub?: string
  variant?: 'atleta' | 'uci' | 'amber' | 'white'
}

export function ClinicalMiniMetric({ label, value, sub, variant = 'white' }: MiniMetricProps) {
  const textColor = {
    atleta: "text-atleta shadow-atleta/20",
    uci: "text-uci shadow-uci/20",
    amber: "text-amber-500 shadow-amber-500/20",
    white: "text-foreground"
  }

  return (
    <div className="bg-slate-950/40 p-5 md:p-6 space-y-1 border-r border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-all group/metric">
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover/metric:text-muted-foreground/60 transition-colors">{label}</p>
       <p className={cn("text-2xl font-black italic tracking-tighter drop-shadow-sm", textColor[variant])}>
          {value}
       </p>
       {sub && <p className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-widest">{sub}</p>}
    </div>
  )
}
