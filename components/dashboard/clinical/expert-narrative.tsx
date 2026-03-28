"use client"
import { BrainCircuit } from 'lucide-react'

export function ExpertNarrative({ text }: { text: string }) {
  return (
    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-black uppercase tracking-widest text-primary">Diagnóstico IA</span>
      </div>
      <p className="text-xs italic text-muted-foreground leading-relaxed">
        "{text}"
      </p>
    </div>
  )
}
