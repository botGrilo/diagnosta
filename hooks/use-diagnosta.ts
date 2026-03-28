"use client";

import { useCallback } from 'react';
import { useDiagnostaStore } from '@/lib/store/diagnosta-store';

/**
 * HOOK useDiagnosta: EL CONSUMIDOR DE EVENTOS SRE
 * 
 * Este hook ya NO abre conexiones SSE locales. Ahora solo consume el store 
 * centralizado actualizado por el SSEGlobalManager y dispara los análisis.
 */
export function useDiagnosta(endpoints: any[]) {
  const { 
    diagnosticos, 
    isAnalyzing, 
    setJobId, 
    setAnalyzing
  } = useDiagnostaStore();

  // ── TRIGGER (DISPARO PROXY FIRMADO HACIA N8N) ──────────
  /**
   * Captura el estado actual del dashboard y lo envía a n8n para diagnóstico clínico.
   */
  const triggerAnalysis = useCallback(async () => {
    if (!endpoints || endpoints.length === 0) return;
    
    setAnalyzing(true);
    try {
      console.log("⚡ INICIANDO_TRIAJE_IA — Generando snapshot de telemetría...");
      
      const snapshots = endpoints.map(ep => ({
        id: ep.id,
        name: ep.name,
        vital_signs: {
          status_code: ep.is_success !== false ? 200 : 500,
          latency_ms: ep.latency_ms || 0,
          response_preview: ep.response_preview || null
        }
      }));

      const res = await fetch('/api/trigger-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshots })
      });

      const result = await res.json();
      if (result.job_id) {
        setJobId(result.job_id);
        console.log(`📡 TRACE_GENERADO — ID: ${result.job_id}`);
      }
      
    } catch (err) {
      console.error('Trigger fallido:', err);
    } finally {
      // Delay visual para evitar spam del botón
      setTimeout(() => setAnalyzing(false), 2000);
    }
  }, [endpoints, setJobId, setAnalyzing]);

  return { 
    diagnosticos, 
    isAnalyzing, 
    triggerAnalysis 
  };
}
