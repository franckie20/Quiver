# ==========================================
# Stage 1: Build Angular Frontend
# ==========================================
FROM node:26-alpine AS frontend-builder
WORKDIR /app

# Kopieer package files vanuit de frontend map
COPY frontend/package*.json ./
RUN npm ci

# Kopieer de rest van de frontend broncode
COPY frontend/ ./

# Bouw de Angular app voor productie (zorg dat de build-opdracht overeenkomt met je package.json scripts)
RUN npm run build -- --configuration production

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Kopieer de gebouwde Angular bestanden
COPY --from=frontend-builder /app/dist/quiver-app/browser /usr/share/nginx/html

# Kopieer onze custom Nginx configuratie naar de conf.d map van Nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
