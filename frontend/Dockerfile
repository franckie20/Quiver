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

# Kopieer de gebouwde Angular bestanden naar de Nginx public map
# (Let op: vervang 'your-angular-project-name' door de naam van de outputmap in je 'dist' folder,
#  meestal is dit je projectnaam of 'browser')
COPY --from=frontend-builder /app/dist/quiver-app/browser /usr/share/nginx/html

# Kopieer onze custom Nginx configuratie
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
