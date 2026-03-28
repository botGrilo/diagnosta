import pool from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

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
    isSystem: row.is_system ?? false, // Devolvemos isSystem para que el frontend pueda diferenciarlo
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
              v.status_code, v.latency_ms,
              v.is_success, v.checked_at AS last_checked_at,
              false AS is_system
      FROM endpoints e
      LEFT JOIN v_endpoint_status v
        ON v.endpoint_id = e.id
      WHERE e.user_id = $1
      UNION ALL
      SELECT e.id, e.name, e.url, e.method,
              e.expected_status, e.check_interval_min,
              e.latency_threshold_ms, e.keyword_check,
              e.is_public, e.is_active, e.created_at,
              v.status_code, v.latency_ms,
              v.is_success, v.checked_at AS last_checked_at,
              true AS is_system
      FROM endpoints e
      LEFT JOIN v_endpoint_status v
        ON v.endpoint_id = e.id
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
