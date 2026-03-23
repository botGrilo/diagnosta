import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | Diagnosta",
  description:
    "Política de cookies del proyecto Diagnosta conforme a la normativa europea.",
};

export default function CookiesPage() {
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
              Gestión de Cookies
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Política de Cookies
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Última actualización: 22 de marzo de 2026
          </p>
        </header>

        {/* Contenido */}
        <div className="space-y-8 text-foreground/90 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. ¿Qué son las cookies?
            </h2>
            <p className="text-sm text-muted-foreground">
              Las cookies son pequeños archivos de texto que un sitio web almacena
              en el navegador del usuario al ser visitado. Se utilizan para
              recordar preferencias, analizar el comportamiento de navegación o
              habilitar funcionalidades esenciales de la aplicación. Su uso está
              regulado por la Directiva 2009/136/CE y la normativa española de
              protección de datos (RGPD + LOPDGDD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. Cookies utilizadas por Diagnosta
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              En su estado actual de prototipo para Hackatón,{" "}
              <strong className="text-foreground">Diagnosta</strong> únicamente
              utiliza cookies de carácter técnico e imprescindible:
            </p>

            {/* Tabla de cookies */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs text-muted-foreground">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Nombre
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Finalidad
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">
                      theme
                    </td>
                    <td className="px-4 py-3">Técnica</td>
                    <td className="px-4 py-3">
                      Almacena la preferencia de tema (claro/oscuro) del usuario
                    </td>
                    <td className="px-4 py-3">1 año</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">
                      _session
                    </td>
                    <td className="px-4 py-3">Técnica</td>
                    <td className="px-4 py-3">
                      Gestión de sesión de usuario (si aplica en producción)
                    </td>
                    <td className="px-4 py-3">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Cookies de terceros
            </h2>
            <p className="text-sm text-muted-foreground">
              En la versión actual de demostración, Diagnosta{" "}
              <strong className="text-foreground">no incorpora cookies de
              terceros</strong> con fines publicitarios ni de seguimiento. No se
              utiliiza Google Analytics, Facebook Pixel ni ninguna plataforma
              de marketing en este entorno de Hackatón.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Gestión y desactivación
            </h2>
            <p className="text-sm text-muted-foreground">
              Puede configurar su navegador para aceptar, rechazar o eliminar
              las cookies en cualquier momento. Tenga en cuenta que la
              desactivación de cookies técnicas puede afectar al correcto
              funcionamiento de la aplicación (por ejemplo, la preferencia de
              tema no se conservará entre sesiones).
            </p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">Chrome:</strong>{" "}
                Configuración → Privacidad y seguridad → Cookies
              </li>
              <li>
                <strong className="text-foreground">Firefox:</strong>{" "}
                Ajustes → Privacidad y Seguridad → Cookies y datos del sitio
              </li>
              <li>
                <strong className="text-foreground">Safari:</strong>{" "}
                Preferencias → Privacidad → Gestionar datos del sitio web
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Actualización de esta política
            </h2>
            <p className="text-sm text-muted-foreground">
              Esta política podrá ser actualizada en función de cambios
              legislativos o de la evolución del proyecto hacia un entorno de
              producción real. La fecha de última modificación siempre estará
              visible en la cabecera de este documento.
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
              href="/aviso-legal"
              className="text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              Aviso Legal
            </Link>
            <span className="text-border">·</span>
            <Link
              href="/privacidad"
              className="text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              Privacidad
            </Link>
          </nav>
        </footer>

      </article>
    </div>
  );
}
