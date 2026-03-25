import Link from "next/link";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | Diagnosta",
  description: "Aviso Legal del proyecto Diagnosta.",
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-prose mx-auto py-20 px-6 font-sans">
        {/* Cabecera */}
        <header className="mb-10 border-b border-border pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Información Legal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Aviso Legal
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Última actualización: 22 de marzo de 2026
          </p>
        </header>

        {/* Contenido */}
        <div className="space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Identidad del titular
            </h2>
            <p className="text-sm text-muted-foreground">
              Deacuerdo a la Ley de Hackatón, el titular de Diagnosta de momento es el guardián.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
