import type { PublicCaregiverLink } from "../../../types";
import { Card } from "../../../components/ui/Card";
import { getButtonClassName } from "../../../components/ui/buttonStyles";

export function CaregiverSummaryCard({
  caregivers,
}: {
  caregivers: PublicCaregiverLink[];
}) {
  // Mostramos solo al cuidador principal (o el primero vinculado) como
  // resumen rápido. La gestión completa (buscar, vincular, desvincular)
  // sigue viviendo en la pestaña "Cuidadores", sin duplicar esa lógica aquí.
  const primary =
    caregivers.find((link) => link.isPrimary) ?? caregivers[0] ?? null;

  return (
    <Card title="Cuidador / persona de apoyo">
      {primary ? (
        <>
          <p className="font-body text-sm font-semibold text-navy">
            {primary.caregiverName}
          </p>
          <p className="mt-0.5 font-body text-xs text-muted">
            {primary.relationshipTypeName} · {primary.caregiverPhoneNumber}
          </p>
          <a
            href={`https://wa.me/505${primary.caregiverPhoneNumber.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className={getButtonClassName("secondary", "mt-4 w-full")}
          >
            WhatsApp cuidador
          </a>
        </>
      ) : (
        <p className="font-body text-sm text-muted">
          Este paciente no tiene un cuidador vinculado todavía.
        </p>
      )}
    </Card>
  );
}
