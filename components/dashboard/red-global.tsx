import { Zap, Loader2, Sparkles } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"
import { ForenseTooltip } from "@/components/ui/forense-tooltip"

/**
 * COMPONENTE RED GLOBAL (PORTAL SRE)
 * 
 * Integra el disparador de IA con una brújula informativa.
 */
export function RedGlobal() {
  const router = useRouter()
  const pathname = usePathname()
  const isRedGlobalActive = pathname === "/status/global"
  const isAnalyzing = useDiagnostaStore((state) => state.isAnalyzing)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/status/global");
  }

  return (
    <ForenseTooltip
      title="Brújula de Red"
      description="Vigilancia colectiva de los pilares de Internet (GitHub, CoinGecko, etc.) en tiempo real."
      icon={<Zap className="h-4 w-4 text-emerald-400" />}
      insight="Si la Red Global está en verde y tu servicio en rojo, el fallo es local. Si ambos caen, es un problema general."
      side="bottom"
    >
      <div
        onClick={handleClick}
        className={cn(
          "group relative flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 cursor-pointer",
          "border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-lg shadow-black/20",
          "hover:border-atleta/40 hover:bg-atleta/5 hover:shadow-atleta/10 hover:-translate-y-0.5 active:scale-95",
          isRedGlobalActive 
            ? "bg-atleta/10 text-atleta border-atleta/40 shadow-[0_0_25px_rgba(0,242,255,0.15)]" 
            : "text-muted-foreground/50 hover:text-foreground"
        )}
      >
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </div>

        <span className="text-sm font-black uppercase tracking-[0.15em]">Red Global</span>
        
        {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin text-atleta" />}
        
        {!isAnalyzing && !isRedGlobalActive && (
          <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-atleta" />
        )}
      </div>
    </ForenseTooltip>
  )
}
