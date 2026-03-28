"use client"

import { Zap, Loader2, Sparkles } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

/**
 * COMPONENTE RED GLOBAL (PORTAL SRE)
 * 
 * Integra el disparador de IA con una brújula informativa.
 * Hover: Muestra contexto técnico.
 * Click: Dispara a n8n y navega al Dashboard.
 */
export function RedGlobal() {
  const router = useRouter()
  const pathname = usePathname()
  const isRedGlobalActive = pathname === "/status/global"

  const setTriggerRequested = useDiagnostaStore((state) => state.setTriggerRequested)
  const isAnalyzing = useDiagnostaStore((state) => state.isAnalyzing)

  const handleClick = (e: React.MouseEvent) => {
    // Evitamos propagaciones extrañas de Radix
    e.preventDefault();
    e.stopPropagation();
    console.log("🚀 Disparando Pulso SRE y Navegando...");
    setTriggerRequested(true);
    
    // Navegación forzada al Portal de Red Global
    router.push("/status/global");
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          onClick={handleClick}
          className={cn(
            "group relative flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer",
            isRedGlobalActive 
              ? "bg-atleta/10 text-atleta border border-atleta/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]" 
              : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
          )}
        >
          {/* Indicador de Latido */}
          <div className="relative flex h-2 w-2">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"
            )}></span>
            <span className={cn(
              "relative inline-flex h-2 w-2 rounded-full bg-emerald-500"
            )}></span>
          </div>

          <span className="text-sm font-black uppercase tracking-[0.15em]">Red Global</span>
          
          {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin text-atleta" />}
          
          {!isAnalyzing && !isRedGlobalActive && (
            <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-atleta" />
          )}
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl z-[100]" sideOffset={12}>
        <div className="flex gap-4">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Zap className="h-5 w-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
              🌐 Brújula de Red
            </h4>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Vigilancia colectiva de los pilares de Internet (GitHub, CoinGecko, etc.) en tiempo real.
            </p>
            <div className="bg-atleta/5 rounded-lg p-2.5 border border-atleta/10 mt-2">
              <p className="text-[10px] leading-tight font-medium text-atleta italic">
                "Si la Red Global está en verde y tu servicio en rojo, el fallo es local. Si ambos caen, es un problema general. Eficiencia total."
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
