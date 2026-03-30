import { useState, useEffect } from "react"

/**
 * MOTOR DE AYUDA GLOBAL (DR. GRILO)
 * Gestiona la visibilidad de los tooltips informativos en todo el dashboard.
 */
export function useHelpEnabled() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('diagnosta_help_enabled') !== 'false'
  })

  useEffect(() => {
    const handler = (e: any) => setEnabled(e.detail.enabled)
    window.addEventListener('diagnosta:help:toggle', handler as EventListener)
    return () => window.removeEventListener('diagnosta:help:toggle', handler as EventListener)
  }, [])

  return enabled
}

/**
 * Disparador global para activar/desactivar la ayuda desde cualquier componente.
 */
export function toggleHelp(value: boolean) {
  localStorage.setItem('diagnosta_help_enabled', String(value))
  window.dispatchEvent(new CustomEvent('diagnosta:help:toggle', { detail: { enabled: value } }))
}
