import type { PublicCaregiverDetail } from "../../../types";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

export function PersonalDataCard({
  caregiver,
}: {
  caregiver: PublicCaregiverDetail;
}) {
  return (
    <Card title="Datos personales">
      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-slate-500">Nombre de usuario</dt>
          <dd className="text-slate-900">{caregiver.username}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Teléfono</dt>
          <dd className="text-slate-900">{caregiver.phoneNumber}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Cédula</dt>
          <dd className="text-slate-900">{caregiver.dni ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Dirección</dt>
          <dd className="text-slate-900">{caregiver.address}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Estado</dt>
          <dd>
            {caregiver.isActive ? (
              <Badge variant="success">Activo</Badge>
            ) : (
              <Badge variant="danger">Inactivo</Badge>
            )}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
