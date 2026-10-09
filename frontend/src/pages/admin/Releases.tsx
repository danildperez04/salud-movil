import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import { formatDateTime } from '../../lib/date';
import { formatBytes } from '../../lib/format';
import { PLATFORM_LABELS } from '../../lib/releases';
import type { AdminRelease, ReleasePlatform } from '../../types';
import { Alert } from '../../components/ui/Alert';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Table } from '../../components/ui/Table';
import type { Column } from '../../components/ui/Table';
import { ReleaseUploadForm } from './ReleaseUploadForm';

export default function Releases() {
  const [releases, setReleases] = useState<AdminRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<AdminRelease | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void api
      .listReleases()
      .then((list) => {
        if (!cancelled) setReleases(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'No se pudieron cargar las versiones',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // La página pública ofrece, por plataforma, la publicada más reciente. El
  // API devuelve la lista de la más nueva a la más vieja, así que es la primera.
  const currentIds = useMemo(() => {
    const seen = new Set<ReleasePlatform>();
    const ids = new Set<string>();
    for (const release of releases) {
      if (release.isPublished && !seen.has(release.platform)) {
        seen.add(release.platform);
        ids.add(release.id);
      }
    }
    return ids;
  }, [releases]);

  async function togglePublished(release: AdminRelease) {
    setBusyId(release.id);
    setError(null);
    try {
      const updated = await api.updateRelease(release.id, {
        isPublished: !release.isPublished,
      });
      setReleases((list) => list.map((r) => (r.id === updated.id ? updated : r)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar la versión');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deleteRelease(toDelete.id);
      setReleases((list) => list.filter((r) => r.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la versión');
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<AdminRelease>[] = [
    {
      header: 'Plataforma',
      render: (row) => (
        <span className='font-medium text-slate-900'>{PLATFORM_LABELS[row.platform]}</span>
      ),
    },
    {
      header: 'Versión',
      render: (row) => (
        <div>
          <p className='font-medium text-slate-900'>{row.version}</p>
          {row.notes ? (
            <p className='max-w-xs truncate text-xs text-slate-500' title={row.notes}>
              {row.notes}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      header: 'Archivo',
      render: (row) => (
        <div>
          <p className='text-slate-700'>{formatBytes(row.sizeBytes)}</p>
          <p className='font-mono text-xs text-slate-400' title={`SHA-256: ${row.sha256}`}>
            {row.sha256.slice(0, 12)}…
          </p>
        </div>
      ),
    },
    {
      header: 'Descargas',
      render: (row) => <span className='text-slate-700'>{row.downloadCount}</span>,
    },
    {
      header: 'Subida',
      render: (row) => (
        <span className='whitespace-nowrap text-slate-700'>
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Estado',
      render: (row) => (
        <div className='flex flex-col items-start gap-1'>
          <Badge variant={row.isPublished ? 'success' : 'neutral'}>
            {row.isPublished ? 'Publicada' : 'Sin publicar'}
          </Badge>
          {currentIds.has(row.id) ? <Badge variant='primary'>Vigente</Badge> : null}
        </div>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className='flex gap-3'>
          <button
            onClick={() => void togglePublished(row)}
            disabled={busyId === row.id}
            className='text-sm font-medium text-primary hover:underline disabled:opacity-50'
          >
            {row.isPublished ? 'Despublicar' : 'Publicar'}
          </button>
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
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Instaladores</h1>
        <p className='text-sm text-slate-500'>
          Versiones de la app para descargar desde la página pública. Para cada plataforma
          se ofrece la versión publicada más reciente (la marcada como «Vigente»).
        </p>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <Card title='Subir una versión'>
        <ReleaseUploadForm
          onUploaded={(release) => {
            setError(null);
            setReleases((list) => [release, ...list]);
          }}
        />
      </Card>

      <Card title='Versiones subidas'>
        {loading ? (
          <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
        ) : (
          <Table
            columns={columns}
            rows={releases}
            rowKey={(row) => row.id}
            emptyMessage='Aún no has subido ninguna versión'
          />
        )}
      </Card>

      <ConfirmDeleteModal
        isOpen={toDelete !== null}
        title='Eliminar versión'
        message={
          <>
            ¿Seguro que deseas eliminar la versión <strong>{toDelete?.version}</strong> de{' '}
            {toDelete ? PLATFORM_LABELS[toDelete.platform] : ''}? Se borrará también el
            archivo y dejará de poder descargarse.
          </>
        }
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
