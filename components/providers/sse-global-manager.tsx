"use client"
import { useEffect, useRef } from "react"
import { useDiagnostaStore } from "@/lib/store/diagnosta-store"

/**
 * SSE GLOBAL MANAGER (Reconexión Automática Dr. Grilo)
 * 
 * Mantiene el túnel SSE abierto con n8n permanentemente. 
 * Implementa reintento manual ante colisiones de red o reinicios de servidor.
 */
export function SSEGlobalManager() {
  const addDiagnostico = useDiagnostaStore(s => s.addDiagnostico)
  const setAnalyzing = useDiagnostaStore(s => s.setAnalyzing)
  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const connect = () => {
       // Limpieza preventiva
       if (eventSourceRef.current) {
         eventSourceRef.current.close()
       }

       console.log("🌐 DR_GRILO_NUCLEO — Estableciendo conexión maestra SSE...");
       const es = new EventSource('/api/diagnostico-push')
       eventSourceRef.current = es

           es.addEventListener('message', (event) => {
             try {
               const payload = JSON.parse(event.data)
               
               // [AUDITORÍA] Rayos X del Socio — Ver estructura real de red
               console.log("📦 SSE_PAYLOAD_FULL:", JSON.stringify(payload).substring(0, 500));

               if (payload.type === 'CONNECTED') {
                 console.log("🔌 CONEXIÓN_ESTABLECIDA — ID_GRILO:", payload.id);
                 setAnalyzing(false)
               }

               if (payload.type === 'DIAGNOSTICO_NEW') {
                const rawData = payload.data
                
                // [FIX] n8n envía items como array [{...}] — normalizamos a objeto único
                const diagnostico = Array.isArray(rawData) ? rawData[0] : rawData;

                if (!diagnostico) {
                    console.warn("⚠️ SSE_VACÍO — n8n envió un paquete sin diagnóstico válido.");
                    return;
                }

                const nodeId = diagnostico.epidemiology_report?.node_id || diagnostico.node_id || diagnostico.id
                const incomingJobId = diagnostico.job_id || diagnostico.jobId
                const currentJobId = useDiagnostaStore.getState().currentJobId

                // [LOG] Comparación de ADN de JobID
                console.log("🔍 JOB_MATCH_DEBUG:", {
                  recibido: incomingJobId,
                  esperado: currentJobId,
                  nodeId: nodeId,
                  coincide: incomingJobId === currentJobId
                });

                // REGLA DE PRIVACIDAD DR. GRILO (LIMITADA DURANTE DEBUG):
                // Aceptamos el diagnóstico incluso con mismatch de JobID para validación visual
                const isMyJob = incomingJobId && incomingJobId === currentJobId
                const isGlobal = !incomingJobId || diagnostico.is_system

                if (!isMyJob && !isGlobal) {
                   console.warn("🔒 JOB_MATCH_FAIL — Identidad inconsistente pero aceptando por modo DEBUG.");
                }

                if (nodeId) {
                  console.log(`🩺 DIAGNÓSTICO_VÁLIDO — Nodo: ${nodeId} (INYECTANDO...)`);
                  addDiagnostico(nodeId, diagnostico)
                }
              }
             } catch (err) {
               console.error("❌ ERROR_TRAMA_DR_GRILO - Payload inválido.", err)
             }
           })

       es.onerror = () => {
         console.warn("⚠️ COLISIÓN_EVENTO - El núcleo no responde. Reintentando en 3s...");
         es.close()
         eventSourceRef.current = null
         
         // REINTENTO AUTOMÁTICO DR. GRILO
         if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
         retryTimeoutRef.current = setTimeout(connect, 3000)
       }
    }

    connect()

    return () => {
      console.log("🔌 DESCONEXIÓN_PREVENTIVA — Cerrando flujo maestro.");
      if (eventSourceRef.current) eventSourceRef.current.close()
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
  }, [addDiagnostico, setAnalyzing])

  return null
}
