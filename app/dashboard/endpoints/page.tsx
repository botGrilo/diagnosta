import { redirect } from 'next/navigation'

/**
 * SALA DE CONTROL — Redirigida al Dashboard Principal
 * La gestión de endpoints está consolidada en /dashboard con el RegistrationSheet.
 * Esta ruta se mantiene por compatibilidad de URLs pero redirige inmediatamente.
 */
export default function EndpointsPage() {
  redirect('/dashboard')
}
