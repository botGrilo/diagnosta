"use client";

import { useCallback } from 'react';
import { useDiagnostaStore } from '@/lib/store/diagnosta-store';

/**
 * HOOK useDiagnosta: EL CONSUMIDOR DE EVENTOS DR. GRILO (vSRE)
 */
export function useDiagnosta(endpoints: any[]) {
  const { 
    diagnosticos, 
    isAnalyzing, 
  } = useDiagnostaStore();
  const setAnalyzing = useDiagnostaStore(s => s.setAnalyzing)
  const setCurrentJobId = useDiagnostaStore(s => s.setCurrentJobId)
  const setLastSnapshotAt = useDiagnostaStore(s => s.setLastSnapshotAt)

  /**
   * Disparador SRE: Envía el snapshot a n8n para análisis
   */
  const triggerAnalysis = useCallback(async (customEndpoints?: any[], dbTimestamp?: string) => {
    const targetData = customEndpoints || endpoints
    if (!targetData || targetData.length === 0) return

    setAnalyzing(true)
    // El JobID ahora se sincroniza DESPUÉS de recibir la respuesta del servidor seguro


    // Búsqueda del último timestamp real registrado en base de datos de todo el set
    let latestDBCheck = dbTimestamp;
    
    if (!latestDBCheck) {
       // Escaneamos el set de datos en busca del check más reciente
       targetData.forEach(ep => {
          const checkAt = ep.lastCheckedAt || ep.checkedAt || ep.checked_at;
          if (checkAt && (!latestDBCheck || new Date(checkAt) > new Date(latestDBCheck))) {
             latestDBCheck = checkAt;
          }
       });
    }

    const finalTimestamp = latestDBCheck || new Date().toISOString()
    
    // Formateado humano unificado para toda la plataforma (vía Socio Goyo)
    const formatted = new Date(finalTimestamp).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
    
    setLastSnapshotAt(formatted)

    console.log(`⚡ INICIANDO_TRIAJE_IA — Negociando ID con el servidor seguro... — Snapshot Real: ${formatted}`);

    try {
      const snapshots = targetData.map(ep => ({
        id: ep.id,
        name: ep.name,
        vital_signs: {
          status_code: ep.statusCode || ep.status_code || (ep.isSuccess !== false ? 200 : 500),
          latency_ms: ep.latencyMs || ep.latency_ms || 0,
          response_preview: ep.response_preview || null
        }
      }));

      const response = await fetch('/api/trigger-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          snapshots,
          timestamp: finalTimestamp 
        })
      });

      if (!response.ok) throw new Error("Error en trigger-analysis");

      const { job_id: serverJobId } = await response.json();
      
      // Muy importante: Sincronizar con el ID real del servidor para que el SSE coincida
      setCurrentJobId(serverJobId);
      
      console.log(`📡 TRACE_SRE_OK (Data Lineage: DB_TIME_LATEST) — ServerJobID: ${serverJobId}`);
      
    } catch (err) {
      console.error('❌ TRIGGER_SRE_FALLIDO:', err);
    } finally {
      setTimeout(() => setAnalyzing(false), 2000);
    }
  }, [endpoints, setAnalyzing, setCurrentJobId, setLastSnapshotAt]);

  return { 
    diagnosticos, 
    isAnalyzing, 
    triggerAnalysis 
  };
}
