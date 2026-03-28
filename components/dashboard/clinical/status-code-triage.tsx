"use client"
import { cn } from '@/lib/utils'

export function StatusCodeTriage({ code, status }: { code: number | null, status: string }) {
  const isError = !code || code >= 400
  return (
    <div className="flex justify-between items-center py-4 border-t border-white/5">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status Code</span>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-2xl font-black font-mono",
          isError ? "text-red-500" : "text-emerald-500"
        )}>
          {code || '---'}
        </span>
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded border",
          isError ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        )}>
          {status}
        </span>
      </div>
    </div>
  )
}
