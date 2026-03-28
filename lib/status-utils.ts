/**
 * Lógica Central de Triage para Diagnosta
 * Socio Goyo: Aseguramos que el Score de Salud no mienta.
 */

export const STATUS_CONFIG = {
  ATLETA: { label: 'ATLETA \n CONEXIÓN ÓPTIMA', color: 'text-atleta', bg: 'bg-atleta', limit: 300, score: 100 },
  NORMAL: { label: 'NORMAL \n TRÁFICO ESTÁNDAR', color: 'text-normal', bg: 'bg-normal', limit: 600, score: 95 },
  FATIGADO: { label: 'FATIGADO \n DEGRADACIÓN EN RUTA', color: 'text-fatigado', bg: 'bg-fatigado', limit: 1200, score: 70 },
  UCI: { label: 'UCI (CRÍTICO) \n LATENCIA EXTREMA', color: 'text-uci', bg: 'bg-uci', limit: Infinity, score: 40 },
}

export function getStatusDetails(ms: number | null, isSuccess: boolean | null, response: string | null) {
  // PRUEBA DE VIDA: El response_preview garantiza medición real cap. 7 (JSON detectado)
  const isVerified = isSuccess && response && response.trim().length > 10 && response !== "{}";
  if (isSuccess === false || !ms) {
    return { ...STATUS_CONFIG.UCI, label: 'NODO CAÍDO', score: 0, isVerified: false }
  }
  // Triage calibrado según Dossier Técnico
  let baseDetails;
  if (ms < STATUS_CONFIG.ATLETA.limit) baseDetails = STATUS_CONFIG.ATLETA;
  else if (ms < STATUS_CONFIG.NORMAL.limit) baseDetails = STATUS_CONFIG.NORMAL;
  else if (ms < STATUS_CONFIG.FATIGADO.limit) baseDetails = STATUS_CONFIG.FATIGADO;
  else baseDetails = STATUS_CONFIG.UCI;
  return { ...baseDetails, isVerified };
}
