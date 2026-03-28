FROM node:20-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json package-lock.json ./

# Instalamos dependencias limpias
RUN npm install

# Copiamos el resto del código
COPY . .

# Deshabilitamos la telemetría de Next.js para acelerar el build
ENV NEXT_TELEMETRY_DISABLED=1

# Construimos la app
RUN npm run build

# Exponemos el puerto de Next.js
EXPOSE 3000

# Iniciamos el servidor de producción
CMD ["npm", "start"]
