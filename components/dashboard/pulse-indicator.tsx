import { cn } from "@/lib/utils"

interface PulseIndicatorProps {
  isHealthy: boolean | null
}

export function PulseIndicator({ isHealthy }: PulseIndicatorProps) {
  return (
    <div className="relative flex h-3 w-3">
      {isHealthy === null ? (
        <span className="h-full w-full rounded-full bg-muted-foreground animate-pulse" />
      ) : (
        <>
        {/* latido del corazon */}
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            isHealthy ? "bg-emerald-400" : "bg-red-400"
          )}></span>
          <span className={cn(
            "relative inline-flex h-3 w-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]",
            isHealthy ? "bg-emerald-500" : "bg-red-500"
          )}></span>

        </>
      )}
    </div>
  )
}
