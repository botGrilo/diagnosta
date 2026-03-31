<div align="center">

# 🛡️ Diagnosta

### _El Guardián Inteligente de tus APIs_

> "Tus APIs no son solo código que responde peticiones. Son pacientes.  
> Tienen pulso, tienen temperatura y tienen un historial clínico."

**Diagnosta es una Clínica Digital de Observabilidad impulsada por IA** que transforma métricas frías en diagnósticos en lenguaje humano. No solo te avisamos si un _Paciente_ está en UCI (endpoint caído); el **Dr. Grilo** (n8n + IA) analiza la _Radiografía_ del fallo para decirte por qué ocurrió y cómo curarlo.

[![Live Demo](https://img.shields.io/badge/🌐_Demo_en_vivo-diagnosta.botgrilo.es-4f46e5?style=for-the-badge)](https://diagnosta.botgrilo.es)
[![Stack](https://img.shields.io/badge/Stack-Next.js_15_%2B_n8n_%2B_PostgreSQL-0ea5e9?style=for-the-badge)](#️-tecnologías)
[![IA](https://img.shields.io/badge/IA-Llama_3_70B_%2B_Gemini_1.5_Flash-10b981?style=for-the-badge)](#-triage-inteligente-la-junta-médica-del-dr-grilo)

</div>

---

## 🏥 El Plano de la Clínica (Módulos)

| Área                              | Función                                                                       | Estado    |
| --------------------------------- | ----------------------------------------------------------------------------- | --------- |
| 🖥️ **Sala de Monitoreo**          | Dashboard principal con el estado en tiempo real de todos tus pacientes       | ✅ Activo |
| 💓 **Sala de Constantes Vitales** | Monitoreo permanente de los 6 Pilares de referencia (GitHub, CoinGecko, etc.) | ✅ Activo |
| 🚨 **Terapia Intensiva**          | Ronda Médica automática cada 5 minutos para detectar _Fiebre de Red_          | ✅ Activo |
| 📋 **Expediente Clínico**         | Historial detallado con gráficas de latencia y diagnósticos previos           | ✅ Activo |

---

## 🧠 Triage Inteligente: La Junta Médica del Dr. Grilo

Para optimizar recursos en nuestro servidor Nano, diseñamos una **Arquitectura de Inteligencia Escalonada** donde el coste de IA escala con la gravedad del incidente:

```
🟢 SIGNOS VITALES ESTABLES
   Pings exitosos → Lógica JS pura
   Coste IA: $0.00

🟡 FIEBRE DE RED — Nivel Ámbar
   Latencia > 2× promedio histórico
   → Gemini 1.5 Flash analiza la tendencia con visión corta del historial

🔴 PACIENTE EN UCI — Nivel Rojo
   Fallo de status o caída total
   → Dr. Grilo (Llama 3 70B vía Groq) entra en Quirófano
     Análisis forense con 50 checks de contexto histórico
```

---

## 📸 Radiografías del Sistema

> Nuestra Sala de Monitoreo en acción, mostrando el pulso de la infraestructura.

<div align="center">

|                                                                                                       |                                                                                                         |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![Dashboard principal](https://github.com/botGrilo/diagnosta/blob/main/assets/1.png)                  | ![Estado de pacientes](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_2.png)   |
| _Sala de Monitoreo — Vista general_                                                                   | _Constantes Vitales en tiempo real_                                                                     |
| ![Expediente clínico](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_3.png)  | ![Gráfica de latencia](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_4.png)   |
| _Expediente Clínico — Historial de salud_                                                             | _Radiografía de latencia con anomalías_                                                                 |
| ![Diagnóstico de IA](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_5.png)   | ![Informe del Dr. Grilo](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_6.png) |
| _Nivel Ámbar — Gemini Flash en análisis_                                                              | _Informe de Quirófano — Dr. Grilo diagnostica_                                                          |
| ![Status page pública](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_7.png) | ![Chaos Engineering](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/IMAGEN_8.png)     |

</div>

---

## ☁️ Infraestructura (CubePath + Coolify)

Diagnosta está diseñado para ser **resiliente en entornos limitados**:

- 🖥️ **Alojamiento:** VPS GP Nano (2 GB RAM) en Barcelona vía **CubePath**
- ⚙️ **Orquestación:** **Coolify** gestiona Next.js, PostgreSQL y n8n como servicios independientes con CI/CD continuo
- 🛡️ **Autodiagnóstico:** El endpoint `/api/health` monitorea la propia salud de la clínica en tiempo real
- 🌍 **Soberanía de datos:** Todo desplegado en Europa, sin dependencia de nubes de terceros

---

## 🛠️ Tecnologías

| Capa                | Tecnología               | Rol                                       |
| ------------------- | ------------------------ | ----------------------------------------- |
| 🧠 **Cerebro**      | Next.js 15 + PostgreSQL  | Frontend, API Routes e histórico de salud |
| ⚙️ **Especialista** | n8n                      | Worker de monitoreo y scheduler de rondas |
| 🤖 **Diagnóstico**  | Llama 3 70B (Groq)       | Análisis forense profundo — Nivel Rojo    |
| 🔬 **Triage**       | Gemini 1.5 Flash         | Análisis de tendencias — Nivel Ámbar      |
| 🎨 **Interfaz**     | Tailwind CSS + shadcn/ui | Diseño limpio, tipo clínica               |
| 🚀 **Despliegue**   | Coolify + CubePath       | CI/CD continuo sobre VPS Nano             |

---

## 🚀 Acceso

| Recurso               | URL                                                                          |
| --------------------- | ---------------------------------------------------------------------------- |
| 🌐 Aplicación en vivo | [diagnosta.botgrilo.es](https://diagnosta.botgrilo.es)                       |


---

<div align="center">

_Hecho con 🩺 por [José Grillo](https://josegrillo.vercel.app/)_

</div>
