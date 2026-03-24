import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });
}

// Dev: reutiliza el pool entre hot-reloads de Turbopack — evita explosión de conexiones
// Prod: globalThis.__pgPool es undefined en cada arranque, siempre crea uno nuevo
const pool = globalThis.__pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}

export default pool;
