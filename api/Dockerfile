# syntax=docker/dockerfile:1
#
# Imagen de producción del API (NestJS). Multi-etapa: el compilador y las
# devDependencies se quedan en la etapa de build; la imagen final solo lleva
# `dist/` y las dependencias de producción.

ARG NODE_VERSION=22
# Misma versión que `packageManager` en package.json.
ARG PNPM_VERSION=11.20.0

# ---------------------------------------------------------------- build ------
FROM node:${NODE_VERSION}-alpine AS build
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

# Primero solo los manifiestos: mientras no cambien, la capa de dependencias
# se reutiliza de la caché. `pnpm-workspace.yaml` aprueba el build nativo de
# bcrypt (`allowBuilds`); sin él pnpm ≥ 10 no deja correr su instalación.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN pnpm build && pnpm prune --prod

# -------------------------------------------------------------- runtime ------
FROM node:${NODE_VERSION}-alpine AS runtime
# tini hace de PID 1: reenvía SIGTERM a Node y recoge procesos zombi, de modo
# que `docker stop` cierra la API limpiamente en lugar de esperar 10 s al SIGKILL.
RUN apk add --no-cache tini
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
COPY --chown=node:node docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER node
EXPOSE 3000

# `/health` comprueba también la conexión a la base de datos.
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--", "./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
