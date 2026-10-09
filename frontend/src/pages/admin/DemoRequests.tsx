import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import { formatDateTime } from '../../lib/date';
import {
  DEMO_STATUSES,
  DEMO_STATUS_LABELS,
  DEMO_STATUS_VARIANTS,
} from '../../lib/demoRequests';
import type {
  DemoRequest,
  DemoRequestPage,
  DemoRequestStats,
  DemoRequestStatus,
} from '../../types';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { DemoRequestDetailModal } from './DemoRequestDetailModal';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type StatusFilter = DemoRequestStatus | 'all';

export default function DemoRequests() {
  const [data, setData] = useState<DemoRequestPage | null>(null);
  const [stats, setStats] = useState<DemoRequestStats | null>(null);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DemoRequest | null>(null);
  const [toDelete, setToDelete] = useState<DemoRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Evita que una respuesta vieja pise la de un filtro más reciente.
  const requestIdRef = useRef(0);
  // El montaje no debe esperar el debounce; solo lo que se escribe después.
  const isFirstRunRef = useRef(true);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const [list, counts] = await Promise.all([
        api.listDemoRequests({
          status: status === 'all' ? undefined : status,
          search: search.trim(),
          page,
          pageSize: PAGE_SIZE,
        }),
        api.getDemoRequestStats(),
      ]);
      if (requestIdRef.current !== requestId) return;
      setData(list);
      setStats(counts);
    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError(
        err instanceof ApiError ? err.message : 'No se pudieron cargar las solicitudes',
      );
    } finally {
      if (requestIdRef.current === requestId) setLoading(false);
    }
  }, [status, search, page]);

  // Carga inicial + filtros. Solo la búsqueda espera el debounce; `load()`
  // siempre corre dentro del callback de `setTimeout`, nunca en el cuerpo.
  useEffect(() => {
    const delay = isFirstRunRef.current ? 0 : SEARCH_DEBOUNCE_MS;
    isFirstRunRef.current = false;
    const handle = setTimeout(() => void load(), delay);
    return () => clearTimeout(handle);
  }, [load]);

  function changeStatus(next: StatusFilter) {
    setStatus(next);
    setPage(1);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deleteDemoRequest(toDelete.id);
      setToDelete(null);
      setSelected(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la solicitud');
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  const total = data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const columns: Column<DemoRequest>[] = [
    {
      header: 'Solicitante',
      render: (row) => (
        <div>
          <p className='font-medium text-slate-900'>{row.name}</p>
          <p className='text-xs text-slate-500'>{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Institución',
      render: (row) => (
        <div>
          <p className='text-slate-700'>{row.organization}</p>
          {row.jobTitle ? <p className='text-xs text-slate-500'>{row.jobTitle}</p> : null}
        </div>
      ),
    },
    {
      header: 'Recibida',
      render: (row) => (
        <span className='whitespace-nowrap text-slate-700'>
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Estado',
      render: (row) => (
        <Badge variant={DEMO_STATUS_VARIANTS[row.status]}>
          {DEMO_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <button
          onClick={() => setSelected(row)}
          className='text-sm font-medium text-primary hover:underline'
        >
          Ver detalle
        </button>
      ),
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Solicitudes de demo</h1>
        <p className='text-sm text-slate-500'>
          Personas que pidieron una demostración desde la página pública.
        </p>
      </div>

      <div className='flex flex-wrap gap-2' role='group' aria-label='Filtrar por estado'>
        {(['all', ...DEMO_STATUSES] as StatusFilter[]).map((value) => {
          const active = status === value;
          const count =
            value === 'all'
              ? stats && DEMO_STATUSES.reduce((sum, s) => sum + stats[s], 0)
              : stats?.[value];
          return (
            <button
              key={value}
              onClick={() => changeStatus(value)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? 'border-primary bg-mint-soft text-primary-dark'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {value === 'all' ? 'Todas' : DEMO_STATUS_LABELS[value]}
              {count !== undefined && count !== null ? (
                <span className='ml-1.5 text-xs text-slate-500'>{count}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <input
        type='search'
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
        placeholder='Buscar por nombre, correo o institución…'
        className='w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
      />

      {error ? <Alert>{error}</Alert> : null}

      <Card>
        {loading && !data ? (
          <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
        ) : (
          <div className={loading ? 'opacity-60 transition' : 'transition'}>
            <Table
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(row) => row.id}
              emptyMessage={
                status === 'all' && !search.trim()
                  ? 'Aún no hay solicitudes'
                  : 'Ninguna solicitud coincide con el filtro'
              }
            />
          </div>
        )}
        {total > 0 ? (
          <div className='mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500'>
            <span>
              Mostrando {from}–{to} de {total}
            </span>
            <div className='flex gap-2'>
              <Button
                variant='secondary'
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant='secondary'
                disabled={page >= lastPage || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      {selected ? (
        <DemoRequestDetailModal
          // La `key` reinicia el borrador de estado y notas al abrir otra solicitud.
          key={selected.id}
          request={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            void load();
          }}
          onDelete={setToDelete}
        />
      ) : null}

      <ConfirmDeleteModal
        isOpen={toDelete !== null}
        title='Eliminar solicitud'
        message={
          <>
            ¿Seguro que deseas eliminar la solicitud de{' '}
            <strong>{toDelete?.name}</strong>? Esta acción no se puede deshacer.
          </>
        }
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
