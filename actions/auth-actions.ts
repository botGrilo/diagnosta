"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  // Verifica si el email ya existe antes de insertar
  const existing = await pool.query(
    "SELECT id FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  if (existing.rows.length > 0) {
    return { error: "Este email ya está registrado." };
  }

  // Hash de 12 rondas — balance seguridad/velocidad
  const password_hash = await bcrypt.hash(password, 12);

  await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
    [name, email, password_hash]
  );

  redirect("/login?registered=1");
}
