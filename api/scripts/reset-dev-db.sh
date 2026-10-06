#!/usr/bin/env bash
#
# ⚠️  DESTRUCTIVO: borra la base de desarrollo y la reconstruye desde cero
#    (migraciones + seed). Todos los datos se pierden.
#
# ¿Cuándo hace falta? La base de desarrollo actual **nació de
# `synchronize: true`**, así que tiene el esquema correcto pero arrastra residuos
# de versiones anteriores de las entidades y no está registrada en la tabla
# `migrations`. Consecuencia práctica: `pnpm migration:run` apuntando a ella
# falla, porque las tablas ya existen.
#
# Verificado el 5-oct-2026: la diferencia entre el esquema real y el que produce
# la migración son 8 columnas huérfanas de entidades viejas (`deparment` —con
# falta de "t"—, más `municipality` y `role` con `id` uuid frente a las
# actuales `cat_municipality` y `cat_role` con `id` entero). `synchronize` nunca
# borra tablas ni columnas, así que se acumularon solas.
#
# Este script no se ejecuta solo. Se usa cuando se quiere una base limpia,
# aceptando perder los datos de prueba.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

DB_NAME="${DB_NAME:-salud_movil_db}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
export DB_NAME DB_USER DB_HOST DB_PORT
export PGPASSWORD="${DB_PASSWORD:-${PGPASSWORD:-}}"

echo "⚠️  Se va a BORRAR la base '$DB_NAME' en $DB_HOST:$DB_PORT."
if [ "${CONFIRM_RESET:-}" != "$DB_NAME" ]; then
  echo "   Para confirmar, exporta CONFIRM_RESET=$DB_NAME y vuelve a ejecutarlo."
  exit 1
fi

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -q -v ON_ERROR_STOP=1 <<SQL
DROP DATABASE IF EXISTS "$DB_NAME";
CREATE DATABASE "$DB_NAME";
SQL

echo "▸ Aplicando migraciones…"
pnpm migration:run

echo "▸ Las semillas se aplican al arrancar la API:"
echo "     pnpm start:dev"
echo ""
echo "✔ Base '$DB_NAME' reconstruida. Faltan las semillas hasta que arranque la API."