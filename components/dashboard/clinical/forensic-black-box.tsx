"use client"
import { Code2, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ForensicBlackBox({ raw_data, status_code }: { raw_data: string | null, status_code: number | null }) {
  const isError = status_code && status_code >= 400
  const content = raw_data || "// No hay registros forenses disponibles para este latido."

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">
          <Code2 className="h-3 w-3 text-primary" /> 
          EVIDENCIA FORENSE
        </div>
        {isError && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[9px] font-black uppercase tracking-widest animate-pulse">
            <ShieldAlert className="h-3 w-3" /> FALLO DE CONEXIÓN
          </span>
        )}
      </div>
      
      <div className={cn(
        "relative group p-6 rounded-2xl font-mono text-xs leading-relaxed border transition-all duration-500",
        "bg-muted/10 border-border/20 text-muted-foreground",
        isError && "bg-red-500/5 border-red-500/20 text-red-400 shadow-inner"
      )}>
        <pre className="whitespace-pre-wrap break-all relative z-10">
          {content}
        </pre>
        {/* Efecto de degradado sutil de terminal */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/5 pointer-events-none" />
      </div>
    </div>
  )
}
