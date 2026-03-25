"use client";

import useSWR from "swr";
import { Activity, Zap, Terminal  } from "lucide-react";

import type { EndpointSummary } from "@/types/diagnosta";

import { MonitorCard, MonitorCardSkeleton } from "@/components/dashboard/monitor-card";
import { NeuralConsole } from "@/components/dashboard/neural-console";

function UptimeChart() {
  const points = "0,60 40,55 80,58 120,50 160,52 200,48 240,53 280,49 320,51 360,47 400,50";
  return (
    <svg viewBox="0 0 400 80" className="w-full h-16 mt-3" preserveAspectRatio="none">
      <defs>
        <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="oklch(0.75 0.18 155)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.75 0.18 155)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,60 ${points} 400,60 400,80 0,80`} fill="url(#uptimeGradient)" />
      <polyline points={points} fill="none" stroke="oklch(0.75 0.18 155)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage() {
  const { data: endpoints } = useSWR("/api/endpoints", fetcher, { refreshInterval: 30000 });

  let nominales = 0;
  let degradados = 0;
  let caidos = 0;

  if (endpoints?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    endpoints.forEach((ep: any) => {
      if (ep.isSuccess === false) caidos++;
      else if (ep.latencyMs && ep.latencyMs > 2000) degradados++;
      else if (ep.statusCode) nominales++;
    });
  }
  const topEndpoints = endpoints?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full px-6 py-8">

        
      

        {/* ── HERO CARD: Uptime Global ─────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-7 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium text-foreground/60 mb-1">Estado Global del Sistema</p>
              <p className="text-6xl font-bold tracking-tight leading-none tabular-nums text-foreground">99.98%</p>
              
              <div className="flex items-center gap-2 mt-3 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {nominales} Nominales
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {degradados} Degradados
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> {caidos} Caídos
                </span>
              </div>

              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mt-2">↑ Uptime Global — últimos 30 días</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-xs font-mono">Tiempo Real</span>
            </div>
          </div>
          <UptimeChart />
        </div>

        {/* ── GRID DE MONITORES ───────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Monitores de Servicio</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {topEndpoints.length === 0
               ? Array(3).fill(0).map((_, i) => (
                   <MonitorCardSkeleton key={i} />
                 ))
               : topEndpoints.map((ep: EndpointSummary) => (
                   <MonitorCard key={ep.id} ep={ep} />
                 ))
             }
           </div>


        </section>

        {/* ── CONSOLA NEURONAL ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Análisis en Progreso</h2>
          </div>
          <NeuralConsole />
        </section>

      </div>

      
    </div>
  );
}
