"use client"

import { X, Terminal, Code2, Clock, Globe, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { PulseIndicator } from "./pulse-indicator"
import { NodeDiagnostic } from "./node-diagnostic"
import { ClinicalStatusView } from "./clinical/clinical-status-view"

interface StatusModalProps {
  isOpen: boolean
  onClose: () => void
  endpoint: {
    name: string
    url: string
    is_success: boolean | null
    status_code: number | null
    latency_ms: number | null
    response_preview: string | null
    checked_at: string | null
  } | null
}

export function StatusModal({ isOpen, onClose, endpoint }: StatusModalProps) {
  if (!isOpen || !endpoint) return null

  return (
        <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-background/60 animate-in fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      {/* Permitimos que el usuario cierre el diagnóstico clínico simplemente haciendo clic fuera de la ventana.*/}
      <div 
        className="relative w-full max-w-2xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

                {/* Header: Vidrio y Status */}
        <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-4">
            <PulseIndicator isHealthy={endpoint.is_success ?? false} />
            <h2 className="text-xl font-black tracking-tighter uppercase text-foreground">
               Diagnóstico: {endpoint.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* ── CUERPO DEL REPORTE CLÍNICO ── */}
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar p-0 bg-black/50">
           {/* Inyectamos la vista clínica aquí // <--- Reemplaza aquí */}
           <ClinicalStatusView status={endpoint} />
        </div>

        {/* Body: Consola de Ingeniería Clínica */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* METADATA RÁPIDA (Versión simplificada) */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-background/40 border border-border/20 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-1">
                   <Clock className="h-3 w-3" /> Latencia Real
                </div>
                <p className="text-xl font-black font-mono text-foreground">{endpoint.latency_ms}ms</p>
             </div>
             <div className="bg-background/40 border border-border/20 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-1">
                   <Terminal className="h-3 w-3" /> Status Code
                </div>
                <p className={cn("text-xl font-black font-mono", endpoint.is_success ? "text-emerald-500" : "text-red-500")}>
                   {endpoint.status_code || '--'}
                </p>
             </div>
          </div>
        </div>

        {/* Footer: Timestamp consolidado */}
        <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
              "Análisis forense generado por el Motor de Diagnosta"
           </p>
           <p className="text-[10px] font-black text-foreground border border-border/40 bg-background px-3 py-1 rounded-full tabular-nums">
              Sync: {endpoint.checked_at ? new Date(endpoint.checked_at).toLocaleTimeString() : '--:--:--'}
           </p>
        </div>
      </div>
    </div>
  )
}