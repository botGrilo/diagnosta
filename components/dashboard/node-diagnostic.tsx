/* Este es el "Corazón" de la Edición Clínica. Es el motor que traduce los datos técnicos en lenguaje humano. Lo usaremos tanto en el Modal (vista compacta) como en la página de Red Global (vista completa). */
"use client"

import { cn } from "@/lib/utils"
import { ExternalLink, Info, Activity } from "lucide-react"

// Diccionario de "Recetas Médicas" para los Cinco de Oro
const NODE_METADATA: Record<string, { recipe: string, ref: string, link: string }> = {
  "GitHub API": {
    recipe: "Es el motor de nuestra cadena de suministro. Sin GitHub, no hay despliegues automatizados.",
    ref: "Docs Oficiales",
    link: "https://docs.github.com/en/rest"
  },
  "CoinGecko": {
    recipe: "Referencia global para datos de mercado. Monitorizarlo asegura que el flujo de datos externos sea veraz.",
    ref: "API Status",
    link: "https://www.coingeckostatus.com/"
  },
  "midu.dev": {
    recipe: "Nuestro nodo de comunidad. Garantiza que la puerta de entrada al conocimiento de la Hackathon esté abierta.",
    ref: "Comunidad MiduDev",
    link: "https://midu.dev"
  },
  "Hackathon API": {
    recipe: "El termómetro del evento. Monitoriza la salud de los repositorios participantes en tiempo real.",
    ref: "Repo del Proyecto",
    link: "https://github.com/midudev"
  },
  "CubePath": {
    recipe: "INFRAESTRUCTURA PROPIA. Si este nodo falla, Diagnosta pierde su capacidad de reporte estratégico.",
    ref: "Soporte Diagnosta",
    link: "https://cubepath.es"
  }
}

interface NodeDiagnosticProps {
  data: {
    id?: string  
    name: string
    url: string
    latency_ms: number | null
    is_success: boolean | null
  }
  mode?: 'compact' | 'full'
}

export function NodeDiagnostic({ data, mode = 'compact' }: NodeDiagnosticProps) {
  const meta = NODE_METADATA[data.name] || {
    recipe: "Nodo de infraestructura externa monitorizado bajo protocolos estándar.",
    ref: "Referencia General",
    link: data.url
  }

  // Lógica de diagnóstico médico
  const getDiagnosis = (ms: number | null) => {
    if (!data.is_success || (ms && ms > 1500)) return { label: "EN UCI (ESTADO CRÍTICO)", desc: "Se detecta un fallo total en la respuesta o latencia prohibitiva.", color: "text-red-500" }
    if (ms && ms < 200) return { label: "ATLETA (RITMO PERFECTO)", desc: "Rendimiento óptimo. La sincronización es instantánea.", color: "text-emerald-400" }
    if (ms && ms < 500) return { label: "RITMO NORMAL", desc: "Salud de red excelente. Operación sin contratiempos.", color: "text-emerald-500" }
    if (ms && ms < 800) return { label: "LEVE FATIGA", desc: "El servidor responde, pero muestra signos de carga moderada.", color: "text-amber-500" }
    return { label: "CONGESTIÓN DETECTADA", desc: "Tráfico pesado. La respuesta es lenta pero el nodo sigue vivo.", color: "text-orange-500" }
  }

  const diagnosis = getDiagnosis(data.latency_ms)

    return (
    <div className="space-y-6">
      
      {/* ── IDENTIDAD DEL PACIENTE (Header Clínico) ──────────────── */}
      <div className="flex justify-between items-start mb-6 border-b border-primary/10 pb-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">
            {data.name} 
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground mt-2 opacity-60 flex items-center gap-2">
            <span className="bg-muted px-1.5 py-0.5 rounded text-[8px] font-bold">NODE_ID</span>
            {data.id?.split('-')[0] || 'MASTER-CORE'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
           <Activity className="h-3 w-3 text-primary animate-pulse" />
           <span className="text-[9px] font-bold text-primary tracking-widest uppercase italic">Diagnóstico Maestro</span>
        </div>
      </div>

      {/* ── CUERPO DEL REPORTE (Grid dinámico) ──────────────────── */}
      <div className={cn(
        "space-y-6",
        mode === 'full' ? 'grid md:grid-cols-2 gap-10 items-start space-y-0' : 'flex flex-col'
      )}>
        
        {/* Lado A: Sección Médica */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <div className={cn("h-2 w-2 rounded-full shadow-lg", diagnosis.color.replace('text-', 'bg-'))} />
             <h3 className={cn("text-xs font-black uppercase tracking-widest", diagnosis.color)}>
               {diagnosis.label}
             </h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed font-medium italic border-l-2 border-primary/30 pl-4 bg-primary/[0.02] py-2 rounded-r-lg">
            "{diagnosis.desc}"
          </p>
        </div>

        {/* Lado B: La Receta y Referencia */}
        <div className="space-y-4">
          <div className="bg-card/40 backdrop-blur-sm p-5 rounded-2xl border border-border/40 shadow-inner">
             <div className="flex items-center gap-2 mb-3">
               <Info className="h-3.5 w-3.5 text-primary" />
               <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocolo de Monitoreo</h4>
             </div>
             <p className="text-xs leading-relaxed text-muted-foreground">
               {meta.recipe}
             </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 px-2">
            <a 
              href={meta.link} 
              target="_blank" 
              className="inline-flex items-center gap-2 text-[10px] font-black text-primary hover:text-primary/80 transition-colors group uppercase tracking-widest"
            >
              {meta.ref} <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
            
            <span className="text-[9px] font-mono text-muted-foreground opacity-40 italic">
               Ref: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

}
