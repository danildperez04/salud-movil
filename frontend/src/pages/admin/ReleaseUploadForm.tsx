import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
import { formatBytes } from '../../lib/format';
import {
  MAX_UPLOAD_MB,
  PLATFORMS,
  PLATFORM_EXTENSIONS,
  PLATFORM_LABELS,
} from '../../lib/releases';
import type { AdminRelease, ReleasePlatform } from '../../types';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

// Igual que el API (CreateReleaseDto): 1.2.3 o 1.2.3-beta.1.
const VERSION = /^\d{1,4}\.\d{1,4}\.\d{1,4}(?:[-+][0-9A-Za-z.-]{1,20})?$/;

interface Props {
  onUploaded: (release: AdminRelease) => void;
}

export function ReleaseUploadForm({ onUploaded }: Props) {
  const [platform, setPlatform] = useState<ReleasePlatform>('android');
  const [version, setVersion] = useState('');
  const [notes, setNotes] = useState('');
  const [publish, setPublish] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ version?: string; file?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const uploading = progress !== null;
  const extension = PLATFORM_EXTENSIONS[platform];

  function validate() {
    const found: typeof errors = {};
    if (!VERSION.test(version.trim())) {
      found.version = 'Usa el formato 1.2.3 (opcional: 1.2.3-beta.1)';
    }
    if (!file) {
      found.file = 'Selecciona el instalable';
    } else if (!file.name.toLowerCase().endsWith(extension)) {
      found.file = `Para ${PLATFORM_LABELS[platform]} el archivo debe ser un ${extension}`;
    } else if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      found.file = `El archivo supera el máximo de ${MAX_UPLOAD_MB} MB`;
    }
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  function changePlatform(next: ReleasePlatform) {
    setPlatform(next);
    // El archivo elegido ya no corresponde a la plataforma nueva.
    setFile(null);
    setErrors({});
    if (fileInput.current) fileInput.current.value = '';
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (uploading || !validate() || !file) return;

    const form = new FormData();
    form.append('platform', platform);
    form.append('version', version.trim());
    if (notes.trim()) form.append('notes', notes.trim());
    form.append('isPublished', String(publish));
    // El archivo va al final: el servidor ya tiene los campos cuando lo recibe.
    form.append('file', file);

    setFormError(null);
    setProgress(0);
    abort.current = new AbortController();
    try {
      const release = await api.uploadRelease(form, {
        onProgress: setProgress,
        signal: abort.current.signal,
      });
      onUploaded(release);
      setVersion('');
      setNotes('');
      setFile(null);
      if (fileInput.current) fileInput.current.value = '';
    } catch (err) {
      // Cancelar no es un error que mostrar.
      if (!abort.current.signal.aborted) {
        setFormError(
          err instanceof ApiError ? err.message : 'No se pudo subir el instalable',
        );
      }
    } finally {
      setProgress(null);
      abort.current = null;
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className='flex flex-col gap-4'>
      {formError ? <Alert>{formError}</Alert> : null}

      <div className='grid gap-4 sm:grid-cols-2'>
        <Select
          label='Plataforma'
          value={platform}
          disabled={uploading}
          onChange={(event) => changePlatform(event.target.value as ReleasePlatform)}
        >
          {PLATFORMS.map((value) => (
            <option key={value} value={value}>
              {PLATFORM_LABELS[value]} ({PLATFORM_EXTENSIONS[value]})
            </option>
          ))}
        </Select>
        <Input
          label='Versión'
          value={version}
          disabled={uploading}
          placeholder='1.2.0'
          maxLength={40}
          error={errors.version}
          onChange={(event) => setVersion(event.target.value)}
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <label htmlFor='release-file' className='font-body text-sm font-medium text-text'>
          Instalable ({extension})
        </label>
        <input
          ref={fileInput}
          id='release-file'
          type='file'
          accept={extension}
          disabled={uploading}
          aria-invalid={Boolean(errors.file)}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setErrors((current) => ({ ...current, file: undefined }));
          }}
          className='block w-full rounded-lg border border-line px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-mint-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-dark'
        />
        {file ? (
          <span className='text-xs text-slate-500'>
            {file.name} · {formatBytes(file.size)}
          </span>
        ) : null}
        {errors.file ? <span className='text-sm text-red-600'>{errors.file}</span> : null}
      </div>

      <div className='flex flex-col gap-1.5'>
        <label htmlFor='release-notes' className='font-body text-sm font-medium text-text'>
          Notas de la versión (opcional)
        </label>
        <textarea
          id='release-notes'
          rows={3}
          maxLength={2000}
          value={notes}
          disabled={uploading}
          onChange={(event) => setNotes(event.target.value)}
          className='rounded-lg border border-line px-3 py-2.5 font-body text-text focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15'
        />
      </div>

      <label className='flex items-center gap-2 text-sm text-slate-700'>
        <input
          type='checkbox'
          checked={publish}
          disabled={uploading}
          onChange={(event) => setPublish(event.target.checked)}
          className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30'
        />
        Publicar de inmediato (la página pública ofrecerá esta versión)
      </label>

      {uploading ? (
        <div>
          <div
            role='progressbar'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((progress ?? 0) * 100)}
            className='h-2 overflow-hidden rounded-full bg-slate-100'
          >
            <div
              className='h-full rounded-full bg-primary transition-[width] duration-200'
              style={{ width: `${Math.round((progress ?? 0) * 100)}%` }}
            />
          </div>
          <p className='mt-1.5 text-xs text-slate-500'>
            {progress !== null && progress >= 1
              ? 'Procesando el archivo…'
              : `Subiendo… ${Math.round((progress ?? 0) * 100)}%`}
          </p>
        </div>
      ) : null}

      <div className='flex justify-end gap-3'>
        {uploading ? (
          <Button type='button' variant='secondary' onClick={() => abort.current?.abort()}>
            <X size={16} aria-hidden='true' />
            Cancelar
          </Button>
        ) : null}
        <Button type='submit' loading={uploading}>
          {uploading ? null : <Upload size={16} aria-hidden='true' />}
          Subir versión
        </Button>
      </div>
    </form>
  );
}
