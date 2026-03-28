import { NextResponse } from "next/server";

const BLACKLISTED_IPS = [
  "127.0.0.1",
  "localhost",
  "0.0.0.0",
  "10.",
  "192.168.",
  "172.16.",
  "169.254.", // Link-local
];

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL requerida" }, { status: 400 });
    }

    // 1. Validación básica de formato
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "URL inválida", code: "INVALID_FORMAT" }, { status: 400 });
    }

    // 2. Validación SSRF (Bloqueo de IPs privadas en el hostname)
    const lowerUrl = url.toLowerCase();
    const isBlacklisted = BLACKLISTED_IPS.some(ip => lowerUrl.includes(ip));

    if (isBlacklisted) {
      return NextResponse.json({ 
        error: "Acceso denegado: No se permiten infraestructuras privadas o locales por seguridad.",
        code: "SSRF_BLOCK" 
      }, { status: 403 });
    }

    // 3. Intento de conexión (Proactive Check)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, { 
        method: "HEAD", 
        signal: controller.signal,
        headers: { "User-Agent": "DrGrilo-Security-Scanner/1.0" }
      });
      clearTimeout(timeout);

      return NextResponse.json({ 
        success: true, 
        status: response.status,
        message: "Nodo alcanzable y seguro."
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return NextResponse.json({ error: "Tiempo de espera agotado al conectar con el nodo.", code: "TIMEOUT" }, { status: 408 });
      }
      return NextResponse.json({ error: "No se pudo establecer conexión con el nodo.", code: "UNREACHABLE" }, { status: 400 });
    }

  } catch (err) {
    return NextResponse.json({ error: "Error en el servidor de validación" }, { status: 500 });
  }
}
