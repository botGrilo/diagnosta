import { NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

/**
 * API Maestras para el Dashboard Global
 * Ejecuta consulta DISTINCT ON (endpoint_id) optimizada con índice idx_endpoint_checked
 */
export async function GET() {
  try {
    const query = `
      SELECT DISTINCT ON (e.id)
        e.id,
        e.name,
        e.url,
        c.status_code,
        c.latency_ms,
        c.is_success,
        c.checked_at,
        c.response_preview
      FROM endpoints e
      LEFT JOIN (
        SELECT * FROM checks ORDER BY endpoint_id, checked_at DESC
      ) c ON e.id = c.endpoint_id
      WHERE e.user_id = (SELECT id FROM users WHERE email = 'system@diagnosta.es')
      ORDER BY e.id, c.checked_at DESC
    `

    const result = await pool.query(query)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
