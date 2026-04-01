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

### 🏠 Bienvenido a la Clínica — Landing Page
*La puerta de entrada a Diagnosta. Presenta la propuesta de valor antes de acceder al sistema.*

![Landing Page](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/1.png)


### 🖥️ Panel de Control
*Centro de mando principal. Visión global del estado de todos tus pacientes (APIs) en tiempo real.*

![Panel de Control](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/2.png)


### 🌐 Red Global de Monitoreo
*Mapa de conectividad y estado de los endpoints monitoreados a nivel global.*

![Red Global](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/3.png)


### 🩻 Informe del Dr. Grilo
*Diagnóstico generado por IA en lenguaje humano: qué falló, por qué ocurrió y cómo curarlo.*

![Informe del Dr. Grilo](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/4.png)


### ⚙️ Alta de Paciente — Configuración de APIs del Cliente
*Formulario de ingreso donde el cliente registra las APIs que desea monitorear.*

![Alta de Paciente](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/5.png)


### 👁️ Ayudas Visuales — Modo Guía
*Interruptor para activar o desactivar las anotaciones visuales en pantalla.*

![Ayudas Visuales](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/6.png)


### 🫀 Pilares de Referencia — Vista Compacta
*Panel para mostrar u ocultar los 6 Pilares de referencia que sirven como línea base de salud.*

![Pilares de Referencia](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/7.png)


### 📅 Última Ronda Médica
*Registro de la última revisión automática. El Dr. Grilo pasa revista cada 5 minutos.*

![Última Ronda Médica](https://raw.githubusercontent.com/botGrilo/diagnosta/main/assets/8.png)


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

# V I D E O     D E M O   

[![Ver demo en YouTube](https://img.youtube.com/vi/sXx-ZUWwUrQ/maxresdefault.jpg)](https://youtu.be/sXx-ZUWwUrQ?si=ZuSh9Rxh49NTKr79)

---

<div align="center">

_Hecho con 🩺 por [José Grillo](https://josegrillo.vercel.app/)_

</div>
