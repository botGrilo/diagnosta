"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Shield } from "lucide-react"

interface EndpointStatus {
  id: string
  name: string
  url: string
  status_code: number | null
  latency_ms: number | null
  is_success: boolean | null
  checked_at: string | null
  is_system: boolean
}

interface StatusPageData {
  username: string
  name: string
  uptime_pct: number
  endpoints: EndpointStatus[]
  last_updated: string
}

function StatusDot({ isSuccess }: { isSuccess: boolean | null }) {
  if (isSuccess === null)
    return <div className="h-3 w-3 rounded-full bg-muted-foreground flex-shrink-0" />
  if (isSuccess)
    return <div className="h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
  return <div className="h-3 w-3 rounded-full bg-red-500 flex-shrink-0" />
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Sin datos"
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Hace un momento"
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${Math.floor(hours / 24)}d`
}

export default function StatusPage() {
  const { username } = useParams<{ username: string }>()
  const [data, setData] = useState<StatusPageData | null>(null)
  const [error, setError] = useState(false)

  async function fetchData() {
    try {
      const res = await fetch(`/api/status/${username}`, { cache: "no-store" })
      if (!res.ok) { setError(true); return }
      setData(await res.json())
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [username])

  if (error) return (
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Página no encontrada</p>
        <p className="text-sm text-muted-foreground">
          El usuario @{username} no existe en Diagnosta
        </p>
      </div>
    </main>
  )

  if (!data) return (
    <main className="flex-1 flex items-center justify-center">
      <p className="text-sm text-muted-foreground animate-pulse">
        Cargando estado del sistema...
      </p>
    </main>
  )

  const personal = data.endpoints.filter(e => !e.is_system)
  const system = data.endpoints.filter(e => e.is_system)
  const allOk = data.endpoints.every(e => e.is_success !== false)

  return (
    <main className="container max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            {data.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-semibold">{data.name || data.username}</h1>
            <p className="text-xs text-muted-foreground">@{data.username}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${allOk ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${allOk ? "bg-green-500" : "bg-red-500"}`} />
          {allOk ? "Todo operativo" : "Incidente activo"}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Uptime global · últimas 24h
        </p>
        <p className="text-5xl font-bold text-green-500 tabular-nums">
          {data.uptime_pct}%
        </p>
      </div>

      {personal.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Servicios monitorizados
          </h2>
          <div className="space-y-2">
            {personal.map(ep => (
              <div key={ep.id} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
                <StatusDot isSuccess={ep.is_success} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{ep.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{ep.url}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {ep.latency_ms ? (
                    <p className="text-sm font-medium tabular-nums">{ep.latency_ms}ms</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">{timeAgo(ep.checked_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Red global Diagnosta
        </h2>
        <div className="space-y-2">
          {system.map(ep => (
            <div key={ep.id} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3 opacity-60">
              <StatusDot isSuccess={ep.is_success} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{ep.name}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium flex-shrink-0">
                    Global
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{ep.url}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {ep.latency_ms ? (
                  <p className="text-sm font-medium tabular-nums">{ep.latency_ms}ms</p>
                ) : null}
                <p className="text-xs text-muted-foreground">{timeAgo(ep.checked_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4 border-t border-border space-y-1">
        <p className="text-xs text-muted-foreground">
          Actualizado {timeAgo(data.last_updated)}
        </p>
        <p className="text-xs text-muted-foreground">
          Potenciado por <Link href="/" className="text-primary hover:underline underline-offset-2">Diagnosta</Link> · El Guardián de APIs
        </p>
      </div>
    </main>
  )
}

