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
  DialogTrigger 
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
}

export function ClinicalStatusView({ status, isLoadingAi }: ClinicalStatusViewProps) {
  const ia = status.ia_recipe;
  const epi = status.epidemiology_report || status.epidemiology;
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
            <div className="p-8 space-y-6 animate-in fade-in zoom-in-95 duration-700 relative h-full flex flex-col">
              
              {isLoadingAi && !hasIA && (
                <div className="absolute top-4 right-8 flex items-center gap-2 animate-pulse">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Inyectando IA...</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
              )}

              <div className="space-y-1">
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

              {/* ── MÉTRICAS DE TRIAJE (REUTILIZABLES) ──────────── */}
              <div className="grid grid-cols-2 gap-px bg-white/5 rounded-[2rem] overflow-hidden border border-white/5 shadow-inner">
                 <ClinicalMiniMetric label="Latencia Actual" value={`${latency}ms`} variant={isHealthy ? "atleta" : isWarning ? "amber" : "uci"} />
                 <ClinicalMiniMetric label="Uptime" value={epi?.uptime_score || "100%"} variant="atleta" />
                 <ClinicalMiniMetric label="Promedio Hist." value={`${epi?.avg_latency || 0}ms`} />
                 <ClinicalMiniMetric label="Tendencia" value={epi?.trend || ia?.analisis_tecnico?.tendencia || "ESTABLE"} variant={ia?.resumen_clinico?.gravedad === 'ROJO' ? "uci" : "atleta"} />
              </div>

              {/* ── MINI HISTORIAL DE PULSO (ECG DINÁMICO) ──────── */}
              <ClinicalECGBars data={historyValues} label={`SNAPSHOT: ${status.id?.slice(0, 8)}`} />

              {/* ── SECCIÓN DR. SRE (NARRATIVA ENGROSADA) ───────── */}
              <div className="flex-1 bg-white/[0.02] hover:bg-white/[0.04] rounded-[2rem] p-6 border border-white/5 space-y-3 relative overflow-hidden group-hover/card:border-primary/40 transition-all duration-500 shadow-2xl">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 shadow-[0_0_20px_rgba(45,212,191,0.2)]" />
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Diagnóstico SRE</h4>
                 </div>
                 <p className="text-[13px] md:text-[14px] font-bold italic text-foreground/90 leading-relaxed pr-6 drop-shadow-sm">
                   "{hasIA ? ia.resumen_clinico.descripcion_humana : "Auditando tráfico en tiempo real. Análisis de persistencia técnica en curso..."}"
                 </p>
              </div>

              {/* ── BADGES REUTILIZABLES ────────────────────────── */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                 <ClinicalBadge text={epi?.evidence_captured ? "Payload verificado" : "Auditoría activa"} variant="atleta" />
                 <ClinicalBadge text={`Patrón: ${epi?.trend || ia?.analisis_tecnico?.patron_historico || "NORMAL"}`} variant="gray" />
                 <BadgeCompact text={`EXEC #${ia?.execution_id || ia?._internal?.execution_id || '777'}`} />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                 <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                    Explorar expediente clínico completo
                 </p>
                 <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/card:translate-x-2 transition-transform" />
              </div>

            </div>
          </ClinicalRecipeCard>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#01040a] p-0 border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="p-8 md:p-16">
           <ClinicalMedicalReport status={status} />
        </div>
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
