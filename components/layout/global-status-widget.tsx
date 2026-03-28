"use client"

import { useEffect, useState } from "react"

interface SystemStatus {
  id: string
  name: string
  url: string
  status_code: number | null
  latency_ms: number | null
  is_success: boolean | null
  checked_at: string | null
}

export function GlobalStatusWidget() {
  const [endpoints, setEndpoints] = useState<SystemStatus[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchStatus() {
    try {
      const res = await fetch("/api/public/status", { cache: "no-store" })
      if (res.ok) {
        setEndpoints(await res.json())
      }
    } catch (err) {
      console.error("Widget fetch failure:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && endpoints.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto h-24 bg-card/50 border border-border animate-pulse rounded-xl flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Sincronizando con red global...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-card/30 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="bg-muted/10 px-4 py-2 border-b border-border/30 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Red Global en Vivo
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          Refresh: 30s
        </span>
      </div>
      
      <div className="p-3 max-h-[200px] overflow-y-auto scrollbar-hide grid gap-2">
        {endpoints.map((ep) => (
          <div key={ep.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
               <div className={`h-2 w-2 rounded-full shrink-0 ${
                ep.is_success === null ? "bg-muted-foreground" :
                ep.is_success ? "bg-green-500" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
               }`} />
               <span className="text-xs font-semibold truncate text-foreground/80">{ep.name}</span>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
              {ep.latency_ms && (
                <span className="text-[10px] tabular-nums font-mono text-muted-foreground/80">
                  {ep.latency_ms}ms
                </span>
              )}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-default ${
                ep.is_success ? "text-green-500" : "text-red-500"
              }`}>
                {ep.status_code || "N/A"}
              </span>
            </div>
          </div>
        ))}

        {endpoints.length === 0 && (
          <p className="text-[10px] text-center text-muted-foreground py-4 italic">
            No hay puntos de diagnóstico disponibles en este momento.
          </p>
        )}
      </div>
    </div>
  )
}
