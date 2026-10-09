# syntax=docker/dockerfile:1
#
# Imagen del panel web: compila la SPA (Vite) y la sirve con nginx, que además
# actúa de reverse proxy hacia el API bajo /api (ver nginx/default.conf.template).

ARG NODE_VERSION=22
ARG PNPM_VERSION=11.20.0

# ---------------------------------------------------------------- build ------
FROM node:${NODE_VERSION}-alpine AS build
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

# El lockfile canónico es el de pnpm (el package-lock.json está obsoleto).
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# VITE_API_URL se incrusta en el bundle al compilar (no se puede cambiar en
# runtime). El valor por defecto, `/api`, es relativo: funciona en cualquier
# dominio o puerto porque nginx lo atiende en el mismo origen. Solo hay que
# cambiarlo si el API vive en otro dominio (y entonces configurar CORS_ORIGIN).
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm build

# -------------------------------------------------------------- runtime ------
# Variante sin privilegios de la imagen oficial: corre como usuario `nginx` y
# escucha en 8080, así que no necesita root ni capacidades especiales.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Valores por defecto; se pueden sobrescribir en runtime con `-e`.
#   API_UPSTREAM  URL interna del API (sin barra final).
#   DNS_RESOLVER  Resolver de DNS para resolver API_UPSTREAM (Docker: 127.0.0.11).
#   RELEASE_MAX_MB  Tamaño máximo (MB) al subir un instalable; igual que en el API.
ENV API_UPSTREAM=http://api:3000 \
    DNS_RESOLVER=127.0.0.11 \
    RELEASE_MAX_MB=500

COPY nginx/snippets/ /etc/nginx/snippets/
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
