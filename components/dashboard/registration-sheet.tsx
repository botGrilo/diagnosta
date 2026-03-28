"use client"

import { useState, useEffect } from "react"
import { Shield, Loader2, CheckCircle, AlertTriangle, X, Cloud, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface RegistrationSheetProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  endpoint?: any // Endpoint para modo edición
}

export function RegistrationSheet({ isOpen, onClose, onSuccess, endpoint }: RegistrationSheetProps) {
  const isEditing = !!endpoint
  const [formData, setFormData] = useState({ 
    name: "", 
    url: "", 
    method: "GET",
    keyword: ""
  })
  const [validating, setValidating] = useState(false)
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Sincronizar campos cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && endpoint) {
      setFormData({
        name: endpoint.name,
        url: endpoint.url,
        method: endpoint.method,
        keyword: endpoint.keyword_check || ""
      })
      setValidated(true)
      setError(null)
    } else if (isOpen && !endpoint) {
      setFormData({ name: "", url: "", method: "GET", keyword: "" })
      setValidated(false)
      setError(null)
    }
  }, [isOpen, endpoint])

  const handleValidate = async () => {
    if (!formData.url || isEditing) return 
    
    setValidating(true)
    setError(null)
    setValidated(false)

    try {
      const res = await fetch("/api/validate-endpoint", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.url }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Falla de validación")
      } else {
        setValidated(true)
      }
    } catch (err) {
      setError("Error de red")
    } finally {
      setValidating(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validated) return

    setSaving(true)
    try {
      const url = isEditing ? `/api/endpoints/${endpoint.id}` : "/api/endpoints/register"
      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al guardar")
      } else {
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError("Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      <div className={cn(
        "relative w-full max-w-md h-full bg-card border-l border-border/40 shadow-2xl flex flex-col p-8 transition-transform duration-500",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        
        <div className="flex items-center justify-between mb-10">
           <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                 <Shield className="h-4 w-4" />
                 <span>Gestión Dr. Grilo</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground">
                {isEditing ? "Editar Nodo" : "Registrar Nodo"}
              </h2>
           </div>
           <button onClick={onClose} className="h-10 w-10 rounded-full border border-border/40 flex items-center justify-center hover:bg-white/5 transition-colors">
              <X className="h-5 w-5" />
           </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 space-y-8">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Nombre Descriptivo</label>
                 <input 
                   required
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
                   placeholder="Ej: API Producción - Core"
                   value={formData.name}
                   onChange={e => setFormData({ ...formData, name: e.target.value })}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">URL Base (Capa 7)</label>
                 <div className="relative group">
                    <input 
                      required
                      type="url"
                      onBlur={handleValidate}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30 pr-12"
                      placeholder="https://api.tu-infra.com/health"
                      value={formData.url}
                      onChange={e => {
                        setFormData({ ...formData, url: e.target.value })
                        if(!isEditing) { setValidated(false); setError(null); }
                      }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       {validating ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : validated ? <CheckCircle className="h-5 w-5 text-atleta" /> : <Cloud className="h-5 w-5 text-muted-foreground/20" />}
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">
                  Método HTTP
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['GET', 'POST', 'HEAD'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({...formData, method: m})}
                      className={cn(
                        "py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                        formData.method === m 
                          ? "bg-primary text-primary-foreground" 
                           : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Keyword (Opcional)</label>
                 <input 
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
                   placeholder="Ej: success"
                   value={formData.keyword}
                   onChange={e => setFormData({ ...formData, keyword: e.target.value })}
                 />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-center">
                   <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                   <p className="text-[11px] font-bold text-red-400">{error}</p>
                </div>
              )}

              {validated && !isEditing && (
                <div className="p-4 rounded-xl bg-atleta/10 border border-atleta/20 flex gap-3 items-center">
                   <Lock className="h-5 w-5 text-atleta shrink-0" />
                   <div className="space-y-1">
                      <p className="text-[11px] font-bold text-atleta">Nodo Validado y Seguro</p>
                      <p className="text-[10px] font-medium text-atleta/60 leading-relaxed italic">"Diagnosta ha verificado que esta URL es accesible y no representa un riesgo SSRF."</p>
                   </div>
                </div>
              )}
           </div>

           <div className="mt-auto p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] opacity-60">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                 <Sparkles className="h-3.5 w-3.5 text-primary" />
                 Escala Dr. Grilo
              </p>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">
                 "Una vez {isEditing ? "actualizado" : "registrado"}, n8n monitorizará tu nodo para construir tu tendencia epidemiológica histórica."
              </p>
           </div>

           <button 
             type="submit"
             disabled={!validated || saving}
             className={cn(
               "w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm transition-all shadow-xl shadow-primary/5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
               validated ? "bg-primary text-primary-foreground hover:bg-atleta" : "bg-white/10 text-muted-foreground border border-white/5"
             )}
           >
              {saving ? "Procesando..." : isEditing ? "Guardar Cambios" : "Activar Vigilancia Dr. Grilo"}
           </button>
        </form>
      </div>
    </div>
  )
}
