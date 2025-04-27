# ─── STAGE 1: Build con Node.js ──────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

# Instala dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copia el resto y genera la build
COPY . .
RUN npm run build

# ─── STAGE 2: Servir con Nginx ──────────────────────────
FROM nginx:stable-alpine

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia tus ficheros de configuración
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia el build de la app al directorio público
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

