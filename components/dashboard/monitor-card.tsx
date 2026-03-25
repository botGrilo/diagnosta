"use client"
import type { EndpointSummary } from "@/types/diagnosta"

function getStatusColor(ep: EndpointSummary): string {
  if (ep.isSuccess === null || ep.isSuccess === undefined)
    return "text-muted-foreground"
  if (ep.isSuccess) return "text-[var(--status-ok)]"
  return "text-[var(--status-down)]"
}

function getDotColor(ep: EndpointSummary): string {
  if (ep.isSuccess === null || ep.isSuccess === undefined)
    return "bg-muted-foreground"
  if (ep.isSuccess) return "bg-[var(--status-ok)]"
  return "bg-[var(--status-down)]"
}

function getStatusLabel(ep: EndpointSummary): string {
  if (ep.isSuccess === null || ep.isSuccess === undefined)
    return "Sin datos"
  if (ep.isSuccess) return "Nominal"
  return "Caído"
}

export function MonitorCard({ ep }: { ep: EndpointSummary }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4
      hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium tracking-wider
          text-muted-foreground uppercase truncate pr-2">
          {ep.name}
        </span>
        <div className={`h-2.5 w-2.5 rounded-full
          flex-shrink-0 ${getDotColor(ep)}`} />
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-2xl font-bold tabular-nums
          tracking-tight ${getStatusColor(ep)}`}>
          {ep.latencyMs ? `${ep.latencyMs}ms` : "—"}
        </span>
        {ep.deltaMs != null && (
          <span className={`text-xs font-medium tabular-nums ${
            ep.deltaMs > 0
              ? "text-[var(--status-degraded)]"
              : "text-[var(--status-ok)]"
          }`}>
            {ep.deltaMs > 0 ? "↑" : "↓"}
            {Math.abs(ep.deltaMs)}ms vs 1h
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-auto">
        <div className={`h-1.5 w-1.5 rounded-full
          ${getDotColor(ep)}`} />
        <span className={`text-xs font-medium
          ${getStatusColor(ep)}`}>
          {getStatusLabel(ep)}
        </span>
      </div>
    </div>
  )
}

export function MonitorCardSkeleton() {
  return (
    <div className="rounded-lg border border-border
      bg-card p-4 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-2.5 w-2.5 bg-muted rounded-full" />
      </div>
      <div className="h-7 w-16 bg-muted rounded mb-2 mt-2" />
      <div className="h-3 w-12 bg-muted rounded" />
    </div>
  )
}
