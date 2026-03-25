"use client";

import useSWR from "swr";
import { Trash2, Eye, EyeOff, Loader2, Globe, MoreVertical } from "lucide-react";
import { deleteEndpoint } from "@/actions/endpoint-actions";
import type { EndpointSummary } from "@/types/diagnosta";
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
    <section>
      {isLoading ? (
        <div className="bg-card border border-border rounded-2xl h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground w-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          <p>Reuniendo métricas forenses...</p>
        </div>
      ) : endpoints?.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No hay APIs registradas</h3>
          <p className="text-sm text-muted-foreground mt-1">Registra tu primer monitor usando el formulario de la izquierda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {endpoints?.map((ep: EndpointSummary) => {
            const statusColor = ep.isSuccess === false ? "status-dot-down" 
                              : (ep.latencyMs && ep.latencyMs > 2000) ? "status-dot-degraded" 
                              : ep.statusCode ? "status-dot-ok" : "bg-muted";

            return (
              <div key={ep.id} className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusColor}`} />
                  
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{ep.name}</h4>
                    <p className="text-xs text-muted-foreground truncate opacity-80 mt-0.5 max-w-[200px] sm:max-w-sm">{ep.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 pl-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-1 bg-secondary text-secondary-foreground rounded-md uppercase tracking-wide">
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-secondary text-secondary-foreground rounded-md opacity-80">
                      {ep.checkIntervalMin}m
                    </span>
                    {ep.isPublic ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground opacity-50" />
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                        onClick={() => handleDelete(ep.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Monitor
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
