import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEndpoints, createEndpoint, deleteEndpoint } from "@/actions/endpoint-actions";
import {
  Activity, Globe, Clock, CheckCircle, XCircle,
  AlertCircle, Trash2, Plus, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const METHOD_BADGE: Record<string, string> = {
  GET:  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  POST: "text-sky-400    bg-sky-400/10    border-sky-400/20",
  HEAD: "text-amber-400  bg-amber-400/10  border-amber-400/20",
};

function StatusIcon({ status }: { status: string | null }) {
  if (status === "ok")       return <CheckCircle  className="h-4 w-4 text-[var(--status-ok)]"       />;
  if (status === "degraded") return <AlertCircle  className="h-4 w-4 text-[var(--status-degraded)]" />;
  if (status === "down")     return <XCircle      className="h-4 w-4 text-[var(--status-down)]"     />;
  // Sin datos aún — el worker de N8N no ha hecho el primer ping
  return <span className="h-4 w-4 rounded-full border border-border inline-block" title="Sin datos aún" />;
}

export default async function EndpointsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const endpoints = await getEndpoints();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* ── HEADER ─────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Endpoints Monitoreados</h1>
        </div>

        {/* ── FORMULARIO — Server Action directo, sin fetch manual ── */}
        <form
          action={createEndpoint}
          className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Añadir Endpoint
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-xs font-medium text-muted-foreground">Nombre</label>
              <input
                id="nombre" name="nombre" type="text" required
                placeholder="API de Pagos"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* URL */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="url" className="text-xs font-medium text-muted-foreground">URL</label>
              <input
                id="url" name="url" type="url" required
                placeholder="https://api.tuapp.com/health"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Método HTTP */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="method" className="text-xs font-medium text-muted-foreground">Método HTTP</label>
              <select
                id="method" name="method"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>

            {/* Status esperado */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expected_status" className="text-xs font-medium text-muted-foreground">Status HTTP esperado</label>
              <input
                id="expected_status" name="expected_status"
                type="number" defaultValue={200} min={100} max={599} required
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Intervalo — nombre del campo alineado con la DB */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="check_interval_min" className="text-xs font-medium text-muted-foreground">Intervalo de chequeo</label>
              <select
                id="check_interval_min" name="check_interval_min"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[1, 5, 10, 15, 30, 60].map((m) => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
            </div>

            {/* Switch is_public — CSS puro, sin dependencias de componente */}
            <div className="flex flex-col justify-center gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Visibilidad</label>
              <label htmlFor="is_public" className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" name="is_public" id="is_public" className="peer sr-only" />
                <div className="relative w-10 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors
                                after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                after:bg-white after:rounded-full after:h-4 after:w-4
                                after:transition-transform peer-checked:after:translate-x-5" />
                <span className="text-sm text-foreground">Status público</span>
              </label>
            </div>

          </div>

          <button
            type="submit"
            className="self-end bg-primary text-primary-foreground rounded-lg px-6 py-2 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
          >
            Crear Endpoint
          </button>
        </form>

        {/* ── LISTA — datos reales desde endpoints + v_endpoint_status ── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""} registrado{endpoints.length !== 1 ? "s" : ""}
          </h2>

          {endpoints.length === 0 && (
            <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground text-sm">
              Aún no hay endpoints. Añade el primero con el formulario de arriba.
            </div>
          )}

          {endpoints.map((ep) => (
            <div
              key={ep.id}
              className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-colors duration-300 group"
            >
              {/* Estado visual — viene de v_endpoint_status vía getEndpoints() */}
              <StatusIcon status={ep.last_status} />

              {/* Nombre + URL */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{ep.nombre}</p>
                <p className="text-xs font-mono text-muted-foreground truncate">{ep.url}</p>
              </div>

              {/* Method badge */}
              <span className={`shrink-0 text-[10px] font-mono font-bold border px-2 py-0.5 rounded ${METHOD_BADGE[ep.method] ?? ""}`}>
                {ep.method}
              </span>

              {/* Icono globe si el status es público */}
              {ep.is_public && (
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" title="Status público habilitado" />
              )}

              {/* Intervalo */}
              <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {ep.check_interval_min}m
              </span>

              {/* Latencia del último ping si existe */}
              {ep.response_time_ms != null && (
                <span className="shrink-0 text-xs font-mono text-muted-foreground">
                  {ep.response_time_ms}ms
                </span>
              )}

              {/* Eliminar — form + Server Action, sin fetch manual */}
              <form action={deleteEndpoint.bind(null, String(ep.id))} className="shrink-0">
                <button
                  type="submit"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar endpoint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
