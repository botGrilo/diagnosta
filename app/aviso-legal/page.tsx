import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | Diagnosta",
  description:
    "Información legal sobre el proyecto Diagnosta conforme a la LSSI-CE.",
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-prose mx-auto py-20 px-6 font-sans">

        {/* Navegación de retorno */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>

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
        <div className="prose-custom space-y-8 text-foreground/90 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Identificación del Titular
            </h2>
            <p className="text-sm text-muted-foreground">
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Información y de Comercio
              Electrónico (LSSI-CE), se informa que el presente sitio web es
              gestionado por el equipo de desarrollo del proyecto{" "}
              <strong className="text-foreground">Diagnosta</strong>, creado
              exclusivamente con fines de participación en una Hackatón de
              desarrollo tecnológico.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. Objeto y Finalidad
            </h2>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Diagnosta — El Guardián
              Inteligente</strong> es un proyecto de demostración técnica
              presentado en el contexto de una Hackatón. Su propósito es
              demostrar capacidades de monitoreo inteligente de APIs, análisis
              de latencia y diagnóstico automatizado mediante inteligencia
              artificial. No constituye un servicio comercial ni recoge datos
              personales de usuarios finales en producción.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Propiedad Intelectual
            </h2>
            <p className="text-sm text-muted-foreground">
              El código fuente, diseño, logotipos y textos que conforman esta
              aplicación son propiedad intelectual de sus autores. Queda
              prohibida su reproducción total o parcial sin autorización expresa,
              salvo en los términos que la legislación vigente permita.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Exclusión de Responsabilidad
            </h2>
            <p className="text-sm text-muted-foreground">
              Dado el carácter prototípico de este proyecto, los datos mostrados
              son simulados y no reflejan infraestructuras reales en producción.
              El equipo no asume responsabilidad por decisiones tomadas basándose
              en la información presentada en este entorno de demostración.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Legislación Aplicable
            </h2>
            <p className="text-sm text-muted-foreground">
              Este aviso legal se rige por la legislación española. Para la
              resolución de cualquier controversia, las partes se someten a los
              juzgados y tribunales competentes conforme a la normativa vigente
              en España.
            </p>
          </section>

        </div>

        {/* Footer de la página legal */}
        <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Diagnosta · Proyecto de Hackatón
          </p>
          <nav className="flex items-center gap-4">
            <Link
              href="/privacidad"
              className="text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              Privacidad
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/cookies"
              className="text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              Cookies
            </Link>
          </nav>
        </footer>

      </article>
    </div>
  );
}
