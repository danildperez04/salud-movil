import { Card } from "../../../components/ui/Card";
import { HealthIndicatorBar } from "../../../components/patients/HealthIndicatorBar";
import { getMockHealthIndicators } from "../../../lib/healthIndicators";

export function HealthIndicatorsCard({ patientId }: { patientId: string }) {
  const indicators = getMockHealthIndicators(patientId);

  return (
    <Card title="Indicadores de salud">
      <div className="flex flex-col divide-y divide-line">
        {indicators.map((indicator) => (
          <HealthIndicatorBar key={indicator.label} {...indicator} />
        ))}
      </div>
    </Card>
  );
}
