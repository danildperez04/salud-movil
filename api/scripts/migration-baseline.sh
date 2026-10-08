#!/usr/bin/env bash
#
# Genera (o regenera) la migración baseline contra una base de datos VACÍA.
#
# Por qué este script existe: la base de desarrollo se creó con
# `synchronize: true`. Si `migration:generate` apuntara a ella, TypeORM no
# encontraría diferencias y escribiría una migración vacía, que al aplicarse en
# otra base no crearía ninguna tabla. El baseline **debe** generarse contra una
# base que no existe todavía.
#
# La base temporal se descarta al terminar. La de desarrollo no se toca nunca.
#
# Uso:  bash scripts/migration-baseline.sh
set -euo pipefail

cd "$(dirname "$0")/.."

# 1. Credenciales primero, desde el `.env` del proyecto si existe.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

# 2. El nombre de la base se fija DESPUÉS, para que el `.env` no pueda devolver
#    la herramienta a la base real: generar el baseline contra la base viva
#    produciría una migración vacía y, con `synchronize` de por medio, riesgo de
#    daños inesperados.
DB_NAME="${MIGRATION_BASELINE_DB:-salud_movil_migration_tmp}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
export DB_NAME DB_USER DB_HOST DB_PORT
# `psql` lee la contraseña de PGPASSWORD; el resto de la API, de DB_PASSWORD.
export PGPASSWORD="${DB_PASSWORD:-${PGPASSWORD:-}}"

STAMP=$(date +%Y%m%d%H%M%S)

cleanup() {
  # La base de verificación se elimina pase lo que pase.
  [ -n "${VERIFY_DB:-}" ] && psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
    -d postgres -q -c "DROP DATABASE IF EXISTS \"$VERIFY_DB\";" >/dev/null 2>&1
  return 0
}
trap cleanup EXIT

echo "▸ Credenciales: $DB_USER@$DB_HOST:$DB_PORT"
echo "▸ Baseline contra la base vacía '$DB_NAME' (no se toca '$DB_NAME' del .env)."

# Si la base existe de una corrida anterior, se borra: garantiza que el diff
# sea el esquema completo y no un parche.
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -q -v ON_ERROR_STOP=1 <<SQL
DROP DATABASE IF EXISTS "$DB_NAME";
CREATE DATABASE "$DB_NAME";
SQL

# En TypeORM 1.x la ruta es un argumento **posicional** y es la del archivo, no
# un directorio. Si se omite, el archivo cae en la raíz del proyecto, fuera del
# glob de `migrations` del datasource, y `migration:run` responde "No migrations
# are pending" sin fallar de forma visible.
pnpm migration:generate "src/database/migrations/InitialSchema-${STAMP}"

echo ""
echo "▸ Verificando que la migración reconstruye el esquema en otra base vacía…"

VERIFY_DB="${DB_NAME}_verify"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -q -v ON_ERROR_STOP=1 <<SQL
DROP DATABASE IF EXISTS "$VERIFY_DB";
CREATE DATABASE "$VERIFY_DB";
SQL

DB_NAME="$VERIFY_DB" pnpm migration:run

echo ""
echo "▸ Tablas que la migración crea:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$VERIFY_DB" -t -A -c \
  "SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name;" | sed 's/^/   /'

echo ""
echo "✔ Baseline generado y verificado. Revísalo antes de commitear:"
echo "   git diff --stat src/database/migrations/"
echo "   El nombre de la migración incluye el timestamp: renómbralo a InitialSchema"
echo "   si no quieres que cambie en cada regeneración."