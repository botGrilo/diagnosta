"use client"
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ClinicalHeader({ name, id, ms }: { name: string, id: string, ms: number }) {
  const getCategory = (latency: number) => {
    if (latency < 300) return { label: 'Atleta', color: 'text-atleta border-atleta/20 bg-atleta/10' };
    if (latency < 600) return { label: 'Normal', color: 'text-normal border-normal/20 bg-normal/10' };
    if (latency < 1200) return { label: 'Fatigado', color: 'text-fatigado border-fatigado/20 bg-fatigado/10' };
    return { label: 'UCI', color: 'text-uci border-uci/20 bg-uci/10' };
  };

  const category = getCategory(ms);
  
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
      <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20")}>
          <Shield className="h-6 w-6 text-primary" />
         
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white leading-none truncate max-w-[150px]">{name}</h2>
          <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">NODE: {id.slice(0, 8)}...</p>
        </div>
      </div>
      <div className={cn("px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-widest", category.color)}>
        {category.label}       
      </div>
    </div>
  )
}
