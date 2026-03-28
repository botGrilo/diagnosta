"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import { ShieldAlert, AlertTriangle } from 'lucide-react'

export function ClinicalRecipeCard({ children, is_critical = false }: { children: React.ReactNode, is_critical?: boolean }) {
  return (
    <div className={cn(
      "relative overflow-hidden transition-all duration-700 h-full flex flex-col",
      "bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem]",
      "shadow-sm hover:shadow-2xl hover:bg-card/60 hover:scale-[1.02] group",
      is_critical && "border-red-500/40 bg-red-500/[0.04] shadow-[0_0_60px_rgba(239,68,68,0.08)]"
    )}>
      
      {/* 🚩 BANNER SUPERIOR: INTERVENCIÓN REQUERIDA (UCI) */}
      {is_critical && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-8 py-4 flex items-center justify-center gap-3">
          <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 text-center leading-relaxed">
            Intervención requerida — fallo total de conectividad
          </span>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
          {children}
      </div>

      {/* 🚩 BANNER INFERIOR: ESTADO DE ALERTA */}
      {is_critical && (
        <div className="bg-red-500/10 border-t border-red-500/20 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Alerta activa</span>
          </div>
          <span className="text-[9px] font-mono text-red-500/50 uppercase">Protocolo UCI-01</span>
        </div>
      )}

      {/* Línea de pulso decorativa */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-0 transition-all duration-1000",
        is_critical ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "bg-primary shadow-[0_0_15px_rgba(45,212,191,0.8)]",
        "group-hover:w-full"
      )} />
    </div>
  )
}
