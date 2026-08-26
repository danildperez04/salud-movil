import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { api, ApiError } from '../../lib/api';
import type { PublicCaregiverDetail, PublicPatientLink } from '../../types';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

export default function CaregiverDetail() {
  const { id } = useParams<{ id: string }>();
  const [caregiver, setCaregiver] = useState<PublicCaregiverDetail | null>(null);
  const [patients, setPatients] = useState<PublicPatientLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    const caregiverId = id;
    let cancelled = false;
    async function load() {
      try {
        const [caregiverData, patientsData] = await Promise.all([
          api.getCaregiver(caregiverId),
          api.getCaregiverPatients(caregiverId),
        ]);
        if (cancelled) {
          return;
        }
        setCaregiver(caregiverData);
        setPatients(patientsData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'No se pudo cargar la información del cuidador',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const patientColumns: Column<PublicPatientLink>[] = [
    {
      header: 'Nombre',
      render: (row) => (
        <div>
          <Link
            to={`/patients/${row.patientId}`}
            className='font-medium text-primary hover:underline'
          >
            {row.patientName}
          </Link>
          <p className='text-xs text-slate-500'>{row.patientEmail}</p>
        </div>
      ),
    },
    {
      header: 'Parentesco',
      render: (row) => (
        <span className='text-slate-700'>{row.relationshipTypeName}</span>
      ),
    },
    {
      header: 'Principal',
      render: (row) =>
        row.isPrimary ? (
          <Badge variant='success'>Sí</Badge>
        ) : (
          <span className='text-slate-500'>No</span>
        ),
    },
    {
      header: 'Vinculado desde',
      render: (row) => (
        <span className='text-slate-700'>{row.dateLink}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
    );
  }

  if (error) {
    return <Alert>{error}</Alert>;
  }

  if (!caregiver) {
    return <Alert>Cuidador no encontrado</Alert>;
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>
            {caregiver.name}
          </h1>
          <p className='text-sm text-slate-500'>{caregiver.email}</p>
        </div>
        <Link
          to={`/caregivers/${caregiver.id}/edit`}
          className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'
        >
          Editar
        </Link>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <Card title='Datos personales'>
          <dl className='grid gap-3 text-sm'>
            <div>
              <dt className='font-medium text-slate-500'>Nombre de usuario</dt>
              <dd className='text-slate-900'>{caregiver.username}</dd>
            </div>
            <div>
              <dt className='font-medium text-slate-500'>Teléfono</dt>
              <dd className='text-slate-900'>{caregiver.phoneNumber}</dd>
            </div>
            <div>
              <dt className='font-medium text-slate-500'>Cédula</dt>
              <dd className='text-slate-900'>{caregiver.dni ?? '—'}</dd>
            </div>
            <div>
              <dt className='font-medium text-slate-500'>Dirección</dt>
              <dd className='text-slate-900'>{caregiver.address}</dd>
            </div>
            <div>
              <dt className='font-medium text-slate-500'>Estado</dt>
              <dd>
                {caregiver.isActive ? (
                  <Badge variant='success'>Activo</Badge>
                ) : (
                  <Badge variant='danger'>Inactivo</Badge>
                )}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title='Pacientes vinculados'>
        <Table
          columns={patientColumns}
          rows={patients}
          rowKey={(row) => row.patientId}
          emptyMessage='Este cuidador no tiene pacientes vinculados'
        />
      </Card>
    </div>
  );
}
