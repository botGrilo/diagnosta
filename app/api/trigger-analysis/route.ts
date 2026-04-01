/** 
 * 
 * Esta es la ruta que el botón del Dashboard llamará. Aquí es donde ocurre la magia de seguridad: el servidor toma los snapshots, genera la firma HMAC (usando las claves secretas que nunca el navegador sabrá) y dispara hacia n8n.
 */

import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { snapshots } = await req.json();
    const jobId = crypto.randomUUID();
    const timestamp = Date.now().toString();

    // ── FIRMA HMAC (SERVIDOR SEGURO) ──────────────────
    // Estas variables permanecen ocultas al usuario (F12)
    const secret = process.env.DIAGNOSTA_WEBHOOK_SECRET || '';
    const salt = process.env.DIAGNOSTA_SALT || '';
    
    const signature = crypto
      .createHmac('sha256', secret + salt)
      .update(timestamp)
      .digest('hex');

    // ── DISPARO A N8N ──────────────────────────────────
    // const targetUrl = 'https://n8n.000253.xyz/webhook/diagnostico-global-maestro';
    const targetUrl = 'https://n8n.botgrilo.es/webhook/diagnostico-global-maestro';
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-diagnosta-signature': signature,
        'x-diagnosta-timestamp': timestamp
      },
      body: JSON.stringify({
        job_id: jobId,
        source: 'USER_TRIGGERED',
        snapshots: snapshots
      })
    });

    if (!response.ok) {
      throw new Error(`Error n8n: ${response.statusText}`);
    }

    // Retornamos el job_id para que el frontend pueda filtrar
    return Response.json({ success: true, job_id: jobId });

  } catch (error: any) {
    console.error('Trigger Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
