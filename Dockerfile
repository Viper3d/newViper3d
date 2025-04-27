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
# Borra la configuración por defecto (opcional)
RUN rm /etc/nginx/conf.d/default.conf

# Copia build al directorio público de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Arrancar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
