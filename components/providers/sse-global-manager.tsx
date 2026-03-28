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
           
           if (payload.type === 'CONNECTED') {
             console.log("🔌 CONEXIÓN_ESTABLECIDA — ID_GRILO:", payload.id);
             setAnalyzing(false) // Reset de estado de carga al conectar
           }

           if (payload.type === 'DIAGNOSTICO_NEW') {
            const { data } = payload
            const nodeId = data.epidemiology_report?.node_id || data.node_id
            const incomingJobId = data.job_id
            const currentJobId = useDiagnostaStore.getState().currentJobId

            // REGLA DE PRIVACIDAD DR. GRILO:
            // 1. Permitir si el jobId coincide con el actual
            // 2. Permitir siempre si es un Pilar Global (no tiene user_id o es system)
            const isMyJob = incomingJobId && incomingJobId === currentJobId
            const isGlobal = !incomingJobId || data.is_system

            if (nodeId && (isMyJob || isGlobal)) {
              console.log(`🩺 DIAGNÓSTICO_GRILO_RECIBIDO — Nodo: ${nodeId.slice(0, 10)}... (Evento FIFO)`);
              addDiagnostico(nodeId, data)
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
