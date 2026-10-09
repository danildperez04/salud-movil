#!/bin/sh
# Aplica las migraciones pendientes y arranca la API.
#
# El esquema lo gobiernan las migraciones (`synchronize: false`), así que un
# contenedor nuevo sobre una base vacía no funcionaría sin este paso. Se ejecuta
# la CLI de TypeORM sobre el JavaScript compilado (`dist/data-source.js`): la
# imagen no lleva ts-node ni devDependencies.
#
# RUN_MIGRATIONS=false lo desactiva (p. ej. si las migraciones se aplican desde
# un job aparte, o con varias réplicas arrancando a la vez).
set -eu

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  attempts="${MIGRATION_RETRIES:-10}"
  n=1
  until node node_modules/typeorm/cli.js migration:run -d dist/data-source.js; do
    if [ "$n" -ge "$attempts" ]; then
      echo "No se pudieron aplicar las migraciones tras $attempts intentos." >&2
      exit 1
    fi
    echo "Migraciones fallidas (intento $n/$attempts); reintentando en 3 s..." >&2
    n=$((n + 1))
    sleep 3
  done
fi

exec "$@"
