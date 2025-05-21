FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar solo los archivos de configuración primero
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Verificar que los archivos necesarios existen
RUN test -f vite.config.ts || (echo "vite.config.ts no encontrado" && exit 1)

# Exponer el puerto
EXPOSE 5173

# Configurar variables de entorno
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:3000

# Iniciar la aplicación
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 