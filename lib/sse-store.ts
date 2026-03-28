/* Usamos el objeto globalThis para que el Map de clientes sobreviva a los reinicios de caliente (Hot Reload) y a las peticiones stateless. */

const globalForSSE = globalThis as unknown as {
  sseClients: Map<string, ReadableStreamDefaultController>
}

// Inicializamos el Map solo si no existe en el scope global
if (!globalForSSE.sseClients) {
  globalForSSE.sseClients = new Map()
}

export const sseClients = globalForSSE.sseClients
