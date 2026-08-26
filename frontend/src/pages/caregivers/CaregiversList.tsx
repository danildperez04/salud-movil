import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, ApiError } from '../../lib/api';
import type { PublicCaregiver } from '../../types';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';

export default function CaregiversList() {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState<PublicCaregiver[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<PublicCaregiver | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadCaregivers().then(() => {
      if (cancelled) {
        return;
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCaregivers() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchCaregivers(query.trim());
      setCaregivers(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudieron cargar los cuidadores',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCaregivers();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }
    setDeleting(true);
    try {
      await api.deleteCaregiver(toDelete.id);
      setToDelete(null);
      await loadCaregivers();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo eliminar al cuidador',
      );
      setDeleting(false);
    }
  }

  const columns: Column<PublicCaregiver>[] = [
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
      header: 'Teléfono',
      render: (row) => (
        <span className='text-slate-700'>{row.phoneNumber}</span>
      ),
    },
    {
      header: 'Cédula',
      render: (row) => (
        <span className='text-slate-700'>{row.dni ?? '—'}</span>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className='flex gap-2'>
          <Link
            to={`/caregivers/${row.id}`}
            className='text-sm font-medium text-slate-600 hover:underline'
          >
            Ver
          </Link>
          <Link
            to={`/caregivers/${row.id}/edit`}
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
        <h1 className='text-2xl font-bold text-slate-900'>Cuidadores</h1>
        <Button onClick={() => navigate('/caregivers/new')}>
          Nuevo cuidador
        </Button>
      </div>
      <input
        type='search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Buscar por nombre, correo, usuario o cédula…'
        className='w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
      />
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        {loading ? (
          <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
        ) : (
          <Table
            columns={columns}
            rows={caregivers}
            rowKey={(row) => row.id}
            emptyMessage='No hay cuidadores registrados'
          />
        )}
      </Card>
      {toDelete ? (
        <Modal
          title='Eliminar cuidador'
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
            <strong>{toDelete.name}</strong>? El cuidador quedará desactivado y
            no podrá iniciar sesión en la aplicación móvil.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
