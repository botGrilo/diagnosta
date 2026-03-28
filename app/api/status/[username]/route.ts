
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  // Aseguramos existencia del perfil apuntado
  const user = await pool.query(
    `SELECT id, username, name 
     FROM users WHERE username = $1`,
    [username]
  )

  if (!user.rows[0]) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    )
  }

  // Traer union de endpoints: propio (is_public) + globales
  const endpoints = await pool.query(
    `SELECT e.id, e.name, e.url, e.method,
            v.status_code, v.latency_ms,
            v.is_success, v.checked_at,
            false AS is_system
     FROM endpoints e
     LEFT JOIN v_endpoint_status v
       ON v.endpoint_id = e.id
     WHERE e.user_id = $1
     AND e.is_public = true
     AND e.is_active = true

     UNION ALL

     SELECT e.id, e.name, e.url, e.method,
            v.status_code, v.latency_ms,
            v.is_success, v.checked_at,
            true AS is_system
     FROM endpoints e
     LEFT JOIN v_endpoint_status v
       ON v.endpoint_id = e.id
     WHERE e.user_id = (
       SELECT id FROM users
       WHERE email = 'system@diagnosta.es'
     )
     AND e.is_active = true

     ORDER BY is_system ASC, name ASC`,
    [user.rows[0].id]
  )

  // Cálculo de uptime basado en query robusta SQL de 24 horas usando agrupación directa.
  // IMPORTANTE: el filtrado lo hace la BD y evita saturar RAM de Next.js
  const uptime = await pool.query(
    `SELECT ROUND(
       100.0 * SUM(CASE WHEN is_success THEN 1 ELSE 0 END)
       / NULLIF(COUNT(*), 0), 2
     ) AS uptime_pct
     FROM checks
     WHERE endpoint_id IN (
       SELECT id FROM endpoints
       WHERE user_id = $1
       AND is_public = true
     )
     AND checked_at > NOW() - INTERVAL '24 hours'`,
    [user.rows[0].id]
  )

  return NextResponse.json({
    username: user.rows[0].username,
    name: user.rows[0].name,
    uptime_pct: uptime.rows[0]?.uptime_pct ?? 100,
    endpoints: endpoints.rows,
    last_updated: new Date().toISOString(),
  })
}
