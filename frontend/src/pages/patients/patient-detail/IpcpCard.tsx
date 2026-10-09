import { useEffect, useState } from "react";
import { Activity, ChevronDown, ChevronRight, Info } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Alert } from "../../../components/ui/Alert";
import { IpcpBadge } from "../../../components/patients/IpcpBadge";
import { api, ApiError } from "../../../lib/api";
import { formatDateTime } from "../../../lib/date";
import type { IpcpComponent, PublicIpcp } from "../../../types";

/**
 * Componentes del IPCP: qué puntúa, con qué peso y por qué.
 *
 * Mostrar el desglose es lo que hace el índice explicable: si el personal ve
 * "64 · Moderada" sin más, el número es una caja negra; con las variables a la
 * vista puede discutirlo con quien loogon.
 */
function ComponentRow({ component }: { component: IpcpComponent }) {
  const available = component.score !== null;
  const share = Math.round(component.effectiveWeight);

  return (
    <li className="py-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-body text-sm font-semibold text-navy">
          {component.label}
        </span>
        <span className="shrink-0 font-body text-xs text-muted">
          {available ? `${component.score}/100` : "sin datos"} · peso {share}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            available
              ? component.score! >= 70
                ? "bg-red-400"
                : component.score! >= 40
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              : "bg-slate-200"
          }`}
          style={{ width: `${available ? component.score! : 0}%` }}
        />
      </div>
      <p className="mt-1.5 font-body text-xs text-muted">
        {available ? component.detail : component.unavailableReason}
      </p>
    </li>
  );
}

/**
 * Índice Prioritario de Control de Pacientes, desde `GET /patients/:id/ipcp`.
 *
 * Reemplaza al score simulado que era un hash del UUID del paciente: ese
 * número no leía ningún dato clínico y no se podía reproducir.
 *
 * ⚠️ Pesos y cortes PROVISIONALES. El índice prioriza y apoya el seguimiento;
 * no diagnostica ni sustituye al médico.
 */
export function IpcpCard({ patientId }: { patientId: string }) {
  const [ipcp, setIpcp] = useState<PublicIpcp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getPatientIpcp(patientId)
      .then((data) => {
        if (active) {
          setIpcp(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo calcular el índice",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [patientId]);

  if (loading) {
    return (
      <Card title="Índice de prioridad (IPCP)">
        <p className="py-4 text-center font-body text-sm text-muted">
          Calculando…
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Índice de prioridad (IPCP)">
        <Alert>{error}</Alert>
      </Card>
    );
  }

  if (!ipcp) {
    return null;
  }

  const available = ipcp.components.filter((c) => c.score !== null);

  return (
    <Card title="Índice de prioridad (IPCP)">
      <div className="flex flex-wrap items-center gap-3">
        <IpcpBadge score={ipcp.score} level={ipcp.level} />
        <span className="font-body text-xs text-muted">
          {available.length} de {ipcp.components.length} variables con datos
          {ipcp.computedFrom
            ? ` · última lectura ${formatDateTime(ipcp.computedFrom)}`
            : ""}
        </span>
      </div>

      {available.length === 0 ? (
        <p className="mt-3 font-body text-sm text-muted">
          Este paciente todavía no tiene datos suficientes para calcular el
          índice. El score es 0 porque ninguna variable puntúa, no porque esté
          en buen estado.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {ipcp.components.map((component) => (
            <ComponentRow key={component.key} component={component} />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-3 inline-flex items-center gap-1 font-body text-xs font-medium text-primary hover:underline"
      >
        {expanded ? (
          <ChevronDown size={14} aria-hidden="true" />
        ) : (
          <ChevronRight size={14} aria-hidden="true" />
        )}
        {expanded ? "Ocultar notas del cálculo" : "Ver cómo se calcula"}
      </button>

      {expanded ? (
        <div className="mt-3 space-y-2 rounded-xl bg-mint-soft/60 p-3">
          <p className="flex items-start gap-1.5 font-body text-xs text-primary-dark">
            <Activity size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>
              Es una regla determinista sobre datos medidos, no un modelo de
              IA: la misma información produce siempre el mismo score. Las
              variables sin datos no cuentan como 0, el resto se reescala.
            </span>
          </p>
          {ipcp.exclusions.map((exclusion) => (
            <p
              key={exclusion}
              className="flex items-start gap-1.5 font-body text-xs text-muted"
            >
              <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>{exclusion}</span>
            </p>
          ))}
          <p className="font-body text-xs text-muted">
            ⚠️ Pesos y cortes <strong>provisionales</strong>: pendientes de
            validación médica. No use este índice para priorizar pacientes reales
            hasta que el equipo clínico los confirme.
          </p>
        </div>
      ) : null}
    </Card>
  );
}