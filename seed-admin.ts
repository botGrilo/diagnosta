import { config } from 'dotenv';
config({ path: '.env.local' });
import { seedNewUser } from './lib/seed-user';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const r = await pool.query("SELECT id FROM users WHERE email = 'admin@diagnosta.es'");
  if (r.rows[0]) {
    await seedNewUser(r.rows[0].id);
    console.log('✅ Seed inyectado para admin@diagnosta.es');
  } else {
    console.log('❌ Admin no encontrado');
  }
  await pool.end();
}

main().catch(console.error);
