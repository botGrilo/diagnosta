import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { sseClients as clients } from '@/lib/sse-store';

/**
 * GET: Abre el canal SSE para el Dashboard (Túnel de entrada Dr. Grilo)
 */
export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = crypto.randomUUID();
      clients.set(clientId, controller);
      
      // Enviar señal de conexión establecida
      const heartbeat = `data: ${JSON.stringify({ type: 'CONNECTED', id: clientId })}\n\n`;
      controller.enqueue(new TextEncoder().encode(heartbeat));

      // Limpieza cuando el cliente cierra la pestaña
      req.signal.addEventListener('abort', () => {
        clients.delete(clientId);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * POST: Receptor de n8n (Push Inbound - Modo Quirúrgico)
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    
    // 1. DESEMPAQUETADO DE TRAMA: n8n entrega [ { ... } ]
    const item = Array.isArray(rawBody) ? rawBody[0] : rawBody;
    
    // 2. EXTRACCIÓN DE CONTENIDO VITAL: Tomamos el objeto 'data' (o el root si n8n no lo envolvió)
    const diagnostico = item.data || item;
    
    if (!diagnostico?.id) {
      return Response.json({ error: 'Payload inválido: falta identificador de nodo' }, { status: 400 });
    }

    // 3. VALIDACIÓN DE IDENTIDAD HÍBRIDA (Header + Body _auth)
    const signature = req.headers.get('x-diagnosta-signature') || item?._auth?.signature;
    const timestamp = req.headers.get('x-diagnosta-timestamp') || item?._auth?.timestamp;

    if (signature && timestamp) {
      const secret = process.env.DIAGNOSTA_WEBHOOK_SECRET || '';
      const salt = process.env.DIAGNOSTA_SALT || '';
      const expected = crypto.createHmac('sha256', secret + salt).update(timestamp).digest('hex');
      
      if (signature !== expected) {
        console.warn("⚠️ ALERTA_SEGURIDAD — Firma inválida detectada en el receptor.");
        return Response.json({ error: 'Infiltración detectada: firma inválida' }, { status: 403 });
      }
    }

    // 4. EMISIÓN LIMPIA (BROADCAST SSE): Remitimos solo el diagnóstico sin metadatos de auth
    clients.forEach((controller, clientId) => {
      try {
        const payload = JSON.stringify({
          type: 'DIAGNOSTICO_NEW',
          data: diagnostico
        });
        controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
      } catch (e) {
        // Limpieza automática si el stream está muerto
        clients.delete(clientId);
      }
    });

    console.log(`🩺 BROADCAST_EXITOSO — Nodo: ${diagnostico.id.slice(0, 8)}... — Total Clientes: ${clients.size}`);
    return Response.json({ status: 'Broadcast exitoso', job_id: diagnostico.job_id });

  } catch (err: any) {
    console.error("❌ ERROR_RECEPTOR_PUSH_MAESTRO:", err.message);
    return Response.json({ error: 'Fallo crítico en el receptor' }, { status: 500 });
  }
}
