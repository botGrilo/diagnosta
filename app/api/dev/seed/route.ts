import { NextResponse } from "next/server";
import { seedNewUser } from "@/lib/seed-user";
import pool from "@/lib/db";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }
  
  const result = await pool.query("SELECT id FROM users WHERE email = $1", ["admin@diagnosta.es"]);
  
  if (!result.rows[0]) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }
  
  await seedNewUser(result.rows[0].id);
  
  return NextResponse.json({ success: true, userId: result.rows[0].id });
}
