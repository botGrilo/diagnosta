"use server";
import pool from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createEndpoint(fd: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };
  
  const userId = session.user.id;
  
  // Limite estricto de 20 para proteger infraestructura
  const countRes = await pool.query("SELECT COUNT(*) FROM endpoints WHERE user_id = $1", [userId]);
  if (parseInt(countRes.rows[0].count) >= 20) {
    return { error: "Límite máximo de 20 endpoints alcanzado." };
  }

  const name = fd.get("name") as string;
  const url = fd.get("url") as string;
  const method = fd.get("method") as string || "GET";
  const expectedStatus = parseInt(fd.get("expected_status") as string) || 200;
  const interval = parseInt(fd.get("check_interval_min") as string) || 5;
  const keyword = fd.get("keyword_check") as string || null;
  const isPublic = fd.get("is_public") === "true";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return { error: "Formato de URL inválido. Usa http:// o https://" };
  }

  try {
    await pool.query(
      `INSERT INTO endpoints (user_id, name, url, method, expected_status, check_interval_min, keyword_check, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, name, url, method, expectedStatus, interval, keyword, isPublic]
    );
    revalidatePath("/dashboard/endpoints");
    return { success: true };
  } catch (e) {
    console.error("Error al crear endpoint:", e);
    return { error: "Error interno en BD al crear endpoint" };
  }
}

export async function deleteEndpoint(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };
  
  try {
    const res = await pool.query("DELETE FROM endpoints WHERE id = $1 AND user_id = $2 RETURNING id", [id, session.user.id]);
    if (res.rowCount === 0) return { error: "Endpoint no encontrado o no pertenece al usuario" };
    
    revalidatePath("/dashboard/endpoints");
    return { success: true };
  } catch {
    return { error: "Error al eliminar endpoint" };
  }
}
