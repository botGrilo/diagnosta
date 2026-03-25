import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Diagnosta",
  description:
    "Política de privacidad del proyecto Diagnosta conforme al RGPD y la LOPDGDD.",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-prose mx-auto py-20 px-6 font-sans">


        {/* Cabecera */}
        <header className="mb-10 border-b border-border pb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Protección de Datos
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Última actualización: 22 de marzo de 2026
          </p>
        </header>

        {/* Contenido */}
        <div className="space-y-8 text-foreground/90 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              1. Responsable del Tratamiento
            </h2>
            <p className="text-sm text-muted-foreground">
              En el marco del proyecto de Hackatón{" "}
              <strong className="text-foreground">Diagnosta</strong>, el equipo
              de desarrollo actúa como responsable del tratamiento de los datos,
              en los términos previstos por el Reglamento (UE) 2016/679 (RGPD) y
              la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              2. Datos Recabados
            </h2>
            <p className="text-sm text-muted-foreground">
              La presente aplicación es un <strong className="text-foreground">
              prototipo de demostración</strong> y no recoge datos personales
              reales de los usuarios. Todos los datos mostrados en el dashboard
              (métricas de latencia, logs de la consola neuronal, estadísticas
              de uptime) son <strong className="text-foreground">simulados
              </strong> y generados con fines ilustrativos para la Hackatón.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              3. Finalidad del Tratamiento
            </h2>
            <p className="text-sm text-muted-foreground">
              En un entorno de producción, Diagnosta procesaría exclusivamente
              datos técnicos de APIs (tiempos de respuesta, códigos de error,
              trazas de red) con la única finalidad de detectar anomalías y
              proporcionar diagnósticos automatizados. Ningún dato personal de
              usuarios finales sería procesado sin consentimiento explícito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              4. Derechos del Interesado
            </h2>
            <p className="text-sm text-muted-foreground">
              Conforme al RGPD, cualquier persona tiene derecho a ejercer los
              siguientes derechos: <strong className="text-foreground">
              acceso, rectificación, supresión, limitación, portabilidad y
              oposición</strong> al tratamiento de sus datos. En el contexto de
              este prototipo, al no existir recogida real de datos, estos derechos
              no son de aplicación efectiva durante la fase de demostración.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              5. Transferencias Internacionales
            </h2>
            <p className="text-sm text-muted-foreground">
              No se realizan transferencias de datos a terceros países fuera del
              Espacio Económico Europeo. La infraestructura de este prototipo
              opera en entornos de prueba locales o en proveedores cloud con
              certificación de adecuación según el RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              6. Autoridad de Control
            </h2>
            <p className="text-sm text-muted-foreground">
              Si considera que sus derechos no han sido respetados, puede
              presentar una reclamación ante la{" "}
              <strong className="text-foreground">
                Agencia Española de Protección de Datos (AEPD)
              </strong>{" "}
              a través de su sitio web:{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.aepd.es
              </a>
              .
            </p>
          </section>

        </div>


      </article>
    </div>
  );
}
