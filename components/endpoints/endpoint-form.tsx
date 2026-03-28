"use client";

import { useState } from "react";
import { Plus, Loader2, Globe, Activity, ShieldCheck, Zap } from "lucide-react";
import { createEndpoint } from "@/actions/endpoint-actions";
import { useSWRConfig } from "swr";
import { cn } from "@/lib/utils";

export function EndpointForm() {
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSuccessToast(null);

    const fd = new FormData(e.currentTarget);
    const result = await createEndpoint(fd);
    
    if (result.error) {
      setFormError(result.error);
    } else {
      setSuccessToast("API registrada. El Guardián ya la está vigilando.");
      (e.target as HTMLFormElement).reset();
      mutate("/api/endpoints"); 
      setTimeout(() => setSuccessToast(null), 4000);
    }
    setIsSubmitting(false);
  }

  return (
    <section className="h-fit sticky top-24 animate-in fade-in slide-in-from-left duration-700">
      <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group/form">
        
        {/* Glow de fondo decorativo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover/form:bg-primary/20 transition-all duration-700" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3 text-foreground">
              <Zap className="h-6 w-6 text-primary animate-pulse" /> Registro de Nodo
            </h2>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              Configuración de Telemetría Capa 7
            </p>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.25em] ml-1">Identificador del Servicio</label>
              <input 
                name="name" 
                required 
                placeholder="EJ: API PAGOS PROD" 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all shadow-inner" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary uppercase tracking-[0.25em] ml-1">Punto de Enlace (URL)</label>
              <div className="relative group/input">
                 <input 
                  name="url" 
                  type="url" 
                  required 
                  placeholder="https://api.tu-dominio.com/v1" 
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all shadow-inner" 
                />
                <Globe className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/20 group-focus-within/input:text-primary transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.25em] ml-1">Método</label>
                <select name="method" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer">
                  <option value="GET">GET (PULSO)</option>
                  <option value="POST">POST</option>
                  <option value="HEAD">HEAD</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.25em] ml-1">Ritmo</label>
                <select name="check_interval_min" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer">
                  <option value="1">1 MIN (CRÍTICO)</option>
                  <option value="5">5 MIN (ESTÁNDAR)</option>
                  <option value="15">15 MIN</option>
                  <option value="30">30 MIN</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 p-5 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group/opt">
              <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-focus-within/opt:bg-primary transition-colors" />
              <label className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.25em]">Verificación de Keyword (Opcional)</label>
              <input 
                name="keyword_check" 
                placeholder='"status":"ok"' 
                className="w-full bg-transparent border-none p-0 text-sm font-bold placeholder:text-muted-foreground/20 focus:ring-0" 
              />
              <p className="text-[10px] text-muted-foreground/30 italic leading-snug">
                Análisis profundo: Valida que esten las palabras clave en el body.
              </p>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group/check relative">
              <input 
                type="checkbox" 
                name="is_public" 
                id="is_public" 
                value="true" 
                className="peer hidden" 
              />
              <div className="h-6 w-6 rounded-lg border-2 border-white/10 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-all">
                 <ShieldCheck className="h-4 w-4 text-background opacity-0 peer-checked:opacity-100" />
              </div>
              <label htmlFor="is_public" className="flex-1 space-y-1 cursor-pointer select-none">
                <p className="text-sm font-black italic tracking-tight text-foreground/80 group-hover/check:text-primary transition-colors">Modo Status Pública</p>
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest leading-tight">
                  Visible sin login para tus clientes
                </p>
              </label>
              <label htmlFor="is_public" className="absolute inset-0 cursor-pointer" />
            </div>

            {formError && (
              <div className="p-4 rounded-2xl bg-uci/10 border border-uci/20 text-uci text-xs font-black uppercase tracking-widest text-center animate-bounce">
                ❌ {formError}
              </div>
            )}
            {successToast && (
              <div className="p-4 rounded-2xl bg-atleta/10 border border-atleta/20 text-atleta text-xs font-black uppercase tracking-widest text-center animate-in zoom-in-95">
                ✅ {successToast}
              </div>
            )}

            <button 
              disabled={isSubmitting} 
              type="submit" 
              className={cn(
                "w-full group/btn relative h-14 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all overflow-hidden active:scale-95 disabled:opacity-50",
                "bg-primary text-background shadow-[0_0_30px_rgba(45,212,191,0.2)] hover:shadow-primary/40"
              )}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Activity className="h-4 w-4" />
                    Iniciar Vigilancia
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
