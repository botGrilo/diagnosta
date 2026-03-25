/* eslint-disable */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://n8n_user:my-super-secret-and-safe-password-123@localhost:5432/diagnosta'
});

async function run() {
  const hash = await bcrypt.hash('Admin2026!', 12);
  await pool.query(
    "INSERT INTO users (email, username, name, password_hash) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;",
    ['admin@diagnosta.es', 'admin', 'Admin Diagnosta', hash]
  );
  console.log('Admin inyectado correctamente en el nuevo esquema UUID');
  pool.end();
}

run().catch(console.error);
