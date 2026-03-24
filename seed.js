const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://n8n_user:my-super-secret-and-safe-password-123@localhost:5432/diagnosta'
});

async function run() {
  const hash = bcrypt.hashSync('Admin2026!', 10);
  await pool.query(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;",
    ['admin@diagnosta.es', 'Admin Diagnosta', hash]
  );
  console.log('Admin inserted successfully');
  pool.end();
}

run().catch(console.error);
