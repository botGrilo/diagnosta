import { NextResponse } from "next/server"
import { seedNewUser } from "@/lib/seed-user"
import pool from "@/lib/db"

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en producción" },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email") ?? "admin@diagnosta.es"

  const result = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  )

  if (!result.rows[0]) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    )
  }

  try {
    await seedNewUser(result.rows[0].id)
    return NextResponse.json({
      success: true,
      userId: result.rows[0].id,
      email
    })
  } catch (error) {
    console.error("[dev/seed] Error:", error)
    return NextResponse.json(
      { error: "Error al generar el historial" },
      { status: 500 }
    )
  }
}