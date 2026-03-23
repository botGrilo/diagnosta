import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { z } from "zod";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Hereda pages, callbacks y session strategy de authConfig (edge-safe)
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const result = await pool.query(
          "SELECT id, email, password_hash, name FROM users WHERE email = $1 LIMIT 1",
          [email]
        );

        const user = result.rows[0];
        if (!user) return null;

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
});
