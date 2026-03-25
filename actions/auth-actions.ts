"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signOut } from "@/auth";
import { seedNewUser } from "@/lib/seed-user";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

//SALIR - Logout
export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}

// Registrar Usuario
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

  // Autogenerar username temporal para la tabla (requerido por Schema V5)
  const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 10000);

  const insertResult = await pool.query(
    "INSERT INTO users (name, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, email, username, password_hash]
  );

  const newUserId = insertResult.rows[0].id;

  // Lógica de seed asíncrona (NO USAR AWAIT - Promesa en background para no frenar la UX al usuario)
  seedNewUser(newUserId).catch(console.error);

  // En vez de redirigir y romper la UX, devolvemos success para que el Modal reaccione
  return { success: true };

  //redirect("/login?registered=1");
}
