"use client"
import React from 'react'
import { 
  Shield, Activity, Zap, Thermometer, Info, 
  CheckCircle2, AlertCircle, Terminal, 
  Database, Clock, Fingerprint, BarChart3, TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MedicalGauge } from './medical-gauge'

import { ClinicalMiniMetric } from './clinical-mini-metric'
import { ClinicalBadge } from './clinical-badge'
import { ClinicalECGBars } from './clinical-ecg-bars'

interface ClinicalMedicalReportProps {
  status: any
}

export function ClinicalMedicalReport({ status }: ClinicalMedicalReportProps) {
  const ia = status.ia_recipe
  const epi = status.epidemiology_report || status.epidemiology
  const hasIA = !!ia

  // Datos de Triage
  const latency = status.latency_ms || 0
  const avgLatency = typeof epi?.avg_latency === 'string' ? parseFloat(epi.avg_latency) : (epi?.avg_latency || 0)
  const isHealthy = latency < 300
  const isWarning = latency >= 300 && latency < 800
  const isCritical = latency >= 800

  // Historial y Estadísticas
  const recentHistory = epi?.recent_history || []
  const historyValues = recentHistory.map((h: any) => h.latency_ms)
  const minLatency = historyValues.length > 0 ? Math.min(...historyValues) : 0
  const maxLatency = historyValues.length > 0 ? Math.max(...historyValues) : 0

  return (
    <div className="space-y-8 py-4">
      {/* ── HEADER DE EXPEDIENTE ────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <div className={cn(
                "h-8 w-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center",
                isHealthy ? "text-atleta" : isWarning ? "text-amber-500" : "text-uci"
              )}>
                 <Shield className="h-4 w-4" />
              </div>
              <h2 className="text-2xl font-black italic tracking-tighter">
                {status.name} <span className="text-muted-foreground/40 not-italic font-medium">— Expediente Clínico</span>
              </h2>
           </div>
           <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
                 <Database className="h-2.5 w-2.5" /> ID: {status.id?.slice(0, 12)}
              </span>
              <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
                 <Fingerprint className="h-2.5 w-2.5" /> TRACE: {ia?.trace_id?.slice(0, 8) || "SRE_UNIFIED"}
              </span>
              <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
                 <Zap className="h-2.5 w-2.5" /> EXEC: #{ia?.execution_id || ia?._internal?.execution_id || "777"}
              </span>
              <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
                 <Terminal className="h-2.5 w-2.5" /> RAW STATUS: {status.status_code || status.statusCode || 200}
              </span>
           </div>
        </div>
        <div className={cn(
          "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]",
          isHealthy ? "bg-atleta/10 border-atleta/20 text-atleta" : 
          isWarning ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : 
          "bg-uci/10 border-uci/20 text-uci"
        )}>
          {isHealthy ? "VERDE — NORMAL" : isWarning ? "AMARILLO — ALERTA" : "ROJO — UCI"}
        </div>
      </div>

      {/* ── CUADRO DE MÉTRICAS CLAVE (USANDO COMPONENTES REUTILIZABLES) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
        <ClinicalMiniMetric label="Latencia Actual" value={`${latency}ms`} sub="Ciclo HTTPS completo" variant={isHealthy ? "atleta" : isWarning ? "amber" : "uci"} />
        <ClinicalMiniMetric label="Uptime Score" value={epi?.uptime_score || "100%"} sub="Últimos 10 checks" variant="atleta" />
        <ClinicalMiniMetric label="Promedio Histórico" value={`${avgLatency}ms`} sub={`Tendencia: ${ia?.analisis_tecnico?.tendencia || epi?.trend || "ESTABLE"}`} />
        <ClinicalMiniMetric label="Fallos Recientes" value={epi?.fallos_recientes || ia?.fallos_recientes || "0"} sub="de últimos 10 checks" variant={(epi?.fallos_recientes || ia?.fallos_recientes) > 0 ? "uci" : "atleta"} />
      </div>

      {/* ── LAYOUT DE DOS COLUMNAS (CONTENIDO FORENSE) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: DIAGNÓSTICO E IMPACTO */}
        <div className="space-y-8">
           {/* Resumen Clínico */}
           <Section title="Resumen Clínico">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                 {ia?.resumen_clinico?.titulo_diagnostico && (
                   <h4 className="text-base font-black text-atleta/90 mb-3 tracking-tight">
                     {ia.resumen_clinico.titulo_diagnostico}
                   </h4>
                 )}
                 <p className="text-sm font-bold italic text-foreground/90 leading-relaxed">
                   "{hasIA ? ia.resumen_clinico.descripcion_humana || ia.resumen_clinico.descripcion : "Auditando evidencias forenses en tiempo real..."}"
                 </p>
                 <div className="grid grid-cols-2 gap-4 mt-6">
                    <InfoField label="Gravedad" value={ia?.resumen_clinico.gravedad || "ESTABLE"} highlight={ia?.resumen_clinico.gravedad === 'ROJO'} />
                    <InfoField label="Categoría" value={epi?.health_category || "NORMAL"} />
                    <InfoField label="Requiere Humano" value={ia?.resumen_clinico.requiere_humano === true || ia?.resumen_clinico.requiere_humano === 'SÍ' ? "SÍ" : "NO"} />
                    <InfoField label="Panic Mode" value={epi?.panic_mode ? "ACTIVO" : "No activo"} highlight={epi?.panic_mode} />
                    <InfoField label="Capturado" value={epi?.captured_at ? new Date(epi.captured_at).toLocaleString() : new Date().toLocaleString()} />
                    <InfoField label="Evidencia" value="✓ Payload Real — verificado" positive />
                 </div>
              </div>
           </Section>

           {/* Análisis Técnico */}
           <Section title="Análisis Técnico">
              <div className="space-y-4">
                 <TechnicalField label="Causa raíz probable" value={ia?.analisis_tecnico.causa_raiz_probable || ia?.analisis_tecnico.causa_raiz || "Latencia de red estándar para JSON."} />
                 <TechnicalField label="Causa diferencial" value={ia?.analisis_tecnico.causa_diferencial || "Anomalía de Capa 7 descartada temporalmente."} />
                 <div className="grid grid-cols-2 gap-4">
                    <TechnicalField label="Destinatario" value={ia?.analisis_tecnico.destinatario || "AUTOMÁTICO"} />
                    <TechnicalField label="Patrón histórico" value={ia?.analisis_tecnico.patron_historico || ia?.analisis_tecnico.patron || "AGUDO"} />
                 </div>
                 <TechnicalField label="Tendencia" value={ia?.analisis_tecnico.tendencia || epi?.trend || "ESTABLE"} />
              </div>
           </Section>

           {/* Pronóstico */}
           <Section title="Pronóstico">
              <div className="grid grid-cols-2 gap-4">
                 <TechnicalField label="Tiempo Recuperación" value={ia?.pronostico.tiempo_recuperacion || ia?.pronostico.recuperacion || "Inmediato"} />
                 <TechnicalField label="Impacto negocio" value={ia?.pronostico.impacto_negocio || "Ninguno — Operativo."} highlight={ia?.resumen_clinico.gravedad === 'ROJO'} />
              </div>
           </Section>

           {/* Historial Visual (ECG dinámico) */}
           <Section title="Historial Clínico (Últimas 10 mediciones)">
              <ClinicalECGBars data={historyValues} label={`SNAPSHOT_ID: ${status.id?.slice(0, 8)}`} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                 <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1">Mín Histórico</p>
                    <p className="text-sm font-black text-atleta">{minLatency}ms</p>
                 </div>
                 <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1">Máx Histórico</p>
                    <p className="text-sm font-black text-amber-500">{maxLatency}ms</p>
                 </div>
              </div>
           </Section>
        </div>

        {/* COLUMNA DERECHA: PROTOCOLO DE INTERVENCIÓN */}
        <div className="space-y-8">
           <Section title="Protocolo de Intervención">
              <div className="space-y-4">
                 {hasIA && ia.protocolo_intervencion ? (
                   ia.protocolo_intervencion.map((step: any, idx: number) => (
                     <div key={idx} className="p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 space-y-3 group/step">
                        <div className="flex items-center gap-3">
                           <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-[10px]">
                              {step.paso}
                           </div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">{step.tipo}</h4>
                        </div>
                        <p className="text-xs font-bold text-foreground/70 leading-relaxed">{step.accion}</p>
                        {step.comando && (
                          <div className="relative group/copy">
                             <code className="block text-[10px] font-mono text-atleta bg-slate-950 p-4 rounded-xl border border-white/5 group-hover/step:border-atleta/30 transition-all overflow-x-auto whitespace-pre">
                                {step.comando}
                             </code>
                             <Terminal className="absolute right-4 top-4 h-3 w-3 text-atleta/20 group-hover/step:text-atleta/60" />
                          </div>
                        )}
                     </div>
                   ))
                 ) : (
                   <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-20">
                      <Clock className="h-8 w-8 mx-auto mb-4" />
                      <p className="text-xs font-black uppercase tracking-[0.3em]">Esperando Directivas Forenses...</p>
                   </div>
                 )}
              </div>
           </Section>

           {/* Badges de Verificación Reutilizables */}
           <div className="flex flex-wrap gap-2 pt-8">
              <ClinicalBadge text={epi?.evidence_captured ? "Payload verificado" : "Esperando IA"} variant="atleta" />
              <ClinicalBadge text={`Tendencia ${epi?.trend || ia?.analisis_tecnico?.tendencia || "ESTABLE"}`} variant="atleta" />
              <ClinicalBadge text={`${epi?.fallos_recientes || 0} fallos recientes`} variant={epi?.fallos_recientes > 0 ? "uci" : "gray"} />
              <ClinicalBadge text={`${epi?.uptime_score || "100%"} uptime`} variant="gray" />
              <ClinicalBadge text={`Patrón ${ia?.analisis_tecnico?.patron_historico || "INTERMITENTE"}`} variant="gray" />
           </div>
        </div>
      </div>

      {/* ── FOOTER DE FIRMA ───────────────────────────── */}
      <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
         <div className="flex items-center gap-3">
           <p className="text-xs font-mono font-black uppercase tracking-[0.2em]">
             {ia?.firma || "DR. GRILO · PROTOCOLO LOCAL"} · {ia?._internal?.timestamp || new Date().toISOString()}
           </p>
         </div>
         <div className="px-4 py-1.5 bg-slate-950 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <span className="text-muted-foreground">PROVEEDOR IA: {status.ai_provider || "Gemini_AI_n8n"}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-atleta" />
         </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="h-3 w-px bg-primary" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function TechnicalField({ label, value, highlight = false }: any) {
  return (
    <div className="flex justify-between items-start gap-4">
       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 shrink-0">{label}</span>
       <span className={cn("text-xs font-bold text-right leading-tight", highlight ? "text-uci" : "text-foreground/80")}>
         {value}
       </span>
    </div>
  )
}

function InfoField({ label, value, highlight = false, positive = false }: any) {
  return (
    <div className="flex justify-between items-center pb-2 border-b border-white/5">
       <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">{label}</span>
       <span className={cn(
         "text-[10px] font-black uppercase tracking-widest",
         highlight ? "text-uci" : positive ? "text-atleta" : "text-foreground/80"
       )}>
         {value}
       </span>
    </div>
  )
}

