#!/usr/bin/env bash
#
# Verifica que el panel no vuelva a mostrar datos clínicos inventados.
#
# `src/lib/ipcp.ts` es el único mock del IPCP que quedó en el repo: devuelve un
# hash del UUID del paciente, es decir prioridad clínica inventada para personas
# reales. Se conserva a propósito como registro (está en la lista de fuera del
# MVP del plan de cierre), pero nada debe importarlo.
#
# Fallar aquí es preferible a fallar en una demo delante del jurado.
#
# Nota: este guardia solo cubre el IPCP. Reintroducir un indicador ficticio
# ("SatO₂", "Frecuencia cardiaca" — no existen en `cat_type_indicator`) no lo
# detecta, porque no hay forma fiable de distinguir un dato inventado de un
# comentario que lo menciona como histórico. Queda como revisión manual.
set -euo pipefail

cd "$(dirname "$0")/.."

MOCK="src/lib/ipcp.ts"

if rg -l --fixed-strings "lib/ipcp" src --glob "!$MOCK" >/dev/null 2>&1; then
  echo "⛔ Algo sigue importando el mock del IPCP ($MOCK):" >&2
  rg -l --fixed-strings "lib/ipcp" src --glob "!$MOCK" >&2
  echo >&2
  echo "   El IPCP real está en GET /patients/:id/ipcp y se consume con" >&2
  echo "   api.getPatientIpcp(id) (ver patient-detail/IpcpCard.tsx)." >&2
  exit 1
fi

echo "✔ Sin mocks clínicos en el panel."