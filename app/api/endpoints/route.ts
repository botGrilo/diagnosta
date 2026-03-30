import pool from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Desactiva el caché estático de Next.js — esta ruta siempre devuelve datos frescos
export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEndpoint(row: Record<string, any>) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    method: row.method,
    expectedStatus: row.expected_status,
    checkIntervalMin: row.check_interval_min,
    latencyThresholdMs: row.latency_threshold_ms,
    keywordCheck: row.keyword_check ?? null,
    isPublic: row.is_public,
    isActive: row.is_active,
    createdAt: row.created_at,
    statusCode: row.status_code ?? null,
    latencyMs: row.latency_ms ?? null,
    isSuccess: row.is_success ?? null,
    lastCheckedAt: row.checked_at ?? null,
    quick_insights: row.quick_insights ?? null, // Inyectamos la telemetría diagnóstica
    isSystem: row.is_system ?? false,
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const result = await pool.query(
      `SELECT e.id, e.name, e.url, e.method,
              e.expected_status, e.check_interval_min,
              e.latency_threshold_ms, e.keyword_check,
              e.is_public, e.is_active, e.created_at,
              c.status_code, c.latency_ms,
              c.is_success, c.checked_at,
              c.quick_insights,
              false AS is_system
      FROM endpoints e
      LEFT JOIN LATERAL (
        SELECT * FROM checks 
        WHERE endpoint_id = e.id 
        ORDER BY checked_at DESC 
        LIMIT 1
      ) c ON true
      WHERE e.user_id = $1 AND e.is_active = true
      UNION ALL
      SELECT e.id, e.name, e.url, e.method,
              e.expected_status, e.check_interval_min,
              e.latency_threshold_ms, e.keyword_check,
              e.is_public, e.is_active, e.created_at,
              c.status_code, c.latency_ms,
              c.is_success, c.checked_at,
              c.quick_insights,
              true AS is_system
      FROM endpoints e
      LEFT JOIN LATERAL (
        SELECT * FROM checks 
        WHERE endpoint_id = e.id 
        ORDER BY checked_at DESC 
        LIMIT 1
      ) c ON true
      WHERE e.user_id = (
        SELECT id FROM users
        WHERE email = 'system@diagnosta.es'
      )
      AND e.is_active = true
      ORDER BY is_system ASC, created_at DESC
      LIMIT 26`,
      [session.user.id]
    )

    return NextResponse.json(result.rows.map(mapEndpoint));
  } catch (err) {
    console.error("Error al obtener endpoints para dashboard:", err);
    return NextResponse.json({ error: "Error intero en base de datos" }, { status: 500 });
  }
}

/**
 * REGISTRO DE NUEVO NODO (POST)
 * Valida cuota de 6 y formato de URL antes de impactar Postgres.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { name, url, method, keyword } = await req.json();

    // 1. Validaciones de Negocio
    if (!name?.trim()) {
      return NextResponse.json({ error: "El nombre descriptivo es obligatorio" }, { status: 400 });
    }
    if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
      return NextResponse.json({ error: "La URL debe comenzar con http:// o https://" }, { status: 400 });
    }

    // 2. Control de Cuota (Máximo 6 nodos activos)
    const countCheck = await pool.query(
      "SELECT COUNT(*) FROM endpoints WHERE user_id = $1 AND is_active = true",
      [session.user.id]
    );

    if (parseInt(countCheck.rows[0].count) >= 6) {
      return NextResponse.json({ error: "Límite de 6 endpoints alcanzado" }, { status: 403 });
    }

    // 3. Registro en Postgres
    const result = await pool.query(
      `INSERT INTO endpoints 
        (user_id, name, url, method, keyword_check, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING id, name, url, method`,
      [
        session.user.id,
        name.trim(),
        url.trim(),
        method || 'GET',
        keyword?.trim() || null
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (err: any) {
    // Si la URL ya existe para este usuario (Constraint UNIQUE)
    if (err.code === '23505') {
      return NextResponse.json({ error: "Esta URL ya está registrada en tu red" }, { status: 409 });
    }
    console.error("Error en POST /api/endpoints:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
