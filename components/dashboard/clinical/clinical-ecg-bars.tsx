"use client"
import { cn } from '@/lib/utils'

interface ECGBarsProps {
  data?: number[]
  label?: string
  color?: 'atleta' | 'uci'
}

export function ClinicalECGBars({ data = [], label, color = 'atleta' }: ECGBarsProps) {
  const maxLatency = data.length > 0 ? Math.max(...data) : 100
  return (
    <div className="space-y-2">
       <div className="flex gap-1 h-3">
          {data.length > 0 ? data.map((v, i) => {
             const height = Math.max(10, (v / maxLatency) * 100)
             return (
               <div key={i} className="flex-1 bg-white/[0.03] rounded-[1px] relative overflow-hidden group/bar">
                  <div className={cn(
                    "absolute bottom-0 left-0 w-full rounded-t-[1px] transition-all duration-700",
                    color === 'atleta' ? "bg-atleta/40 group-hover/bar:bg-atleta" : "bg-uci/40 group-hover/bar:bg-uci"
                  )} style={{ height: `${height}%` }} />
               </div>
             )
          }) : (
            [...Array(10)].map((_, i) => (
              <div key={i} className="flex-1 bg-white/[0.03] rounded-[1px]" />
            ))
          )}
       </div>
       {label && (
         <p className="text-[10px] font-black tracking-widest text-muted-foreground/30 uppercase italic">{label}</p>
       )}
    </div>
  )
}
