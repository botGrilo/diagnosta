"use client";

import useSWR from "swr";
import { Trash2, Eye, EyeOff, Loader2, Globe, MoreVertical, Activity, Terminal } from "lucide-react";
import { deleteEndpoint } from "@/actions/endpoint-actions";
import type { EndpointSummary } from "@/types/diagnosta";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function EndpointList() {
  const { data: endpoints, mutate, isLoading } = useSWR("/api/endpoints", fetcher, { refreshInterval: 60000 });

  async function handleDelete(id: string) {
    if (!confirm("⚠️ ¿Seguro que quieres eliminar esta API? Perderás todo el historial forense.")) return;
    
    // UI Optimista
    mutate(endpoints?.filter((e: EndpointSummary) => e.id !== id), false);
    
    await deleteEndpoint(id);
    mutate(); // Revalida post-backend
  }

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-right duration-700 h-fit">
      
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_currentColor]" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">
               Matriz de vigilancia ({endpoints?.length || 0})
            </h3>
         </div>
         {isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary/50" />}
      </div>

      {isLoading ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] h-96 flex flex-col items-center justify-center gap-6 text-muted-foreground/30 w-full backdrop-blur-md">
          <Activity className="h-10 w-10 animate-pulse text-primary/20" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Sincronizando Nodos...</p>
        </div>
      ) : endpoints?.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-16 text-center backdrop-blur-md space-y-4">
          <Globe className="h-16 w-16 text-muted-foreground mx-auto opacity-10" />
          <div className="space-y-1">
             <h3 className="text-xl font-black italic tracking-tighter text-foreground/40">Silencio Total</h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Sin telemetría activa en este sector.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {endpoints?.map((ep: EndpointSummary) => {
            const isDown = ep.isSuccess === false;
            const isDegraded = ep.latencyMs && ep.latencyMs > 1000;

            return (
              <div 
                key={ep.id} 
                className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-500 shadow-xl overflow-hidden"
              >
                {/* Indicador de Estado SRE (Look de hardware) */}
                <div className={cn(
                  "absolute top-0 left-0 w-1.5 h-full opacity-60 group-hover:opacity-100 transition-opacity",
                  isDown ? "bg-uci" : isDegraded ? "bg-amber-500" : "bg-atleta"
                )} />

                <div className="flex items-center gap-6 min-w-0 flex-1">
                  <div className={cn(
                    "flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.03]",
                    isDown ? "text-uci/60" : "text-atleta/60"
                  )}>
                     <Terminal className="h-5 w-5" />
                  </div>
                  
                  <div className="min-w-0 space-y-1">
                    <h4 className="font-extrabold text-lg text-foreground tracking-tighter group-hover:text-primary transition-colors truncate">
                       {ep.name}
                    </h4>
                    <div className="flex items-center gap-2 opacity-40">
                       <span className="text-[10px] font-mono uppercase font-black tracking-widest">{ep.method}</span>
                       <span className="h-px w-2 bg-white/20" />
                       <span className="text-[10px] font-mono lowercase truncate font-bold">{ep.url}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end bg-white/[0.02] sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-white/5 sm:border-none">
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right flex flex-col items-end">
                       <p className={cn(
                         "text-xl font-black italic tabular-nums leading-none tracking-tight",
                         isDown ? "text-uci" : isDegraded ? "text-amber-500" : "text-atleta"
                       )}>
                          {ep.latencyMs ? `${ep.latencyMs}ms` : '--'}
                       </p>
                       <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/30 mt-1 italic">
                          Ritmo: {ep.checkIntervalMin}m
                       </p>
                    </div>

                    <div className="w-px h-8 bg-white/5 hidden md:block" />

                    {ep.isPublic ? (
                      <div className="flex flex-col items-center gap-1 group/eye cursor-help">
                        <Eye className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-tighter text-primary/40">Visible</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[7px] font-black uppercase tracking-tighter">Oculto</span>
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-10 w-10 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-muted-foreground hover:text-foreground rounded-xl transition-all active:scale-90 outline-none">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#050505] border-white/10 rounded-2xl p-2 min-w-[180px] shadow-2xl">
                      <DropdownMenuItem
                        className="text-uci focus:bg-uci/10 focus:text-uci cursor-pointer p-3 rounded-xl font-bold text-xs uppercase tracking-widest"
                        onClick={() => handleDelete(ep.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Borrar Registro
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
