"use client"

import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { Shield, Activity } from 'lucide-react'
import { RedGlobal } from '@/components/dashboard/red-global'
import { ClinicalStatusView } from '@/components/dashboard/clinical/clinical-status-view'
import { useDiagnosta } from '@/hooks/use-diagnosta'
/* 
  NOTA:
  He re-ingenierizado el Orquestador. Ahora soporta el 'Modo Congelado'. 
  Al iniciar el análisis, ignoramos la data viva de SWR para que el diagnóstico 
  Pura consistencia técnica SRE.
*/
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function GlobalStatusPage() {
  const { data: endpoints, error, isLoading, mutate } = useSWR('/api/status', fetcher, { 
    refreshInterval: 10000,
    shouldRetryOnError: true,
    errorRetryCount: 3
  })
  
  // VÁLVULA DE SEGURIDAD SRE: Timeout Visual (10s)
  const [showTimeout, setShowTimeout] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!endpoints && !error) setShowTimeout(true)
    }, 10000)
    return () => clearTimeout(timer)
  }, [endpoints, error])

  const [selectedEndpoint, setSelectedEndpoint] = useState<any | null>(null)
  
  // MOTOR FORENSE SSE (Unificado)
  const { diagnosticos, isAnalyzing } = useDiagnosta(endpoints || [])

  // EL CEREBRO: Mapeamos los datos en tiempo real
  const displayData = useMemo(() => {
    if (!endpoints) return []
    return endpoints.map((ep: any) => ({
      ...ep,
      ...(diagnosticos[ep.id] || {}) // Inyectamos diagnóstico IA si existe
    }))
  }, [endpoints, diagnosticos])

  // SONDA DE GUERRA: Verificamos en consola la data real de n8n
  useEffect(() => {
    if (Object.keys(diagnosticos).length > 0) {
      console.log("🩺 TRIAJE_LABORATORIO_SRE (Auditoría Global) — Snapshot:", new Date().toLocaleTimeString());
      console.table(Object.entries(diagnosticos).map(([id, data]: any) => ({
        Nodo_ID: id.slice(0, 8) + "...",
        Gravedad: data.ia_recipe?.resumen_clinico?.gravedad || "N/A",
        Tendencia: data.ia_recipe?.analisis_tecnico?.tendencia || "CONEXIÓN_PURA",
        Diagnostico: data.ia_recipe?.resumen_clinico?.titulo_diagnostico || "Escaneando..."
      })));
    }
  }, [diagnosticos])

  // Obtener fecha del snapshot (la primera que encuentre)
  const snapshotDate = endpoints?.[0]?.checked_at ? new Date(endpoints[0].checked_at).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }) : "SIN_CAPTURA_ACTIVA";

  return (
    <div className="min-h-screen bg-[#020817] text-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER QUIRÚRGICO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter italic">
              RED <span className="text-atleta">GLOBAL</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em]">
              Monitorización Forense Activa
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-right">
             <div className="px-4 py-2 bg-atleta/5 border border-atleta/10 rounded-2xl flex items-center gap-3">
                <Shield className="h-4 w-4 text-atleta" />
                <div className="flex flex-col text-left">
                   <span className="text-[9px] font-black uppercase tracking-widest text-atleta">Triaje de Laboratorio (SRE)</span>
                   <span className="text-[11px] font-mono font-bold text-foreground">Snapshot: {snapshotDate}</span>
                </div>
             </div>
             <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest px-2 italic">
               *Propagación Asíncrona Garantizada (FIFO)
             </p>
          </div>
        </header>

        {/* REJILLA DE NODOS CLÍNICOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {displayData?.map((endpoint: any) => (
            <ClinicalStatusView 
              key={endpoint.id} 
              status={endpoint}
              isLoadingAi={isAnalyzing && !diagnosticos[endpoint.id]}
            />
          ))}

          {/* ESTADOS DE CARGA / ERROR SRE */}
          {(!endpoints && !error && !showTimeout) && (
             <div className="col-span-full py-20 text-center space-y-4 animate-in fade-in duration-500">
                <div className="animate-spin h-10 w-10 border-4 border-atleta border-t-transparent rounded-full mx-auto shadow-[0_0_20px_rgba(45,212,191,0.2)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                   Sincronizando con el Núcleo SRE...
                </p>
             </div>
          )}

          {(error || showTimeout) && !endpoints && (
             <div className="col-span-full py-20 text-center space-y-6 border-2 border-dashed border-uci/10 rounded-[3rem] bg-uci/[0.02]">
                <div className="h-16 w-16 bg-uci/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Activity className="h-8 w-8 text-uci animate-pulse" />
                </div>
                <div className="space-y-2">
                   <p className="text-xl font-black uppercase tracking-widest text-uci italic">Colisión del Núcleo</p>
                   <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] max-w-xs mx-auto">
                      {error ? "Fallo en la comunicación con la API de estatus (500/Red)." : "Tiempo de respuesta del servidor agotado (Timeout)."}
                   </p>
                </div>
                <button 
                  onClick={() => mutate()}
                  className="px-8 py-3 bg-white text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-atleta hover:text-white transition-all scale-100 hover:scale-105 active:scale-95"
                >
                   Reintentar Conexión
                </button>
             </div>
          )}
        </div>

        {/* FOOTER DE ESTADO */}
        <footer className="pt-20 border-t border-white/5 flex justify-between items-center opacity-30 hover:opacity-100 transition-opacity">
          <p className="text-[9px] font-mono font-black uppercase tracking-[0.2em]">Protocolo Diagnosta v4.0 SRE</p>
          <div className="h-px bg-white/10 flex-1 mx-8" />
          <p className="text-[9px] font-black tracking-widest uppercase">Nodo: CENTRAL_DOCKER</p>
        </footer>
      </div>
    </div>
  )
}
