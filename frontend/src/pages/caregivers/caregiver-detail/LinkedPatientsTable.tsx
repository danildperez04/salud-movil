import { Link } from "react-router";
import type { PublicPatientLink } from "../../../types";
import { Card } from "../../../components/ui/Card";
import { Table } from "../../../components/ui/Table";
import type { Column } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";

export function LinkedPatientsTable({
  patients,
}: {
  patients: PublicPatientLink[];
}) {
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
  ];

  return (
    <Card title="Pacientes vinculados">
      <Table
        columns={columns}
        rows={patients}
        rowKey={(row) => row.patientId}
        emptyMessage="Este cuidador no tiene pacientes vinculados"
      />
    </Card>
  );
}
