import { useState } from 'react';
import type { ReactNode } from 'react';
import { Mail, Phone } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatDateTime } from '../../lib/date';
import { DEMO_STATUSES, DEMO_STATUS_LABELS } from '../../lib/demoRequests';
import type { DemoRequest, DemoRequestStatus } from '../../types';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

interface Props {
  request: DemoRequest;
  onClose: () => void;
  /** Se llama con la solicitud ya guardada para que la lista se actualice. */
  onSaved: (updated: DemoRequest) => void;
  onDelete: (request: DemoRequest) => void;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
        {label}
      </dt>
      <dd className='mt-0.5 text-sm text-slate-900'>{children}</dd>
    </div>
  );
}

export function DemoRequestDetailModal({ request, onClose, onSaved, onDelete }: Props) {
  const [status, setStatus] = useState<DemoRequestStatus>(request.status);
  const [notes, setNotes] = useState(request.adminNotes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = status !== request.status || notes.trim() !== (request.adminNotes ?? '');

  async function save() {
    setSaving(true);
    setError(null);
    try {
      // Solo se envía lo que cambió: así no se pisan notas editadas por otra persona.
      const updated = await api.updateDemoRequest(request.id, {
        ...(status !== request.status ? { status } : {}),
        ...(notes.trim() !== (request.adminNotes ?? '') ? { adminNotes: notes.trim() } : {}),
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar los cambios');
      setSaving(false);
    }
  }

  return (
    <Modal
      title='Solicitud de demo'
      onClose={onClose}
      footer={
        <>
          <Button
            variant='ghost'
            onClick={() => onDelete(request)}
            className='mr-auto text-red-600 hover:bg-red-50'
          >
            Eliminar
          </Button>
          <Button variant='secondary' onClick={onClose}>
            Cerrar
          </Button>
          <Button loading={saving} disabled={!dirty} onClick={save}>
            Guardar cambios
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-5'>
        {error ? <Alert>{error}</Alert> : null}

        <dl className='grid gap-4 sm:grid-cols-2'>
          <Detail label='Nombre'>{request.name}</Detail>
          <Detail label='Institución'>{request.organization}</Detail>
          <Detail label='Cargo'>{request.jobTitle ?? '—'}</Detail>
          <Detail label='Recibida'>{formatDateTime(request.createdAt)}</Detail>
          <Detail label='Correo'>
            <a
              href={`mailto:${request.email}`}
              className='inline-flex items-center gap-1.5 text-primary hover:underline'
            >
              <Mail size={14} aria-hidden='true' />
              {request.email}
            </a>
          </Detail>
          <Detail label='Teléfono'>
            {request.phoneNumber ? (
              <a
                href={`tel:${request.phoneNumber.replace(/[^\d+]/g, '')}`}
                className='inline-flex items-center gap-1.5 text-primary hover:underline'
              >
                <Phone size={14} aria-hidden='true' />
                {request.phoneNumber}
              </a>
            ) : (
              '—'
            )}
          </Detail>
        </dl>

        <Detail label='Mensaje'>
          {request.message ? (
            <p className='whitespace-pre-wrap rounded-lg bg-slate-50 p-3'>
              {request.message}
            </p>
          ) : (
            '—'
          )}
        </Detail>

        <hr className='border-slate-200' />

        <Select
          label='Estado'
          value={status}
          onChange={(event) => setStatus(event.target.value as DemoRequestStatus)}
        >
          {DEMO_STATUSES.map((value) => (
            <option key={value} value={value}>
              {DEMO_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>

        <div className='flex flex-col gap-1'>
          <label htmlFor='admin-notes' className='text-sm font-medium text-slate-700'>
            Notas internas
          </label>
          <textarea
            id='admin-notes'
            rows={4}
            maxLength={2000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder='Solo las ve el equipo. Ej.: llamé el lunes, quedamos el jueves 10:00.'
            className='rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
        </div>
      </div>
    </Modal>
  );
}
