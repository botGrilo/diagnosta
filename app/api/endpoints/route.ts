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
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const res = await pool.query(`
      SELECT 
        e.id, e.name, e.url, e.method, e.check_interval_min, e.is_public, 
        v.status_code, v.latency_ms, v.is_success, v.checked_at
      FROM endpoints e
      LEFT JOIN v_endpoint_status v ON e.id = v.endpoint_id
      WHERE e.user_id = $1
      ORDER BY e.created_at DESC
    `, [session.user.id]);

    return NextResponse.json(res.rows.map(mapEndpoint));
  } catch (err) {
    console.error("Error al obtener endpoints para dashboard:", err);
    return NextResponse.json({ error: "Error intero en base de datos" }, { status: 500 });
  }
}
