import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, ApiError } from '../../lib/api';
import { useAuthStore } from '../../store/auth';
import type { PublicPatient } from '../../types';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';

export default function PatientsList() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  const [patients, setPatients] = useState<PublicPatient[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<PublicPatient | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load(search?: string) {
    setLoading(true);
    setError(null);
    try {
      setPatients(await api.listPatients(search));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cargar los pacientes',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    void api
      .listPatients()
      .then((patients) => {
        if (!cancelled) {
          setPatients(patients);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'No se pudo cargar los pacientes',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load(query.trim() || undefined);
  }

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }
    setDeleting(true);
    try {
      await api.deletePatient(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo eliminar al paciente',
      );
      setDeleting(false);
    }
  }

  const columns: Column<PublicPatient>[] = [
    {
      header: 'Nombre',
      render: (row) => (
        <div>
          <p className='font-medium text-slate-900'>{row.name}</p>
          <p className='text-xs text-slate-500'>{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Edad',
      render: (row) => <span className='text-slate-700'>{ageOf(row.dateOfBirth)}</span>,
    },
    {
      header: 'Género',
      render: (row) => <span className='text-slate-700'>{row.genreName}</span>,
    },
    {
      header: 'Centro de salud',
      render: (row) => (
        <span className='text-slate-700'>{row.healthCenterName}</span>
      ),
    },
    {
      header: 'Estado',
      render: (row) =>
        row.isActive ? (
          <Badge variant='success'>Activo</Badge>
        ) : (
          <Badge variant='danger'>Inactivo</Badge>
        ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className='flex gap-2'>
          <Link
            to={`/patients/${row.id}`}
            className='text-sm font-medium text-primary hover:underline'
          >
            Ver
          </Link>
          <Link
            to={`/patients/${row.id}/edit`}
            className='text-sm font-medium text-primary hover:underline'
          >
            Editar
          </Link>
          {isAdmin ? (
            <button
              onClick={() => setToDelete(row)}
              className='text-sm font-medium text-red-600 hover:underline'
            >
              Eliminar
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold text-slate-900'>Pacientes</h1>
        <Button onClick={() => navigate('/patients/new')}>Nuevo paciente</Button>
      </div>
      <form onSubmit={handleSearch} className='flex gap-2'>
        <input
          type='search'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Buscar por nombre, correo, usuario o cédula…'
          className='w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
        />
        <Button type='submit' className='bg-slate-200 text-slate-700 hover:bg-slate-300'>
          Buscar
        </Button>
      </form>
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        {loading ? (
          <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
        ) : (
          <Table
            columns={columns}
            rows={patients}
            rowKey={(row) => row.id}
            emptyMessage='No hay pacientes registrados'
          />
        )}
      </Card>
      {toDelete ? (
        <Modal
          title='Eliminar paciente'
          onClose={() => setToDelete(null)}
          footer={
            <>
              <Button
                onClick={() => setToDelete(null)}
                className='bg-slate-200 text-slate-700 hover:bg-slate-300'
              >
                Cancelar
              </Button>
              <Button
                loading={deleting}
                onClick={confirmDelete}
                className='bg-red-600 hover:bg-red-700'
              >
                Eliminar
              </Button>
            </>
          }
        >
          <p className='text-sm text-slate-700'>
            ¿Seguro que deseas eliminar a <strong>{toDelete.name}</strong>? El
            paciente quedará desactivado y no podrá volver a iniciar sesión.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function ageOf(dateOfBirth: string): string {
  const birth = new Date(`${dateOfBirth.slice(0, 10)}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    years -= 1;
  }
  return years >= 0 ? `${years} años` : '—';
}
