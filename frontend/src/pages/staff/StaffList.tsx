import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, ApiError } from '../../lib/api';
import type { PublicStaff } from '../../types';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';

export default function StaffList() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<PublicStaff[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<PublicStaff | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void api
      .listUsers()
      .then((users) => {
        if (!cancelled) {
          setStaff(users.filter((user) => user.role === 'health_staff'));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'No se pudo cargar el personal',
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

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const users = await api.listUsers();
      setStaff(users.filter((user) => user.role === 'health_staff'));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cargar el personal',
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = staff.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()),
  );

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }
    setDeleting(true);
    try {
      await api.deleteUser(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo eliminar al usuario',
      );
      setDeleting(false);
    }
  }

  const columns: Column<PublicStaff>[] = [
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
      header: 'Centro de salud',
      render: (row) => (
        <span className='text-slate-700'>
          {row.healthcareWorker?.healthCenterName ?? '—'}
        </span>
      ),
    },
    {
      header: 'Especialidad',
      render: (row) => (
        <span className='text-slate-700'>
          {row.healthcareWorker?.majorName ?? '—'}
        </span>
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
            to={`/staff/${row.id}/edit`}
            className='text-sm font-medium text-primary hover:underline'
          >
            Editar
          </Link>
          <button
            onClick={() => setToDelete(row)}
            className='text-sm font-medium text-red-600 hover:underline'
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold text-slate-900'>Personal de salud</h1>
        <Button onClick={() => navigate('/staff/new')}>Nuevo personal</Button>
      </div>
      <input
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Buscar por nombre, correo o usuario…'
        className='w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
      />
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        {loading ? (
          <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
        ) : (
          <Table
            columns={columns}
            rows={filtered}
            rowKey={(row) => row.id}
            emptyMessage='No hay personal de salud registrado'
          />
        )}
      </Card>
      {toDelete ? (
        <Modal
          title='Eliminar personal'
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
            ¿Seguro que deseas eliminar a{' '}
            <strong>{toDelete.name}</strong>? El usuario quedará desactivado y no
            podrá volver a iniciar sesión.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
