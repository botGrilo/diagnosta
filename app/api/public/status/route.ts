import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT e.id, e.name, e.url, e.method,
              v.status_code, v.latency_ms,
              v.is_success, v.checked_at
       FROM endpoints e
       LEFT JOIN v_endpoint_status v ON v.endpoint_id = e.id
       WHERE e.user_id = (
         SELECT id FROM users
         WHERE email = 'system@diagnosta.es'
       )
       AND e.is_active = true
       ORDER BY e.name ASC`
    )

    return NextResponse.json(result.rows)
  } catch (err) {
    console.error("Error fetching public status:", err)
    return NextResponse.json({ error: "No se pudo obtener el estado global" }, { status: 500 })
  }
}
