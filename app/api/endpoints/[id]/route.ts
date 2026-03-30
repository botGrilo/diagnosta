import pool from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * ELIMINAR ENDPOINT (Soft Delete)
 * No se borra físicamente para conservar el historial forense.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  console.log('SESSION_USER_ID:', session?.user?.id)
  console.log('SESSION_USER_EMAIL:', session?.user?.email)
  console.log('ENDPOINT_ID_PARAM:', params.id)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // EL AND user_id = $2 es crítico por arquitectura de seguridad
    // BLOQUEO: No se pueden desactivar pilares globales ni nodos de sistema
    const dbRes = await pool.query(
      `UPDATE endpoints 
       SET is_active = false 
       WHERE id = $1 AND user_id = $2
       AND user_id != (SELECT id FROM users WHERE email = 'system@diagnosta.es')`,
      [params.id, session.user.id]
    );

    console.log('🗑️ DELETE_ROWS_AFFECTED:', dbRes.rowCount)

    return NextResponse.json({ ok: true, affected: dbRes.rowCount });
  } catch (err) {
    console.error("Error al eliminar nodo:", err);
    return NextResponse.json({ error: "Error de base de datos" }, { status: 500 });
  }
}

/**
 * EDITAR CONFIGURACIÓN (PATCH)
 * Actualiza los parámetros del nodo sin romper el historial.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { name, url, method, keyword } = await req.json();

    // Validaciones de Integridad
    if (!name?.trim()) {
      return NextResponse.json({ error: "El nombre descriptivo es obligatorio" }, { status: 400 });
    }
    if (!url?.startsWith('http://') && !url?.startsWith('https://')) {
      return NextResponse.json({ error: "La URL debe comenzar con http:// o https://" }, { status: 400 });
    }

    // Actualización con validación de pertenencia (user_id)
    await pool.query(
      `UPDATE endpoints 
       SET name=$1, url=$2, method=$3, keyword_check=$4, updated_at=NOW() 
       WHERE id=$5 AND user_id=$6 AND is_active = true`,
      [name.trim(), url.trim(), method || 'GET', keyword?.trim() || null, params.id, session.user.id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error al editar nodo:", err);
    return NextResponse.json({ error: "Error de base de datos" }, { status: 500 });
  }
}
