"use client"
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface ClinicalBadgeProps {
  text: string
  variant?: 'atleta' | 'uci' | 'amber' | 'gray'
  icon?: React.ReactNode
}

export function ClinicalBadge({ text, variant = 'atleta', icon }: ClinicalBadgeProps) {
  const styles = {
    atleta: "bg-atleta/10 border-atleta/20 text-atleta",
    uci: "bg-uci/10 border-uci/20 text-uci",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    gray: "bg-white/5 border-white/5 text-muted-foreground/60"
  }

  return (
    <div className={cn(
      "px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300",
      styles[variant]
    )}>
       {icon || (variant === 'atleta' && <CheckCircle2 className="h-2.5 w-2.5" />)}
       {text}
    </div>
  )
}
