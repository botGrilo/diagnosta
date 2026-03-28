import { NextResponse } from "next/server"
import pool from "@/lib/db"

/**
 * API HEALTHCHECK - EL SEXTO PILAR (Diagnosta Core)
 * 
 * Monitorea:
 * 1. Estado de la API (Next.js)
 * 2. Conexión a la Base de Datos (Postgres)
 * 3. Latencia interna
 */
export async function GET() {
  const startTime = Date.now()

  try {
    // Verificación de Conexión a DB
    const dbCheck = await pool.query('SELECT 1')
    
    if (!dbCheck) throw new Error("Database connection failed")

    const duration = Date.now() - startTime

    return NextResponse.json({
      status: "UP",
      timestamp: new Date().toISOString(),
      latency_ms: duration,
      vital_signs: {
        database: "CONNECTED",
        api: "OK",
        version: "v4.0 SRE Clinical Edition"
      },
      message: "Dr. Grilo reporta signos vitales estables en el Núcleo."
    })

  } catch (error) {
    console.error("🏥 ALERTA_UCI_DIAGNOSTA:", error)
    
    return NextResponse.json({
      status: "DOWN",
      timestamp: new Date().toISOString(),
      error: "Critical Failure in Core Communication",
      vital_signs: {
        database: "DISCONNECTED",
        api: "DEGRADED"
      }
    }, { status: 500 })
  }
}
