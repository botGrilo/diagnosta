"use client"

import { X, Terminal, Code2, Clock, Globe, ShieldAlert, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { PulseIndicator } from "./pulse-indicator"
import { ClinicalStatusView } from "./clinical/clinical-status-view"
import { ForenseTooltip } from "@/components/ui/forense-tooltip"

interface StatusModalProps {
  isOpen: boolean
  onClose: () => void
  endpoint: any | null
}

export function StatusModal({ isOpen, onClose, endpoint }: StatusModalProps) {
  if (!isOpen || !endpoint) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-10 backdrop-blur-sm bg-background/60 animate-in fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header: Vidrio y Status */}
        <div className="flex items-center justify-between p-6 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-4">
            <PulseIndicator isHealthy={endpoint.is_success || endpoint.isSuccess || false} />
            <h2 className="text-xl font-black tracking-tighter uppercase text-foreground">
               Diagnóstico: {endpoint.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* ── CUERPO DEL REPORTE CLÍNICO COMPLETO ── */}
        <div className="max-h-[78vh] overflow-y-auto custom-scrollbar bg-black/50">
           <ClinicalStatusView status={endpoint as any} />
        </div>

        {/* Footer: Firma Médica y Sync SRE */}
        <div className="p-5 bg-muted/20 border-t border-border/40 flex items-center justify-between">
           <ForenseTooltip 
             alwaysShow
             title="Validador SRE"
             description="Este expediente ha sido procesado por el cortex neuronal para identificar la causa raíz y proponer un protocolo de intervención clínica."
             insight="Firmado digitalmente por el Dr. Grilo — Especialista en Resiliencia de Sistemas."
             side="top"
           >
             <p className="text-[10px] font-black text-atleta uppercase tracking-[0.2em] italic flex items-center gap-2 cursor-help">
                <ShieldCheck className="h-3.5 w-3.5" /> Firmado por Dr. Grilo
             </p>
           </ForenseTooltip>
           
           <div className="flex items-center gap-4">
              <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.3em] hidden xs:block">Diagnosta Institucional</span>
              <p className="text-[10px] font-black text-foreground border border-border/40 bg-background px-3 py-1 rounded-full tabular-nums">
                 Sync: {endpoint.checked_at || endpoint.lastCheckedAt ? new Date(endpoint.checked_at || endpoint.lastCheckedAt).toLocaleTimeString() : '--:--:--'}
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
