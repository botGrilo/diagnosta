export function generateClinicalReportHTML(status: any, ia: any, epi: any, latency: number, protocolo: any[]) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Diagnosta — ${status.name}</title>
      <style>
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-scheme: light !important; box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #ffffff; color: #0f172a !important; padding: 2rem; font-size: 13px; line-height: 1.6; }
        h1 { font-size: 1.5rem; font-weight: 900; font-style: italic; margin-bottom: 0.25rem; color: #0f172a !important; }
        h2 { font-size: 0.9rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #0d9488 !important; margin: 1.5rem 0 0.75rem; border-left: 3px solid #0d9488; padding-left: 0.5rem; }
        h3 { font-size: 0.8rem; font-weight: 900; text-transform: uppercase; color: #0d9488 !important; margin-bottom: 0.5rem; }
        p { color: #1e293b !important; }
        .grid { display: block; margin-top: 1.5rem; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; }
        .badge { display: inline-block; padding: 0.2rem 0.75rem; border-radius: 999px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; }
        .badge-verde { background: #f0fdf4; border: 1.5px solid #0d9488; color: #0d9488 !important; }
        .badge-amarillo { background: #fffbeb; border: 1.5px solid #d97706; color: #d97706 !important; }
        .badge-rojo { background: #fef2f2; border: 1.5px solid #dc2626; color: #dc2626 !important; }
        .row { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #f1f5f9; font-size: 0.75rem; }
        .row .label { color: #64748b !important; text-transform: uppercase; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.1em; }
        .row .value { color: #0f172a !important; font-weight: 700; text-align: right; max-width: 70%; }
        .highlight { color: #0d9488 !important; }
        code { display: block; background: #0f172a !important; color: #2dd4bf !important; padding: 0.75rem; border-radius: 8px; font-size: 0.7rem; font-family: 'Courier New', monospace; white-space: pre-wrap; word-break: break-all; margin: 0.5rem 0; border: 1px solid #1e293b; }
        .example-box { background: #f0fdf4; border: 1px solid #0d9488; border-radius: 8px; padding: 0.75rem; margin-top: 0.5rem; }
        .example-label { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: #0d9488 !important; margin-bottom: 0.5rem; letter-spacing: 0.15em; }
        .measured { font-size: 0.75rem; color: #475569 !important; margin-top: 0.5rem; }
        .measured span { color: #0d9488 !important; font-weight: 900; font-size: 0.9rem; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #e2e8f0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; }
        .metric { background: #f8fafc; padding: 0.75rem; }
        .metric .mlabel { font-size: 0.6rem; color: #64748b !important; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 0.25rem; }
        .metric .mvalue { font-size: 1rem; font-weight: 900; color: #0d9488 !important; }
        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 0.65rem; color: #64748b !important; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; }
        .paso { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; margin-bottom: 0.75rem; page-break-inside: avoid; }
        .paso-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .paso-num { background: #0d9488; color: #fff !important; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.65rem; flex-shrink: 0; }
        .paso-tipo { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: #0d9488 !important; letter-spacing: 0.15em; }
        .paso-accion { font-size: 0.75rem; color: #1e293b !important; margin-bottom: 0.5rem; }
        @media print { 
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } 
          h2 { break-before: auto; margin-top: 2rem; }
          .card { break-inside: avoid; }
        }
      </style>
    </head>
    <body onload="window.print();">
      <!-- HEADER DE MARCA -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1.5rem;background:#01040a;border-bottom:2px solid #2dd4bf;margin:-2rem -2rem 2rem -2rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div style="width:28px;height:28px;background:#2dd4bf;border-radius:6px;display:flex;align-items:center;justify-content:center;">
            <span style="color:#000;font-weight:900;font-size:14px;">D</span>
          </div>
          <div>
            <div style="color:#2dd4bf;font-weight:900;font-size:1rem;letter-spacing:0.05em;">DIAGNOSTA</div>
            <div style="color:#475569;font-size:0.6rem;font-family:monospace;letter-spacing:0.1em;">El Guardián de tus APIs</div>
          </div>
        </div>
        <div style="text-align:right;line-height:1.6;">
          <div style="color:#2dd4bf;font-size:0.75rem;font-weight:900;letter-spacing:0.05em;">José Grillo</div>
          <div style="color:#94a3b8;font-size:0.65rem;font-family:monospace;">
            <a href="https://josegrillo.vercel.app/" style="color:#2dd4bf;text-decoration:none;">josegrillo.vercel.app</a>
          </div>
          <div style="color:#475569;font-size:0.6rem;font-family:monospace;margin-top:0.1rem;">
            diagnosta.botgrilo.es
          </div>
        </div>
      </div>

      <!-- CONTENIDO DEL EXPEDIENTE -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #e2e8f0;padding-bottom:1rem;margin-bottom:1rem;margin-top:1rem;">
        <div>
          <h1>${status.name} <span style="color:#64748b;font-style:normal;font-weight:500;font-size:1.1rem;">— Expediente Clínico</span></h1>
          <div style="font-size:0.65rem;color:#94a3b8;font-family:monospace;margin-top:0.25rem;">
            ID: ${status.id?.slice(0, 12)} &nbsp;|&nbsp; EXEC: #${status._internal?.execution_id || status.ai_recipe?._internal?.execution_id || '---'} &nbsp;|&nbsp; STATUS: ${status.status_code || 200}
          </div>
        </div>
        <span class="badge badge-${(ia?.resumen_clinico?.gravedad || 'verde').toLowerCase()}">
          ${ia?.resumen_clinico?.gravedad || 'VERDE'} — ${epi?.health_category || 'NORMAL'}
        </span>
      </div>

      <div class="metrics">
        <div class="metric"><div class="mlabel">Latencia actual</div><div class="mvalue">${latency}ms</div></div>
        <div class="metric"><div class="mlabel">Uptime</div><div class="mvalue">${epi?.uptime_score || '100%'}</div></div>
        <div class="metric"><div class="mlabel">Promedio hist.</div><div class="mvalue" style="color:#0f172a">${epi?.avg_latency || 0}</div></div>
        <div class="metric"><div class="mlabel">Fallos recientes</div><div class="mvalue" style="color:${epi?.fallos_recientes > 0 ? '#dc2626' : '#0d9488'}">${epi?.fallos_recientes ?? 0}</div></div>
      </div>

      <div class="grid">
        <section>
          <h2>Resumen Clínico</h2>
          <div class="card">
            ${ia?.resumen_clinico?.titulo_diagnostico ? `<h3>${ia.resumen_clinico.titulo_diagnostico}</h3>` : ''}
            <p style="font-style:italic;margin-bottom:1rem;color:#334155;">"${ia?.resumen_clinico?.descripcion_humana || 'Auditando evidencias forenses...'}"</p>
            <div class="row"><span class="label">Gravedad</span><span class="value highlight">${ia?.resumen_clinico?.gravedad || 'VERDE'}</span></div>
            <div class="row"><span class="label">Categoría</span><span class="value">${epi?.health_category || 'NORMAL'}</span></div>
            <div class="row"><span class="label">Requiere Humano</span><span class="value">${ia?.resumen_clinico?.requiere_humano ? 'SÍ' : 'NO'}</span></div>
            <div class="row"><span class="label">Evidencia</span><span class="value highlight">${epi?.evidence_captured ? '✓ Payload Real' : 'Conectividad'}</span></div>
            ${epi?.analisis_junior?.comparacion_2h ? `
            <div style="margin-top:0.75rem;background:#f0fdf4;border:1px solid #0d9488;border-radius:8px;padding:0.6rem;">
              <div style="font-size:0.65rem;font-weight:900;text-transform:uppercase;color:#64748b;margin-bottom:0.25rem;letter-spacing:0.1em;">Desviación Histórica (2h)</div>
              <div style="font-weight:900;color:#0f172a;">${epi.analisis_junior.comparacion_2h}</div>
            </div>` : ''}
          </div>

          ${epi?.analisis_junior ? `
          <h2>Análisis Estadístico</h2>
          <div class="card">
            <div class="row"><span class="label">Desviación estándar</span><span class="value">${epi.analisis_junior.std_dev}ms — ${epi.analisis_junior.estabilidad}</span></div>
            <div class="row"><span class="label">Percentil actual</span><span class="value">${epi.analisis_junior.percentil}% — ${epi.analisis_junior.percentil_label}</span></div>
            <div class="row"><span class="label">Rango histórico</span><span class="value">${epi.analisis_junior.min_latency}ms – ${epi.analisis_junior.max_latency}ms</span></div>
            <div class="row"><span class="label">vs promedio</span><span class="value ${epi.analisis_junior.pct_vs_avg > 50 ? 'highlight' : ''}">${epi.analisis_junior.comparacion}</span></div>
            <div class="row"><span class="label">Patrón horario</span><span class="value">${epi.analisis_junior.patron_horario}</span></div>
            <div class="row"><span class="label">Racha sobre umbral</span><span class="value">${epi.analisis_junior.racha_sobre_umbral} checks consecutivos</span></div>
          </div>` : ''}

          <h2>Análisis Técnico</h2>
          <div class="card">
            <div class="row"><span class="label">Causa raíz probable</span><span class="value">${ia?.analisis_tecnico?.causa_raiz_probable || 'N/A'}</span></div>
            <div class="row"><span class="label">Causa diferencial</span><span class="value">${ia?.analisis_tecnico?.causa_diferencial || 'N/A'}</span></div>
            <div class="row"><span class="label">Destinatario</span><span class="value">${ia?.analisis_tecnico?.destinatario || 'AUTOMÁTICO'}</span></div>
            <div class="row"><span class="label">Patrón histórico</span><span class="value">${ia?.analisis_tecnico?.patron_historico || 'ESTABLE'}</span></div>
            <div class="row"><span class="label">Tendencia</span><span class="value">${ia?.analisis_tecnico?.tendencia || 'ESTABLE'}</span></div>
          </div>

          <h2>Pronóstico</h2>
          <div class="card">
            <div class="row"><span class="label">Tiempo recuperación</span><span class="value">${ia?.pronostico?.tiempo_recuperacion || 'N/A'}</span></div>
            <div class="row"><span class="label">Impacto negocio</span><span class="value">${ia?.pronostico?.impacto_negocio || 'Ninguno'}</span></div>
          </div>
        </section>

        <section>
          <h2>Protocolo de Intervención</h2>
          ${protocolo.length > 0 ? protocolo.map((step: any) => `
            <div class="paso">
              <div class="paso-header">
                <div class="paso-num">${step.paso}</div>
                <span class="paso-tipo">${step.tipo}</span>
              </div>
              <div class="paso-accion">${step.accion}</div>
              ${step.comando ? `<code>${step.comando.replace(/https?:\/\/[^\s"'\n\\]+/g, status.url || 'https://endpoint')}</code>` : ''}
              ${step.comando?.toLowerCase().includes('curl') && status.url ? `
              <div class="example-box">
                <div class="example-label">Ejemplo ejecutable — copia y pega en tu terminal</div>
                <code>curl -w "\\nTiempo: %{time_total}s\\n" -o /dev/null -s ${status.url}</code>
                <div class="measured">Diagnosta midió: <span>${status.latency_ms}ms</span> — ¿obtienes un resultado similar?</div>
              </div>` : ''}
            </div>
          `).join('') : '<p style="color:#64748b;font-style:italic;padding-left:1rem;">Sin protocolo disponible.</p>'}
        </section>
      </div>

      <div class="footer">
        <span>${ia?.firma || 'DR. GRILO · PROTOCOLO LOCAL'}</span>
        <span>PROVEEDOR IA: ${status.ai_provider || 'GEMINI_AI_N8N'}</span>
        <span>Diagnosta v4.0 Clinical Edition</span>
      </div>

      <script>window.onload = () => { window.print(); }</script>
    </body>
    </html>
  `
}
