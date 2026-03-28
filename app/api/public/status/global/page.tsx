"use client"

import { useEffect, useState } from "react"
import { Globe, Shield, Zap, Activity } from "lucide-react"

interface EndpointStatus {
  id: string
  name: string
  url: string
  status_code: number | null
  latency_ms: number | null
  is_success: boolean | null
  checked_at: string | null
}

function StatusDot({ isSuccess }: { isSuccess: boolean | null }) {
  if (isSuccess === null) return <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse" />
  if (isSuccess) return <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
  return <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
}

export default function GlobalStatusPage() {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    try {
      const res = await fetch("/api/public/status", { cache: "no-store" })
      if (res.ok) setEndpoints(await res.json())
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const allOk = endpoints.length > 0 && endpoints.every(e => e.is_success !== false)

  return (
    <main className="flex-1 container max-w-lg mx-auto px-4 py-8">
      {/* ── HEADER DE RED GLOBAL ──────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Globe className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">Red Global</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
              Infraestructura Core
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border ${allOk ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
          <div className={`h-2 w-2 rounded-full ${allOk ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
          {allOk ? "SISTEMAS OPERATIVOS" : "INCIDENTE DETECTADO"}
        </div>
      </div>

      {/* ── ESTADO DE LOS SERVICIOS ──────────────────── */}
      <div className="space-y-3">
        {endpoints.map(ep => (
          <div key={ep.id} className="group rounded-xl border border-border/50 bg-card/30 p-4 transition-all hover:bg-card/50 hover:border-border">
            <div className="flex items-center gap-4">
              <StatusDot isSuccess={ep.is_success} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{ep.name}</p>
                  <span className="text-[10px] font-mono text-muted-foreground/50 truncate hidden sm:inline">
                    {ep.url}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ep.status_code ? `HTTP ${ep.status_code}` : "Esperando reporte..."}
                </p>
              </div>
              {ep.latency_ms && (
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-primary">{ep.latency_ms}ms</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                    <Activity className="h-3 w-3" />
                    Live
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && endpoints.length === 0 && (
          <div className="text-center py-12 space-y-4">
             <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
             <p className="text-xs text-muted-foreground font-mono">Sincronizando pulso global...</p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
        <Shield className="h-8 w-8 text-primary mx-auto mb-3 opacity-50" />
        <h3 className="text-xs font-bold uppercase tracking-tighter text-foreground mb-1">Protección Centralizada</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Estos nodos son monitorizados por el motor neurálgico de Diagnosta. Sirven como brújula de red para todos nuestros usuarios.
        </p>
      </div>
    </main>
  )
}
