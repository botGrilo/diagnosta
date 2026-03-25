"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createEndpoint } from "@/actions/endpoint-actions";
import { useSWRConfig } from "swr";

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
      mutate("/api/endpoints"); // Revalida en background sin recargar
      setTimeout(() => setSuccessToast(null), 4000);
    }
    setIsSubmitting(false);
  }

  return (
    <section className="h-fit sticky top-24">
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Plus className="h-5 w-5 text-primary" /> Añadir Monitor
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
            <input name="name" required placeholder="API Pagos Producción" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</label>
            <input name="url" type="url" required placeholder="https://api.tuempresa.com/payments" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Método</label>
              <select name="method" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Intervalo</label>
              <select name="check_interval_min" className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
                <option value="1">1 min (Core)</option>
                <option value="5">5 min (Def)</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Extracción de Keyword (opcional)</label>
            <input name="keyword_check" placeholder='"status":"ok"' className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            <p className="text-[11px] text-muted-foreground opacity-80 mt-1 leading-tight">
              Texto que debe aparecer en la respuesta para considerarla exitosa. 
              Si está vacío, solo se valida el código HTTP.
            </p>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input type="checkbox" name="is_public" id="is_public" value="true" className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-ring bg-background cursor-pointer" />
            <div>
              <label htmlFor="is_public" className="text-sm font-medium cursor-pointer select-none">Mostrar en Status Pública</label>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[260px] leading-tight">
                Aparece en tu página pública — sin login, compartible con tus clientes.
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mt-4">
              ❌ {formError}
            </div>
          )}
          {successToast && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm mt-4">
              ✅ {successToast}
            </div>
          )}

          <button disabled={isSubmitting} type="submit" className="w-full mt-6 bg-primary text-primary-foreground font-semibold rounded-lg py-2.5 h-10 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vigilar Endpoint"}
          </button>
        </form>
      </div>
    </section>
  );
}
