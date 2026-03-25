import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      endpoint_id,
      status_code,
      latency_ms,
      is_success,
      error_message = null,
    } = body

    if (!endpoint_id || is_success === undefined) {
      return NextResponse.json(
        { error: "endpoint_id e is_success requeridos" },
        { status: 400 }
      )
    }

    const epCheck = await pool.query(
      "SELECT id FROM endpoints WHERE id = $1 AND is_active = true",
      [endpoint_id]
    )
    if (!epCheck.rows[0]) {
      return NextResponse.json(
        { error: "Endpoint no encontrado" },
        { status: 404 }
      )
    }

    const result = await pool.query(
      `INSERT INTO checks 
         (endpoint_id, status_code, latency_ms, is_success, error_message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, checked_at`,
      [endpoint_id, status_code, latency_ms, is_success, error_message]
    )

    const shouldDiagnose = !is_success ||
      (latency_ms && latency_ms > 2000)

    return NextResponse.json({
      success: true,
      check_id: result.rows[0].id,
      checked_at: result.rows[0].checked_at,
      should_diagnose: shouldDiagnose,
    }, { status: 201 })

  } catch (error) {
    console.error("[checks] Error:", error)
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Usar POST para registrar checks" },
    { status: 405 }
  )
}
