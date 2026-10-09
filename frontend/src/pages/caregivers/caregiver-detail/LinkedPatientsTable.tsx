import { useState } from "react";
import { Link } from "react-router";
import type { PublicPatientLink } from "../../../types";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { ConfirmDeleteModal } from "../../../components/ui/ConfirmDeleteModal";

interface LinkedPatientsTableProps {
  patients: PublicPatientLink[];
  /** Se invoca al confirmar el desvínculo. Quien lo llama refresca la lista. */
  onUnlink: (patientId: string) => Promise<void>;
}

export function LinkedPatientsTable({
  patients,
  onUnlink,
}: LinkedPatientsTableProps) {
  const [toUnlink, setToUnlink] = useState<PublicPatientLink | null>(null);
  const [saving, setSaving] = useState(false);

  const confirmUnlink = async () => {
    if (!toUnlink) return;
    setSaving(true);
    try {
      await onUnlink(toUnlink.patientId);
      setToUnlink(null);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<PublicPatientLink>[] = [
    {
      header: "Nombre",
      render: (row) => (
        <div>
          <Link
            to={`/app/patients/${row.patientId}`}
            className="font-medium text-primary hover:underline"
          >
            {row.patientName}
          </Link>
          <p className="text-xs text-slate-500">{row.patientEmail}</p>
        </div>
      ),
    },
    {
      header: "Parentesco",
      render: (row) => (
        <span className="text-slate-700">{row.relationshipTypeName}</span>
      ),
    },
    {
      header: "Principal",
      render: (row) =>
        row.isPrimary ? (
          <Badge variant="success">Sí</Badge>
        ) : (
          <span className="text-slate-500">No</span>
        ),
    },
    {
      header: "Vinculado desde",
      render: (row) => <span className="text-slate-700">{row.dateLink}</span>,
    },
    {
      header: "",
      render: (row) => (
        <div className="text-right">
          <Button
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            onClick={() => setToUnlink(row)}
          >
            Desvincular
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card title="Pacientes vinculados">
        <Table
          columns={columns}
          rows={patients}
          rowKey={(row) => row.patientId}
          emptyMessage="Este cuidador no tiene pacientes vinculados"
        />
      </Card>
      {toUnlink ? (
        <ConfirmDeleteModal
          isOpen={!!toUnlink}
          title="Desvincular paciente"
          message={
            <>
              ¿Seguro que deseas desvincular a{" "}
              <strong>{toUnlink.patientName}</strong> de este cuidador? El
              paciente dejará de tener este apoyo asociado.
            </>
          }
          onCancel={() => setToUnlink(null)}
          onConfirm={confirmUnlink}
          loading={saving}
          confirmLabel="Desvincular"
        />
      ) : null}
    </>
  );
}