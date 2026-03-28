import pool from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Validación de sesión v5 (auth())
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { name, url, method, keyword } = await req.json();

    if (!name || !url) {
      return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
    }

    // 1. Verificar límite de 6 — validación en backend obligatoria
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM endpoints WHERE user_id = $1 AND is_active = true",
      [session.user.id]
    );
    
    // Si ya tiene 6 o más, bloqueamos el registro
    if (parseInt(countRes.rows[0].count) >= 6) {
      return NextResponse.json({ error: "Límite de 6 endpoints alcanzado" }, { status: 403 });
    }

    // 2. Insertar en DB (Nota: se usa keyword_check como nombre de columna real)
    const result = await pool.query(
      `INSERT INTO endpoints (user_id, name, url, method, keyword_check, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING id`,
      [session.user.id, name, url, method || "GET", keyword || null]
    );

    return NextResponse.json({ id: result.rows[0].id, ok: true });
  } catch (err) {
    console.error("Error al registrar nodo:", err);
    return NextResponse.json({ error: "Error interno en base de datos" }, { status: 500 });
  }
}
