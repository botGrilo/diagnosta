import pool from "@/lib/db";
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
    latencyMs: row.latency_ms ?? row.avg_latency_ms ?? null, // Fallback al promedio si el actual falla
    avgLatencyMs: row.avg_latency_ms ?? null,
    uptimePct: row.uptime_pct ?? 100,
    isSuccess: row.is_success ?? null,
    lastCheckedAt: row.last_checked_at || row.checked_at || null, 
    quick_insights: row.quick_insights ?? null, // <--- Telemetría para la consola
    isSystem: true,
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT 
        e.id, e.name, e.url, e.method,
        e.expected_status, e.check_interval_min,
        e.latency_threshold_ms, e.keyword_check,
        e.is_public, e.is_active, e.created_at,
        c.status_code, c.latency_ms,
        c.is_success, c.checked_at AS last_checked_at,
        c.quick_insights,
        v.uptime_pct, v.avg_latency_ms
      FROM endpoints e
      LEFT JOIN LATERAL (
        SELECT * FROM checks 
        WHERE endpoint_id = e.id 
        ORDER BY checked_at DESC 
        LIMIT 1
      ) c ON true
      LEFT JOIN v_uptime_24h v ON v.endpoint_id = e.id
      WHERE e.user_id = (
        SELECT id FROM users
        WHERE email = 'system@diagnosta.es'
      )
      AND e.is_active = true
      ORDER BY created_at DESC`
    )

    return NextResponse.json(result.rows.map(mapEndpoint));
  } catch (err) {
    console.error("Error al obtener pilares globales:", err);
    return NextResponse.json({ error: "Error intero en base de datos" }, { status: 500 });
  }
}
