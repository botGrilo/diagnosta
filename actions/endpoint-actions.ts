"use server";

import { auth } from "@/auth";
import pool from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const endpointSchema = z.object({
  nombre: z.string().min(1).max(100),
  url: z.string().url("URL inválida"),
  method: z.enum(["GET", "POST", "HEAD"]),
  expected_status: z.coerce.number().int().min(100).max(599),
  check_interval_min: z.coerce.number().int().min(1).max(60),
  is_public: z.coerce.boolean(),
});

export async function createEndpoint(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado" };

  const parsed = endpointSchema.safeParse({
    nombre: formData.get("nombre"),
    url: formData.get("url"),
    method: formData.get("method"),
    expected_status: formData.get("expected_status"),
    check_interval_min: formData.get("check_interval_min"),
    // El checkbox devuelve "on" si está marcado, null si no
    is_public: formData.get("is_public") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { nombre, url, method, expected_status, check_interval_min, is_public } = parsed.data;

  await pool.query(
    `INSERT INTO endpoints (user_id, nombre, url, method, expected_status, check_interval_min, is_public)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [(session.user as { id: string }).id, nombre, url, method, expected_status, check_interval_min, is_public]
  );

  revalidatePath("/dashboard/endpoints");
  return { success: true };
}

export async function deleteEndpoint(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado" };

  // WHERE user_id = $2 — garantía de que el usuario solo borra lo suyo
  await pool.query(
    "DELETE FROM endpoints WHERE id = $1 AND user_id = $2",
    [id, (session.user as { id: string }).id]
  );

  revalidatePath("/dashboard/endpoints");
  return { success: true };
}

export async function getEndpoints() {
  const session = await auth();
  if (!session?.user?.id) return [];

  // JOIN con v_endpoint_status — el estado viene de la tabla checks, no de endpoints
  const result = await pool.query(
    `SELECT
       e.id,
       e.nombre,
       e.url,
       e.method,
       e.expected_status,
       e.check_interval_min,
       e.is_public,
       e.created_at,
       v.status           AS last_status,
       v.response_time_ms,
       v.checked_at       AS last_checked_at
     FROM endpoints e
     LEFT JOIN v_endpoint_status v ON v.endpoint_id = e.id
     WHERE e.user_id = $1
     ORDER BY e.created_at DESC`,
    [(session.user as { id: string }).id]
  );

  return result.rows;
}
