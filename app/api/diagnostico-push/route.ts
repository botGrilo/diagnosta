/**  el endpoint dual. El POST recibe, valida la firma HMAC de n8n y "empuja" el dato al Map. El GET abre el canal SSE (Server-Sent Events) para que el Frontend escuche en tiempo real. +*/


import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { sseClients as clients } from '@/lib/sse-store';

/**
 * GET: Abre el canal SSE para el Dashboard
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
 * POST: Receptor de n8n (Push Inbound)
 */
export async function POST(req: NextRequest) {
  // --- TAREA 3: LOGS DE GUERRA EN EL LUGAR CORRECTO ---
  console.log("N8N PUSH RECIBIDO:", new Date().toISOString());
  
  const signature = req.headers.get('x-diagnosta-signature');
  const timestamp = req.headers.get('x-diagnosta-timestamp');
  
  // 1. Validación de Presencia
  if (!signature || !timestamp) {
    return Response.json({ error: 'Firma ausente' }, { status: 401 });
  }

  // 2. Verificación HMAC (Seguridad de Grado Militar)
  const secret = process.env.DIAGNOSTA_WEBHOOK_SECRET || '';
  const salt = process.env.DIAGNOSTA_SALT || '';
  
  const expectedSignature = crypto
    .createHmac('sha256', secret + salt)
    .update(timestamp)
    .digest('hex');

  if (signature !== expectedSignature) {
    return Response.json({ error: 'Infiltración detectada: Firma inválida' }, { status: 403 });
  }

  // 3. Procesamiento y Emisión FIFO
  try {
    const data = await req.json();
    console.log("PAYLOAD IA:", JSON.stringify(data).substring(0, 150) + "...");

    // EMISIÓN UNIFICADA A TODOS LOS DASHBOARDS CONECTADOS (Fan-out)
    clients.forEach((controller, clientId) => {
      try {
        const payload = JSON.stringify({ type: 'DIAGNOSTICO_NEW', data });
        controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
      } catch (e) {
        // Limpieza automática si el stream está roto
        clients.delete(clientId);
      }
    });

    return Response.json({ status: 'Broadcast exitoso' });
  } catch (err) {
    return Response.json({ error: 'Fallo en la retransmisión' }, { status: 400 });
  }
}
