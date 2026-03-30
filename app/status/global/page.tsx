"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { Shield, Activity } from 'lucide-react'
import { ClinicalStatusView } from '@/components/dashboard/clinical/clinical-status-view'
import { useDiagnosta } from '@/hooks/use-diagnosta'
import { useDiagnostaStore } from '@/lib/store/diagnosta-store'

/**
 * SALA DE CONSTANTES VITALES (RED GLOBAL) - CLINICAL EDITION
 */
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function GlobalStatusPage() {
  // REGLA SRE: RONDA MÉDICA CADA 5 MINUTOS (300000ms)
  const { data: endpoints, error, isLoading, mutate } = useSWR('/api/status', fetcher, { 
    refreshInterval: 300000,
    shouldRetryOnError: true,
  })
  
  const [showTimeout, setShowTimeout] = useState(false)
  const { diagnosticos, isAnalyzing, triggerAnalysis } = useDiagnosta(endpoints || [])
  const setAnalyzing = useDiagnostaStore(s => s.setAnalyzing)
  const addDiagnostico = useDiagnostaStore(s => s.addDiagnostico)
  
  const hasTriggeredRef = useRef<string | null>(null);

  // LÓGICA DE TIEMPO FORENSE: Hallamos la identidad de la radiografía (MAX checked_at)
  const snapshotRaw = useMemo(() => {
    if (!endpoints || endpoints.length === 0) return null;
    console.log("endpoints:", endpoints)
    let latest: Date | null = null;
    
    endpoints.forEach((ep: any) => {
      const check = ep.checked_at || ep.lastCheckedAt;
      if (check) {
        const d = new Date(check);
        if (!latest || d > latest) latest = d;
      }
    });

    return latest ? (latest as Date).toISOString() : null;
  }, [endpoints]);

  const snapshotDate = useMemo(() => {
    if (!snapshotRaw) return "BUSCANDO_CONSTANTES...";
    return new Date(snapshotRaw).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }, [snapshotRaw]);

  // ARCHIVO DE RADIOGRAFÍAS (LocalStorage Logic - Decisión 3)
  useEffect(() => {
    if (!snapshotRaw || !endpoints) return;

    // REGLA DE ORO — Radiografía Forense
    const snapshotId = snapshotRaw; 
    const storageKey = `drgrilo_diagnosis_${snapshotId}`;
    
    // 1. Verificar si ya existe el diagnóstico en el archivo para ESTA radiografía
    const cached = localStorage.getItem(storageKey);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Inyectamos los diagnósticos guardados en el store global
        Object.entries(parsed).forEach(([nodeId, data]) => {
          addDiagnostico(nodeId, data);
        });
      } catch (e) {
        console.error("Error al leer archivo de radiografías:", e);
      }
    } else {
      // Radiografía nueva — El Dr. Grilo nunca ha visto esta placa
      if (hasTriggeredRef.current !== snapshotId) {
        hasTriggeredRef.current = snapshotId;
        triggerAnalysis(); // Dispara el análisis a n8n
      }
    }

    // 2. Limpieza de radiografías viejas — Solo guardamos la más reciente
    Object.keys(localStorage)
      .filter(k => k.startsWith('drgrilo_diagnosis_') && k !== storageKey)
      .forEach(k => localStorage.removeItem(k));

  }, [snapshotRaw, endpoints, addDiagnostico, triggerAnalysis]);

  // Persistir resultados nuevos en localStorage (Caché de escritura)
  useEffect(() => {
    if (snapshotRaw && Object.keys(diagnosticos).length > 0 && !isAnalyzing) {
      const storageKey = `drgrilo_diagnosis_${snapshotRaw}`;
      localStorage.setItem(storageKey, JSON.stringify(diagnosticos));
    }
  }, [diagnosticos, isAnalyzing, snapshotRaw]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!endpoints && !error) setShowTimeout(true)
    }, 10000)
    return () => clearTimeout(timer)
  }, [endpoints, error])
  
  /* 
  // PREFETCH OPTIMISTA — El Dr. Grilo analiza la previa mientras el usuario observa
  useEffect(() => {
    if (!endpoints || endpoints.length === 0) return;
    
    // Disparar prefetch de todos los endpoints en paralelo
    endpoints.forEach((ep: any) => {
      fetch(`/api/trigger-diagnostico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ep.id, source: 'PREFETCH' })
      }).catch(err => console.error(`Error en prefetch de ${ep.id}:`, err));
    });
  }, [endpoints === undefined]); 
  */
  const displayData = useMemo(() => {
    
    if (!endpoints) return []
    
    return endpoints.map((ep: any) => ({
      ...ep,
      ...(diagnosticos[ep.id] || {}) 
    }))
  }, [endpoints, diagnosticos])
  
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER QUIRÚRGICO - CLINICAL EDITION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter italic">
              RED <span className="text-atleta">GLOBAL</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em]">
              CONSTANTES VITALES DE LA RED — Radiografía en curso
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-right">
             <div className="px-4 py-2 bg-atleta/5 border border-atleta/10 rounded-2xl flex items-center gap-3">
                <Shield className="h-4 w-4 text-atleta" />
                <div className="flex flex-col text-left">
                   <span className="text-xs font-black uppercase tracking-widest text-atleta">RONDA MÉDICA ACTIVA</span>
                   <span className="text-[11px] font-mono font-bold text-foreground">Radiografía: {snapshotDate}</span>
                </div>
             </div>
             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest px-2 italic">
               *Propagación Asíncrona Garantizada (FIFO)
             </p>
          </div>
        </header>

        {/* REJILLA DE CARDS (SALA DE CONSTANTES VITALES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {displayData?.map((endpoint: any) => (
            <ClinicalStatusView 
              key={endpoint.id} 
              status={endpoint}
              isLoadingAi={isAnalyzing && !diagnosticos[endpoint.id]}
              compact={true}
            />
          ))}

          {(!endpoints && !error && !showTimeout) && (
             <div className="col-span-full py-20 text-center space-y-4 animate-in fade-in duration-700">
                <div className="animate-spin h-10 w-10 border-4 border-atleta border-t-transparent rounded-full mx-auto shadow-[0_0_20px_rgba(45,212,191,0.2)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                   Sincronizando constantes vitales...
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

        {/* FOOTER CLÍNICO */}
        <footer className="pt-20 border-t border-white/5 flex justify-between items-center opacity-30 hover:opacity-100 transition-opacity">
          <p className="text-xs font-mono font-black uppercase tracking-[0.2em]">Protocolo Diagnosta v4.0 Clinical Edition</p>
          <div className="h-px bg-white/10 flex-1 mx-8" />
          <p className="text-xs font-black tracking-widest uppercase">Nodo: CENTRAL_DOCKER</p>
        </footer>
      </div>
    </div>
  )
}
