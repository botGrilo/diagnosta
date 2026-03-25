import pool from "./db";

export async function seedNewUser(userId: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // 1. Crear 5 Endpoints exigidos por el Dosier
    const endpoints = [
      { name: "GitHub API", url: "https://api.github.com", interval: 5 },
      { name: "PokeAPI", url: "https://pokeapi.co/api/v2/pokemon/pikachu", interval: 5 },
      { name: "Open-Meteo", url: "https://api.open-meteo.com/v1/forecast?latitude=40.4&longitude=-3.7&current_weather=true", interval: 5 },
      { name: "CoinGecko Ping", url: "https://api.coingecko.com/api/v3/ping", interval: 5 },
      { name: "Diagnosta Core", url: "https://diagnosta.botgrilo.es/api/health", interval: 1 }
    ];

    const epIds = [];
    for (const ep of endpoints) {
      const res = await client.query(
        `INSERT INTO endpoints (user_id, name, url, check_interval_min, is_public) 
         VALUES ($1, $2, $3, $4, true) RETURNING id`,
        [userId, ep.name, ep.url, ep.interval]
      );
      epIds.push({ id: res.rows[0].id, interval: ep.interval });
    }

    // 2. Generar Históricos (Últimos 7 días)
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    for (const ep of epIds) {
      const checks = [];
      const intervalMs = ep.interval * 60 * 1000;
      let currentTime = sevenDaysAgo;
      
      while (currentTime < now) {
        const date = new Date(currentTime);
        let latency = Math.floor(Math.random() * 40) + 80; // Normal: 80-120ms
        let isSuccess = true;
        let status = 200;
        
        // Incident simulado Día -2 (hace ~48 horas)
        const diffHours = (now - currentTime) / 3600000;
        const isIncident = diffHours > 47 && diffHours < 48;
        
        if (isIncident) {
          latency = Math.floor(Math.random() * 800) + 2800; // Spike: 2800-3600ms
          isSuccess = false;
          status = 503;
        }

        checks.push(`('${ep.id}', ${status}, ${latency}, ${isSuccess}, '${date.toISOString()}')`);
        currentTime += intervalMs;
      }

      // Chunking para evitar el out-of-memory y límites del parser SQL
      const chunkSize = 2000;
      for (let i = 0; i < checks.length; i += chunkSize) {
        const chunk = checks.slice(i, i + chunkSize);
        if (chunk.length > 0) {
          await client.query(`
            INSERT INTO checks (endpoint_id, status_code, latency_ms, is_success, checked_at) 
            VALUES ${chunk.join(",")}
          `);
        }
      }
    }
    
    await client.query("COMMIT");
    console.log(`[Seed] Historial sintético inyectado con éxito para usuario ${userId}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[Seed] Error masivo, abortando transacción:", error);
  } finally {
    client.release();
  }
}
