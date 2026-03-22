# 🚀 Diagnosta - Roadmap de Infraestructura y Desarrollo

## ✅ Hito 1: Cimentación (Completado - Día 1 y 2)
- **Servidor VPS:** Desplegado en Barcelona (CubePath) con IP `45.90.237.120`.
- **Seguridad SSH:** Conexión establecida vía PowerShell desde local.
- **Orquestador:** Coolify instalado y vinculado al servidor.
- **Proyecto:** Identidad "Diagnosta" creada en el panel de control.

## ⚙️ Hito 2: El Cerebro (En Proceso - Día 2)
- **Servicio n8n:** Instalación de instancia con base de datos PostgreSQL.
- **Estado actual:** Desplegando (Extracting Docker Layers).
- **Dominio:** Configurado como `https://n8n.botgrilo.es`.
- **Pendiente:** Registro CNAME en cdmon apuntando a la IP del VPS.

## 📅 Hito 3: Integración de Código (Día 3 - Mañana)
- **Repositorio:** Vincular GitHub (`botGrilo/diagnosta`) con Coolify.
- **App Antigravity:** Primer despliegue del código de la aplicación.
- **Variables de Entorno:** Configurar APIs de Salud e IA.

## 🧠 Hito 4: Lógica de IA (Próximamente)
- **Workflows:** Crear flujos de automatización en n8n para análisis de datos médicos.
- **Conexión:** Unir la interfaz de Antigravity con el cerebro n8n.