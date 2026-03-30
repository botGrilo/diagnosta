"use client"
import dynamic from 'next/dynamic'
import { 
  Activity, ShieldAlert, Zap, Thermometer, Info, 
  CheckCircle2, AlertCircle, Monitor, ChevronRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClinicalRecipeCard } from './clinical-recipe-card'
import { ClinicalMiniMetric } from './clinical-mini-metric'
import { ClinicalBadge } from './clinical-badge'
import { ClinicalECGBars } from './clinical-ecg-bars'

import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'

// OPTIMIZACIÓN 10/10: Lazy Loading del expediente pesado
const ClinicalMedicalReport = dynamic(() => import('./clinical-medical-report').then(mod => mod.ClinicalMedicalReport), {
  loading: () => (
    <div className="p-20 text-center space-y-4">
      <Activity className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Abriendo Expediente Forense...</p>
    </div>
  )
})

interface ClinicalStatusViewProps {
  status: any
  isLoadingAi?: boolean
  compact?: boolean  // true = tarjeta (1 col vertical) | false = modal (2 cols horizontal)
}

export function ClinicalStatusView({ status, isLoadingAi, compact = false }: ClinicalStatusViewProps) {
  const ia = status.ai_recipe;
  const epi = status.epidemiology_report;
  const hasIA = !!ia;
  const latency = (status.latency_ms || 0);
  const historyValues = epi?.recent_history?.map((h: any) => h.latency_ms) || [];

  const isHealthy = latency < 300
  const isWarning = latency >= 300 && latency < 800

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer group/card h-full">
          <ClinicalRecipeCard is_critical={ia?.resumen_clinico.gravedad === 'ROJO'}>
            {/* ── LAYOUT HORIZONTAL en desktop, vertical en mobile ── */}
            <div className="p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-700 relative h-full">

              {isLoadingAi && !hasIA && (
                <div className="absolute top-4 right-8 flex items-center gap-2 animate-pulse">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Inyectando IA...</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
              )}

              {/* Header fuera del grid — siempre ancho completo */}
              <div className="space-y-1 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black italic tracking-tighter text-foreground group-hover/card:text-primary transition-colors">
                    {status.name}
                  </h3>
                  <div className={cn(
                    "h-3 w-3 rounded-full animate-pulse",
                    isHealthy ? "bg-atleta shadow-[0_0_10px_rgba(45,212,191,0.3)]" :
                    isWarning ? "bg-amber-500" : "bg-uci hover:shadow-uci/50"
                  )} />
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{status.id?.slice(0, 8)}</span>
                  <span className="h-px w-3 bg-white/20" />
                  <span className="text-[10px] font-mono lowercase truncate">{status.url || "api.diagnosta.com"}</span>
                </div>
              </div>

              {/* ── GRID: 2 columnas en modal, 1 columna en tarjeta ── */}
              <div className={cn(
                "grid gap-6",
                compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
              )}>

                {/* COLUMNA IZQUIERDA: Métricas vitales + ECG */}
                <div className="space-y-5">
                  {/* Métricas de triaje */}
                  <div className="grid grid-cols-2 gap-px bg-white/5 rounded-[2rem] overflow-hidden border border-white/5 shadow-inner">
                    <ClinicalMiniMetric label="Latencia Actual" value={`${latency}ms`} variant={isHealthy ? "atleta" : isWarning ? "amber" : "uci"} />
                    <ClinicalMiniMetric label="Uptime" value={epi?.uptime_score || (status.uptimePct ? status.uptimePct + "%" : "100%")} variant="atleta" />
                    <ClinicalMiniMetric label="Promedio Hist." value={`${epi?.avg_latency || status.avgLatencyMs || 0}ms`} />
                    <ClinicalMiniMetric label="Tendencia" value={epi?.trend || ia?.analisis_tecnico?.tendencia || "ESTABLE"} variant={ia?.resumen_clinico?.gravedad === 'ROJO' ? "uci" : "atleta"} />
                  </div>

                  {/* ECG dinámico */}
                  <ClinicalECGBars data={historyValues} label={`SNAPSHOT: ${status.id?.slice(0, 8)}`} />
                </div>

                {/* COLUMNA DERECHA: Diagnóstico SRE + Badges + CTA */}
                <div className="flex flex-col gap-5">
                  {/* Narrativa Dr. SRE */}
                  <div className="flex-1 bg-white/[0.02] hover:bg-white/[0.04] rounded-[2rem] p-6 border border-white/5 space-y-3 relative overflow-hidden group-hover/card:border-primary/40 transition-all duration-500 shadow-2xl">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 shadow-[0_0_20px_rgba(45,212,191,0.2)]" />
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Diagnóstico SRE</h4>
                    </div>
                    {ia?.resumen_clinico?.titulo_diagnostico && (
                      <h4 className="text-[11px] font-black uppercase tracking-tighter text-atleta/80 mb-1">
                        {ia.resumen_clinico.titulo_diagnostico}
                      </h4>
                    )}
                    <p className="text-[13px] lg:text-[14px] font-bold italic text-foreground/90 leading-relaxed drop-shadow-sm">
                      "{hasIA ? ia.resumen_clinico.descripcion_humana : "Auditando tráfico en tiempo real. Análisis de persistencia técnica en curso..."}"
                    </p>
                  </div>

                  {/* Badges de estado */}
                  <div className="flex flex-wrap items-center gap-2">
                    <ClinicalBadge text={epi?.evidence_captured ? "Payload verificado" : "Auditoría activa"} variant="atleta" />
                    <ClinicalBadge text={`Patrón: ${epi?.trend || ia?.analisis_tecnico?.patron_historico || "NORMAL"}`} variant="gray" />
                    <BadgeCompact text={`EXEC #${ia?.execution_id || ia?._internal?.execution_id || '777'}`} />
                  </div>

                  {/* CTA — Expediente completo */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                      Explorar expediente clínico completo
                    </p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/card:translate-x-2 transition-transform" />
                  </div>
                </div>

              </div>{/* fin grid 2 cols */}

            </div>
          </ClinicalRecipeCard>
        </div>
      </DialogTrigger>

      
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent">
           {/* Inyección de accesibilidad requerida por Radix */}
           <div className="sr-only">
             <DialogTitle>{status.name} — Reporte Forense</DialogTitle>
             <DialogDescription>Expediente clínico detallado del Dr. Grilo para el endpoint {status.name}</DialogDescription>
           </div>
           
           <ClinicalMedicalReport status={status} />
        </DialogContent>

    </Dialog>
  )
}

function BadgeCompact({ text }: { text: string }) {
  return (
    <div className="px-2 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
       {text}
    </div>
  )
}
