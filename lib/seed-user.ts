/**
 * ESTRATEGIA DE MONITOREO INICIAL (SEED)
 * Seleccionamos estos 5 endpoints para cubrir el espectro total de observabilidad:
 * * 1. GitHub API: El estándar de oro. Valida conectividad con infraestructuras críticas 
 * y tiempos de respuesta de servidores de alto rendimiento
 * 2. PokeAPI: Representa APIs REST tradicionales de comunidad. Ideal para detectar 
 * latencias en servicios con caché pública.
 * 3. Open-Meteo: Monitorización de datos (meteorológicos) dinámicos en tiempo real. Prueba la capacidad 
 * de respuesta ante payloads con parámetros geográficos.
 * 4. CoinGecko Ping: El pulso del sector financiero. Demuestra que Diagnosta es apto 
 * para vigilar servicios de alta disponibilidad y baja latencia.
 * 5. Diagnosta Core (Self): La "Capa de Autodiagnóstico". El primer cliente de 
 * Diagnosta es Diagnosta, demostrando integridad y transparencia total.
 * * Nota: Estos endpoints alimentan la "Red Global" compartida, reduciendo el consumo 
 * de recursos (VPS 2GB) al centralizar pings en un solo usuario sistema.
 */


import pool from "@/lib/db"

const SEED_ENDPOINTS = [
  {
    name: "GitHub API",
    url: "https://api.github.com",
    method: "GET",
    expected_status: 200,
    check_interval_min: 5,
  },
  {
    name: "PokeAPI",
    url: "https://pokeapi.co/api/v2/pokemon/pikachu",
    method: "GET",
    expected_status: 200,
    check_interval_min: 5,
  },
  {
    name: "Open-Meteo",
    url: "https://api.open-meteo.com/v1/forecast?latitude=40.4&longitude=-3.7&current_weather=true",
    method: "GET",
    expected_status: 200,
    check_interval_min: 5,
  },
  {
    name: "CoinGecko Ping",
    url: "https://api.coingecko.com/api/v3/ping",
    method: "GET",
    expected_status: 200,
    check_interval_min: 5,
  },
  {
    name: "Diagnosta Core",
    url: "https://diagnosta.botgrilo.es/api/health",
    method: "GET",
    expected_status: 200,
    check_interval_min: 1,
  },
]

export async function seedNewUser(userId: string) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    for (const ep of SEED_ENDPOINTS) {
      await client.query(
        `INSERT INTO endpoints
           (user_id, name, url, method,
            expected_status, check_interval_min,
            is_public)
         VALUES ($1,$2,$3,$4,$5,$6,true)
         ON CONFLICT DO NOTHING`,
        [
          userId,
          ep.name,
          ep.url,
          ep.method,
          ep.expected_status,
          ep.check_interval_min,
        ]
      )
    }
    await client.query("COMMIT")
    console.log(
      `[Seed] Endpoints creados para usuario ${userId}`
    )
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("[Seed] Error:", err)
  } finally {
    client.release()
  }
}
