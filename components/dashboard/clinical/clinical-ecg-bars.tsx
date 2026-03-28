"use client"
import { cn } from '@/lib/utils'

interface ECGBarsProps {
  data?: number[]
  label?: string
  color?: 'atleta' | 'uci'
}

export function ClinicalECGBars({ data = [3, 5, 4, 8, 2, 6, 4, 7, 9, 5], label, color = 'atleta' }: ECGBarsProps) {
  return (
    <div className="space-y-2">
       <div className="flex gap-1 h-3">
          {data.map((h, i) => (
             <div key={i} className="flex-1 bg-white/[0.03] rounded-[1px] relative overflow-hidden group/bar">
                <div className={cn(
                  "absolute bottom-0 left-0 w-full rounded-t-[1px] transition-all duration-700",
                  color === 'atleta' ? "bg-atleta/40 group-hover/bar:bg-atleta" : "bg-uci/40 group-hover/bar:bg-uci"
                )} style={{ height: `${h * 10}%` }} />
             </div>
          ))}
       </div>
       {label && (
         <p className="text-[8px] font-black tracking-widest text-muted-foreground/30 uppercase italic">{label}</p>
       )}
    </div>
  )
}
