import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Alert } from "../../../components/ui/Alert";
import { HealthIndicatorBar } from "../../../components/patients/HealthIndicatorBar";
import { api, ApiError } from "../../../lib/api";
import { formatDateTime } from "../../../lib/date";
import type { PublicIndicatorSummary } from "../../../types";

/** Presión arterial se muestra como sistólica/diastólica; el resto, sola. */
function formatValue(indicator: PublicIndicatorSummary): string {
  const primary = indicator.value;
  if (indicator.valueSecondary !== null) {
    return `${primary}/${indicator.valueSecondary}`;
  }
  const decimals = indicator.measurementUnit === "°C" ? 1 : 0;
  return `${primary.toFixed(decimals)} ${indicator.measurementUnit}`;
}

/** El orden importa: primero lo crítico, para que salte a la vista. */
const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  alert: 1,
  normal: 2,
};

export function HealthIndicatorsCard({ patientId }: { patientId: string }) {
  const [indicators, setIndicators] = useState<PublicIndicatorSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getPatientHealthIndicatorsSummary(patientId)
      .then((data) => {
        if (active) {
          setIndicators(
            [...data].sort(
              (a, b) =>
                (SEVERITY_ORDER[a.severity ?? ""] ?? 3) -
                (SEVERITY_ORDER[b.severity ?? ""] ?? 3),
            ),
          );
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudieron cargar los indicadores",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [patientId]);

  return (
    <Card title="Indicadores de salud">
      {loading ? (
        <div className="flex flex-col divide-y divide-line">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-10 animate-pulse py-2.5" />
          ))}
        </div>
      ) : error ? (
        <Alert>{error}</Alert>
      ) : indicators.length === 0 ? (
        <p className="py-4 text-center font-body text-sm text-muted">
          Este paciente aún no tiene indicadores registrados.
        </p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-line">
            {indicators.map((indicator) => (
              <HealthIndicatorBar
                key={indicator.typeIndicatorId}
                label={indicator.typeIndicatorName}
                value={formatValue(indicator)}
                severity={indicator.severity}
                band={indicator.band}
                minValue={indicator.minValue}
                maxValue={indicator.maxValue}
              />
            ))}
          </div>
          <p className="mt-3 font-body text-xs text-muted">
            Último registro del{" "}
            {formatDateTime(indicators[0].dateHour)}
          </p>
        </>
      )}
    </Card>
  );
}