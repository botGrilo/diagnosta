"use client"
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

export function NeuralConsole({ entries }: { entries?: Array<{ time: string; speaker: string; speakerType: "diagnosta" | "ia" | "consejo"; icon: string; message: string }> }) {
  const DEFAULT_ENTRIES = [
    { time: "11:20 AM", speaker: "Diagnosta", speakerType: "diagnosta" as const, icon: "🛡️", message: "Detectada latencia inusual en el nodo Barcelona." },
    { time: "11:21 AM", speaker: "IA",        speakerType: "ia"        as const, icon: "🧠", message: "Analizando trazas... El retraso se debe a una consulta SQL sin índice en la tabla 'orders'." },
    { time: "11:22 AM", speaker: "Consejo",   speakerType: "consejo"   as const, icon: "💡", message: "Ejecute 'CREATE INDEX idx_orders_date ON orders(created_at)' para reducir la carga un 40%." },
  ];
  
  const currentEntries = entries || DEFAULT_ENTRIES;

  const SPEAKER_COLORS = {
    diagnosta: "text-emerald-400",
    ia:        "text-sky-400",
    consejo:   "text-amber-400",
  };

  function ConsoleLine({ time, speaker, speakerType, icon, message }: typeof DEFAULT_ENTRIES[0]) {
    return (
      <div className="flex items-baseline gap-2 leading-relaxed">
        <span className="inline-block shrink-0 text-[10px] font-mono font-medium bg-emerald-400/10 text-emerald-300/70 border border-emerald-400/20 px-1.5 py-0.5 rounded">
          {time}
        </span>
        <span className={`font-semibold font-mono shrink-0 ${SPEAKER_COLORS[speakerType]}`}>{icon} {speaker}:</span>
        <span className="text-slate-400 font-mono text-sm">{message}</span>
      </div>
    );
  }

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= currentEntries.length) return;
    const timer = setTimeout(
      () => setVisibleCount((c) => c + 1),
      visibleCount === 0 ? 800 : 1500
    );
    return () => clearTimeout(timer);
  }, [visibleCount, currentEntries.length]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <Brain className="text-cyan-500 h-5 w-5 shrink-0" />
        <h2 className="text-foreground font-semibold text-sm uppercase tracking-widest">
          Consola Neuronal de Diagnóstico
        </h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          LIVE
        </span>
      </div>
      <div className="bg-slate-950 rounded-lg p-4 overflow-hidden flex flex-col gap-3 min-h-[160px]">
        {currentEntries.slice(0, visibleCount).map((entry, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ConsoleLine {...entry} />
          </div>
        ))}
        {visibleCount < currentEntries.length && (
          <span className="animate-pulse text-cyan-400">▋</span>
        )}
      </div>
    </div>
  );
}
