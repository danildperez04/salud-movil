import { useState } from "react";
import { UserPlus } from "lucide-react";
import type { PublicCaregiverLink } from "../../../types";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { getButtonClassName } from "../../../components/ui/buttonStyles";
import { LinkCaregiverModal } from "../../caregivers/caregiver-detail/LinkCaregiverModal";

interface CaregiverSummaryCardProps {
  patientId: string;
  caregivers: PublicCaregiverLink[];
  /** Tras vincular, el padre recarga los vínculos del paciente. */
  onLinked: () => void;
}

export function CaregiverSummaryCard({
  patientId,
  caregivers,
  onLinked,
}: CaregiverSummaryCardProps) {
  const [linking, setLinking] = useState(false);
  // Resumen rápido: el principal, o el primero vinculado. La gestión completa
  // (desvincular) vive en la ficha del cuidador.
  const primary =
    caregivers.find((link) => link.isPrimary) ?? caregivers[0] ?? null;

  return (
    <Card
      title="Cuidador / persona de apoyo"
      actions={
        <Button variant="secondary" onClick={() => setLinking(true)}>
          <UserPlus size={14} aria-hidden="true" />
          {primary ? "Cambiar" : "Vincular"}
        </Button>
      }
    >
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
      {linking ? (
        <LinkCaregiverModal
          patientId={patientId}
          linked={caregivers}
          onClose={() => setLinking(false)}
          onLinked={() => {
            setLinking(false);
            onLinked();
          }}
        />
      ) : null}
    </Card>
  );
}
