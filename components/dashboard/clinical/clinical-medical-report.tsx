"use client"
import React, { useState } from 'react'
import { Shield, Zap, Terminal, Database, Clock, Fingerprint, FileDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClinicalMiniMetric } from './clinical-mini-metric'
import { ClinicalBadge } from './clinical-badge'
import { ClinicalECGBars } from './clinical-ecg-bars'
import { generateClinicalReportHTML } from './clinical-report-generator'

interface ClinicalMedicalReportProps { status: any }

export function ClinicalMedicalReport({ status }: ClinicalMedicalReportProps) {
  const ia = status.ai_recipe
  const epi = status.epidemiology_report
  const hasIA = !!ia
  const latency = status.latency_ms || 0
  const recentHistory = epi?.recent_history || []
  const historyValues = recentHistory.map((h: any) => h.latency_ms)
  const minLatency = historyValues.length > 0 ? Math.min(...historyValues) : 0
  const maxLatency = historyValues.length > 0 ? Math.max(...historyValues) : 0

  const gravedad = ia?.resumen_clinico?.gravedad || epi?.gravedad || 'VERDE'
  const gravedadColor = gravedad === 'ROJO' ? 'bg-red-500/10 border-red-500/60 text-red-400'
    : gravedad === 'AMARILLO' ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
    : 'bg-atleta/10 border-atleta/60 text-atleta'

  const protocolo = ia?.protocolo_intervencion || []

  const exportPDF = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=800')
    if (!printWindow) return

    const html = generateClinicalReportHTML(status, ia, epi, latency, protocolo)
    printWindow.document.write(html)
    printWindow.document.close()
  }

  const protocoloLargo = protocolo.length >= 2
  const isLoading = status?._loading && !hasIA

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#01040a] min-h-[400px]">
        <div className="h-10 w-10 rounded-full border-2 border-atleta border-t-transparent animate-spin" />
        <div className="text-center space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-atleta animate-pulse">
            Dr. Grilo analizando...
          </p>
          <p className="text-[10px] text-slate-500 font-mono italic">
            Auditando telemetría forense de {status.name}
          </p>
        </div>
      </div>
    )
  }

  // Reemplaza cualquier URL placeholder con la URL real del endpoint
  const limpiarComando = (cmd: string) => {
    if (!cmd) return cmd
    return cmd
      .replace(/https?:\/\/\[[A-Z_\]]+/g, status.url || 'https://endpoint')
      .replace(/https?:\/\/[^\s"'\n\\]+/g, status.url || 'https://endpoint')
  }

  return (
    <div id="expediente-clinico" className="space-y-8 py-4 bg-[#01040a]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-atleta/20 border border-atleta/40 flex items-center justify-center text-atleta">
              <Shield className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-white">
              {status.name} <span className="text-slate-400 not-italic font-medium text-lg">— Expediente Clínico</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BadgeHeader icon={<Database className="h-2.5 w-2.5" />} label="ID" value={status.id?.slice(0, 12)} />
            <BadgeHeader icon={<Fingerprint className="h-2.5 w-2.5" />} label="TRACE" value={ia?.trace_id?.slice(0, 8) || "SRE_UNIFIED"} />
            <BadgeHeader icon={<Zap className="h-2.5 w-2.5" />} label="EXEC" value={`#${status._internal?.execution_id || ia?._internal?.execution_id || "---"}`} highlight />
            <BadgeHeader icon={<Terminal className="h-2.5 w-2.5" />} label="RAW STATUS" value={status.status_code || 200} />
          </div>
        </div>
        <div className={cn("px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-[0.2em] shrink-0", gravedadColor)}>
          {gravedad} — {epi?.health_category || 'NORMAL'}
        </div>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
        <ClinicalMiniMetric label="Latencia Actual" value={`${latency}ms`} sub="Ciclo HTTPS completo" variant={latency < 300 ? "atleta" : latency < 1200 ? "amber" : "uci"} />
        <ClinicalMiniMetric label="Uptime" value={epi?.uptime_score || "100%"} variant="atleta" />
        <ClinicalMiniMetric label="Promedio Hist." value={`${epi?.avg_latency || 0}`} sub={`Tendencia: ${epi?.trend || 'ESTABLE'}`} />
        <ClinicalMiniMetric label="Fallos Recientes" value={epi?.fallos_recientes ?? "0"} sub="de últimos 10 checks" variant={epi?.fallos_recientes > 0 ? "uci" : "atleta"} />
      </div>

      {/* DOS COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-8">

          <Section title="Resumen Clínico">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-atleta/60" />
              {ia?.resumen_clinico?.titulo_diagnostico && (
                <h4 className="text-base font-black text-atleta mb-3 tracking-tight uppercase pl-3">
                  {ia.resumen_clinico.titulo_diagnostico}
                </h4>
              )}
              <p className="text-sm font-bold italic text-white/90 leading-relaxed pl-3">
                "{hasIA ? ia.resumen_clinico.descripcion_humana : "Auditando evidencias forenses en tiempo real..."}"
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5 pl-3">
                <InfoField label="Gravedad" value={gravedad} highlight={gravedad === 'ROJO'} />
                <InfoField label="Categoría" value={epi?.health_category || "NORMAL"} />
                <InfoField label="Requiere Humano" value={ia?.resumen_clinico?.requiere_humano ? "SÍ" : "NO"} />
                <InfoField label="Panic Mode" value={epi?.panic_mode ? "ACTIVO" : "No activo"} highlight={epi?.panic_mode} />
                <InfoField label="Capturado" value={epi?.captured_at ? new Date(epi.captured_at).toLocaleTimeString() : new Date().toLocaleTimeString()} />
                <InfoField label="Evidencia" value={epi?.evidence_captured ? "✓ Payload Real" : "Conectividad"} positive={epi?.evidence_captured} />
              </div>
              {epi?.analisis_junior?.comparacion_2h && (
                <div className="mt-4 ml-3 p-3 rounded-xl bg-atleta/10 border border-atleta/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-atleta/60 mb-1">Desviación Histórica (2h)</p>
                  <p className="text-sm font-black text-white leading-snug">{epi.analisis_junior.comparacion_2h}</p>
                </div>
              )}
            </div>
          </Section>

          {epi?.analisis_junior && (
            <Section title="Análisis Estadístico">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <StatRow label="Desviación estándar" value={`${epi.analisis_junior.std_dev}ms — ${epi.analisis_junior.estabilidad}`} />
                <StatRow label="Percentil actual" value={`${epi.analisis_junior.percentil}% — ${epi.analisis_junior.percentil_label}`} />
                <StatRow label="Rango histórico" value={`${epi.analisis_junior.min_latency}ms – ${epi.analisis_junior.max_latency}ms`} />
                <StatRow label="vs promedio" value={epi.analisis_junior.comparacion} highlight={epi.analisis_junior.pct_vs_avg > 50} />
                <StatRow label="Patrón horario" value={epi.analisis_junior.patron_horario} />
                <StatRow label="Racha sobre umbral" value={`${epi.analisis_junior.racha_sobre_umbral} checks consecutivos`} highlight={epi.analisis_junior.racha_sobre_umbral > 3} last />
              </div>
            </Section>
          )}

          <Section title="Análisis Técnico">
            <div className="space-y-3">
              <TechnicalField label="Causa raíz probable" value={ia?.analisis_tecnico?.causa_raiz_probable || "Latencia de red estándar."} />
              <TechnicalField label="Causa diferencial" value={ia?.analisis_tecnico?.causa_diferencial || "Sin anomalía detectada."} />
              <div className="grid grid-cols-2 gap-3">
                <TechnicalField label="Destinatario" value={ia?.analisis_tecnico?.destinatario || "AUTOMÁTICO"} />
                <TechnicalField label="Patrón histórico" value={ia?.analisis_tecnico?.patron_historico || "ESTABLE"} />
              </div>
              <TechnicalField label="Tendencia" value={ia?.analisis_tecnico?.tendencia || epi?.trend || "ESTABLE"} />
            </div>
          </Section>

          <Section title="Pronóstico">
            <div className="grid grid-cols-2 gap-3">
              <TechnicalField label="Tiempo recuperación" value={ia?.pronostico?.tiempo_recuperacion || "N/A"} />
              <TechnicalField label="Impacto negocio" value={ia?.pronostico?.impacto_negocio || "Ninguno"} highlight={gravedad === 'ROJO'} />
            </div>
          </Section>

          <Section title="Historial Clínico (Últimas 10 mediciones)">
            <ClinicalECGBars data={historyValues} label={`SNAPSHOT_ID: ${status.id?.slice(0, 8)}`} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Mín Histórico</p>
                <p className="text-sm font-black text-atleta">{minLatency}ms</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Máx Histórico</p>
                <p className="text-sm font-black text-amber-400">{maxLatency}ms</p>
              </div>
            </div>
          </Section>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-8">

          <Section title="Protocolo de Intervención">
            <div className="space-y-4">
              {hasIA && protocolo.length > 0 ? (
                protocolo.map((step: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-atleta/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-atleta text-black flex items-center justify-center font-black text-[10px] shrink-0">
                        {step.paso}
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-atleta">PASO: {step.tipo}</h4>
                    </div>
                    <p className="text-xs font-bold text-white/80 leading-relaxed">{step.accion}</p>
                    {step.comando && (
                      <div className="space-y-3">
                        {/* Comando del protocolo */}
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Comando</p>
                          <code className="block text-[10px] font-mono text-atleta bg-slate-950 p-3 rounded-xl border border-white/5 whitespace-pre-wrap break-all leading-relaxed">
                            {limpiarComando(step.comando)}
                          </code>
                        </div>

                        {/* Ejemplo ejecutable solo si el paso tiene curl y hay URL real */}
                        {step.comando.toLowerCase().includes('curl') && status.url && (
                          <div className="p-4 rounded-xl border border-atleta/30 bg-atleta/5 space-y-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-atleta/70">
                              Ejemplo con datos reales — copia y pega en tu terminal
                            </p>
                            <code className="block text-[11px] font-mono text-white bg-slate-950 p-3 rounded-lg border border-atleta/10 whitespace-pre-wrap break-all leading-loose select-all cursor-text">
                              {`curl -w "\\nTiempo: %{time_total}s\\n" -o /dev/null -s ${status.url}`}
                            </code>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-atleta/10">
                              <span className="text-[9px] font-mono text-slate-500">Diagnosta midió:</span>
                              <span className="text-sm font-black text-atleta">{status.latency_ms}ms</span>
                              <span className="text-[9px] font-mono text-slate-600">— ¿obtienes un resultado similar?</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-2xl opacity-30">
                  <Clock className="h-8 w-8 mx-auto mb-3 animate-spin text-atleta" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Sincronizando IA...</p>
                </div>
              )}
            </div>
          </Section>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <ClinicalBadge text={epi?.evidence_captured ? "Payload verificado" : "Auditoría activa"} variant="atleta" />
            <ClinicalBadge text={`Tendencia ${epi?.trend || 'ESTABLE'}`} variant="atleta" />
            <ClinicalBadge text={`${epi?.fallos_recientes ?? 0} fallos recientes`} variant={epi?.fallos_recientes > 0 ? "uci" : "gray"} />
            <ClinicalBadge text={`${epi?.uptime_score || "100%"} uptime`} variant="gray" />
            <ClinicalBadge text={`Patrón ${ia?.analisis_tecnico?.patron_historico || "INTERMITENTE"}`} variant="gray" />
            {epi?.trend_status === 'CRITICAL' && <ClinicalBadge text="ESTADO CRÍTICO" variant="uci" />}
            {epi?.trend_status === 'WARNING' && <ClinicalBadge text="ADVERTENCIA" variant="amber" />}
          </div>

          {/* BLOQUE PDF */}
          <div className={cn(
            "rounded-2xl border transition-all duration-300",
            protocoloLargo ? "border-atleta/20 bg-atleta/5 p-5" : "border-atleta/30 bg-atleta/5 p-8"
          )}>
            {/* Preview del PDF */}
            <div className={cn(
              "mb-4 rounded-xl border border-atleta/20 bg-slate-950 overflow-hidden",
              protocoloLargo ? "h-24" : "h-40"
            )}>
              <div className="p-2.5 border-b border-atleta/10 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500/60" />
                <div className="h-2 w-2 rounded-full bg-amber-500/60" />
                <div className="h-2 w-2 rounded-full bg-atleta/60" />
                <span className="text-[8px] font-mono text-slate-600 ml-2">
                  diagnosta-{status.name?.replace(/\s+/g, '-')}.pdf
                </span>
              </div>
              <div className="p-3 space-y-1.5">
                <div className="h-2 w-3/4 bg-atleta/20 rounded" />
                <div className="h-1.5 w-full bg-white/5 rounded" />
                <div className="h-1.5 w-5/6 bg-white/5 rounded" />
                {!protocoloLargo && (
                  <>
                    <div className="h-1.5 w-full bg-white/5 rounded" />
                    <div className="h-1.5 w-4/5 bg-white/5 rounded" />
                    <div className="h-2 w-1/2 bg-atleta/10 rounded mt-2" />
                    <div className="h-1.5 w-full bg-white/5 rounded" />
                    <div className="h-1.5 w-3/4 bg-white/5 rounded" />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-atleta/60">Expediente Forense</p>
                <p className={cn("font-black text-atleta truncate", protocoloLargo ? "text-sm" : "text-base")}>
                  Descargar PDF
                </p>
                <p className="text-[9px] font-mono text-slate-500 truncate">
                  {status.name} · Dr. Grilo · {new Date().toLocaleDateString('es-ES')}
                </p>
              </div>
              <button
                onClick={exportPDF}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl
                           border border-atleta/40 bg-atleta/10
                           hover:bg-atleta/20 active:scale-95
                           transition-all duration-200"
              >
                <FileDown className="h-4 w-4 text-atleta" />
                <span className="text-[10px] font-black uppercase tracking-widest text-atleta">
                  Exportar
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs font-mono font-black uppercase tracking-[0.15em] text-slate-400">
          {ia?.firma || "DR. GRILO · PROTOCOLO LOCAL"}
        </p>
        <div className="px-4 py-1.5 bg-slate-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-3">
          <span>PROVEEDOR IA: {status.ai_provider || "GEMINI_AI_N8N"}</span>
          <div className="h-1.5 w-1.5 rounded-full bg-atleta shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="h-3 w-px bg-atleta" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function StatRow({ label, value, highlight = false, last = false }: any) {
  return (
    <div className={cn("flex justify-between items-start gap-4 py-2.5", !last && "border-b border-white/5")}>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0 pt-0.5">{label}</span>
      <span className={cn("text-xs font-bold text-right leading-snug max-w-[55%]", highlight ? "text-atleta" : "text-white/80")}>
        {value}
      </span>
    </div>
  )
}

function TechnicalField({ label, value, highlight = false }: any) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-white/5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0 pt-0.5">{label}</span>
      <span className={cn("text-xs font-bold text-right leading-snug max-w-[60%]", highlight ? "text-uci" : "text-white/80")}>
        {value}
      </span>
    </div>
  )
}

function InfoField({ label, value, highlight = false, positive = false }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className={cn("text-[10px] font-black uppercase tracking-widest", highlight ? "text-red-400" : positive ? "text-atleta" : "text-white/80")}>
        {value}
      </span>
    </div>
  )
}

function BadgeHeader({ icon, label, value, highlight = false }: any) {
  return (
    <div className="flex items-center gap-2 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5">
      <span className="text-atleta/70">{icon}</span>
      <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest", highlight ? "text-atleta" : "text-slate-300")}>
        {label}: <span className="text-white ml-0.5">{value}</span>
      </span>
    </div>
  )
}
