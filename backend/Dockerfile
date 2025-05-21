FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Configurar variables de entorno
ENV NODE_ENV=development
ENV PORT=3000
ENV MONGODB_URI=mongodb://mongodb:27017/encuestas_db

# Iniciar la aplicación
CMD ["npm", "run", "dev"]
