import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface LatencyBadgeProps {
  ms: number | null
}

export function LatencyBadge({ ms }: LatencyBadgeProps) {
  if (ms === null) return null

  // Lógica definida por el CTO para evitar falsos rojos en llamadas transatlánticas
  const getColor = () => {
    if (ms < 600) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    if (ms < 1000) return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    return "text-red-500 bg-red-500/10 border-red-500/20"
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold tracking-tight shadow-sm",
      getColor()
    )}>
      <Activity className="h-3 w-3" />
      {ms}ms
    </div>
  )
}
