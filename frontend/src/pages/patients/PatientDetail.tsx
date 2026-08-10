import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { api, ApiError } from '../../lib/api';
import { useCatalogueStore } from '../../store/catalogues';
import { useAuthStore } from '../../store/auth';
import type {
  PublicCaregiver,
  PublicCaregiverLink,
  PublicMedicalRecord,
  PublicPatient,
} from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

type Tab = 'datos' | 'expediente' | 'visitas' | 'cuidadores';

const TABS: { id: Tab; label: string }[] = [
  { id: 'datos', label: 'Datos' },
  { id: 'expediente', label: 'Expediente' },
  { id: 'visitas', label: 'Visitas' },
  { id: 'cuidadores', label: 'Cuidadores' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const EMPTY_RECORD_FORM = {
  primaryDiagnosis: '',
  medicalHistory: '',
  allergies: '',
  bloodType: '',
};

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const isStaff = currentUser?.role === 'health_staff';
  const loadRelationshipTypes = useCatalogueStore((s) => s.loadRelationshipTypes);

  const [patient, setPatient] = useState<PublicPatient | null>(null);
  const [record, setRecord] = useState<PublicMedicalRecord | null>(null);
  const [caregivers, setCaregivers] = useState<PublicCaregiverLink[]>([]);
  const [tab, setTab] = useState<Tab>('datos');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    void api
      .getPatient(id)
      .then((patient) => {
        if (!cancelled) {
          setPatient(patient);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'No se pudo cargar el paciente',
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    if (tab === 'expediente' || tab === 'visitas') {
      void api
        .getMedicalRecord(id)
        .then((loaded) => setRecord(loaded))
        .catch((err) => {
          if (err instanceof ApiError && err.statusCode === 404) {
            setRecord(null);
          }
        });
    }
    if (tab === 'cuidadores') {
      void api
        .getPatientCaregivers(id)
        .then(setCaregivers)
        .catch(() => undefined);
      void loadRelationshipTypes().catch(() => undefined);
    }
  }, [id, tab, loadRelationshipTypes]);

  if (error) {
    return <Alert>{error}</Alert>;
  }
  if (!patient || !id) {
    return <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>{patient.name}</h1>
          <p className='text-sm text-slate-500'>
            {patient.email} · {patient.healthCenterName}
          </p>
        </div>
        <div className='flex gap-2'>
          <Link
            to='/patients'
            className='rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100'
          >
            ← Volver
          </Link>
          <Link
            to={`/patients/${id}/edit`}
            className='rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300'
          >
            Editar
          </Link>
        </div>
      </div>
      <nav className='flex gap-1 border-b border-slate-200'>
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === item.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {tab === 'datos' ? <DatosTab patient={patient} /> : null}
      {tab === 'expediente' ? (
        <ExpedienteTab
          patientId={id}
          record={record}
          onSaved={setRecord}
        />
      ) : null}
      {tab === 'visitas' ? (
        <VisitasTab
          patientId={id}
          record={record}
          isStaff={isStaff}
          onRecordChanged={setRecord}
        />
      ) : null}
      {tab === 'cuidadores' ? (
        <CuidadoresTab
          patientId={id}
          caregivers={caregivers}
          onChanged={() =>
            void api
              .getPatientCaregivers(id)
              .then(setCaregivers)
              .catch(() => undefined)
          }
        />
      ) : null}
    </div>
  );
}

function DatosTab({ patient }: { patient: PublicPatient }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Usuario', value: patient.username },
    { label: 'Cédula', value: patient.dni ?? '—' },
    { label: 'Teléfono', value: patient.phoneNumber },
    { label: 'Dirección', value: patient.address },
    { label: 'Municipio', value: patient.municipalityName },
    { label: 'Fecha de nacimiento', value: formatDate(patient.dateOfBirth) },
    { label: 'Género', value: patient.genreName },
    {
      label: 'Contacto de emergencia',
      value: `${patient.emergencyContactName} · ${patient.emergencyContactPhoneNumber}`,
    },
    { label: 'Centro de salud', value: patient.healthCenterName },
  ];
  return (
    <Card>
      <dl className='grid gap-4 sm:grid-cols-2'>
        {rows.map((row) => (
          <div key={row.label}>
            <dt className='text-xs uppercase tracking-wide text-slate-500'>
              {row.label}
            </dt>
            <dd className='mt-0.5 text-sm text-slate-900'>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ExpedienteTab({
  patientId,
  record,
  onSaved,
}: {
  patientId: string;
  record: PublicMedicalRecord | null;
  onSaved: (record: PublicMedicalRecord) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    form: RecordFormValue,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const saved = await api.updateMedicalRecord(patientId, {
        primaryDiagnosis: form.primaryDiagnosis,
        medicalHistory: form.medicalHistory,
        allergies: form.allergies,
        ...(form.bloodType ? { bloodType: form.bloodType } : {}),
      });
      onSaved(saved);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el expediente',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title='Expediente clínico'>
      <RecordForm
        key={record?.updateDate ?? 'empty'}
        initial={record}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        submitLabel={record ? 'Guardar expediente' : 'Crear expediente'}
      />
    </Card>
  );
}

type RecordFormValue = typeof EMPTY_RECORD_FORM;

function RecordForm({
  initial,
  onSubmit,
  saving,
  error,
  submitLabel,
}: {
  initial: PublicMedicalRecord | null;
  onSubmit: (
    form: RecordFormValue,
    event: FormEvent<HTMLFormElement>,
  ) => void;
  saving: boolean;
  error: string | null;
  submitLabel: string;
}) {
  const [form, setForm] = useState<RecordFormValue>(() =>
    initial
      ? {
          primaryDiagnosis: initial.primaryDiagnosis,
          medicalHistory: initial.medicalHistory,
          allergies: initial.allergies,
          bloodType: initial.bloodType ?? '',
        }
      : EMPTY_RECORD_FORM,
  );

  return (
    <form
      onSubmit={(event) => void onSubmit(form, event)}
      className='flex flex-col gap-4'
    >
      {error ? <Alert>{error}</Alert> : null}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='sm:col-span-2'>
          <Input
            label='Diagnóstico principal'
            value={form.primaryDiagnosis}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                primaryDiagnosis: event.target.value,
              }))
            }
            required
          />
        </div>
        <div className='sm:col-span-2'>
          <Input
            label='Historial médico'
            value={form.medicalHistory}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                medicalHistory: event.target.value,
              }))
            }
            required
          />
        </div>
        <div className='sm:col-span-2'>
          <Input
            label='Alergias'
            value={form.allergies}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                allergies: event.target.value,
              }))
            }
            required
          />
        </div>
        <Select
          label='Grupo sanguíneo (opcional)'
          value={form.bloodType}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              bloodType: event.target.value,
            }))
          }
        >
          <option value=''>Sin especificar</option>
          {BLOOD_TYPES.map((bloodType) => (
            <option key={bloodType} value={bloodType}>
              {bloodType}
            </option>
          ))}
        </Select>
      </div>
      <div className='flex justify-end'>
        <Button type='submit' loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function VisitasTab({
  patientId,
  record,
  isStaff,
  onRecordChanged,
}: {
  patientId: string;
  record: PublicMedicalRecord | null;
  isStaff: boolean;
  onRecordChanged: (record: PublicMedicalRecord) => void;
}) {
  const [form, setForm] = useState({
    diagnosis: '',
    observations: '',
    treatment: '',
    visitDate: '',
    nextVisitDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await api.createMedicalVisit(patientId, {
        diagnosis: form.diagnosis,
        observations: form.observations,
        treatment: form.treatment,
        ...(form.visitDate ? { visitDate: form.visitDate } : {}),
        ...(form.nextVisitDate ? { nextVisitDate: form.nextVisitDate } : {}),
      });
      onRecordChanged(updated);
      setForm({
        diagnosis: '',
        observations: '',
        treatment: '',
        visitDate: '',
        nextVisitDate: '',
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo registrar la consulta',
      );
    } finally {
      setSaving(false);
    }
  }

  const visits = record?.visits ?? [];

  return (
    <div className='flex flex-col gap-4'>
      {isStaff ? (
        <Card title='Registrar consulta'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {error ? <Alert>{error}</Alert> : null}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='sm:col-span-2'>
                <Input
                  label='Diagnóstico'
                  value={form.diagnosis}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      diagnosis: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className='sm:col-span-2'>
                <Input
                  label='Observaciones'
                  value={form.observations}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      observations: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className='sm:col-span-2'>
                <Input
                  label='Tratamiento'
                  value={form.treatment}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      treatment: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Input
                label='Fecha de consulta (opcional)'
                type='date'
                value={form.visitDate}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    visitDate: event.target.value,
                  }))
                }
              />
              <Input
                label='Próxima consulta (opcional)'
                type='date'
                value={form.nextVisitDate}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    nextVisitDate: event.target.value,
                  }))
                }
              />
            </div>
            <div className='flex justify-end'>
              <Button type='submit' loading={saving}>
                Registrar consulta
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
      <Card title='Historial de consultas'>
        {visits.length === 0 ? (
          <p className='text-sm text-slate-500'>No hay consultas registradas.</p>
        ) : (
          <ol className='flex flex-col gap-4'>
            {visits.map((visit) => (
              <li
                key={visit.id}
                className='rounded-lg border border-slate-200 p-4'
              >
                <div className='mb-1 flex flex-wrap items-center justify-between gap-2'>
                  <p className='font-semibold text-slate-900'>
                    {visit.diagnosis}
                  </p>
                  <Badge variant='primary'>{formatDate(visit.visitDate)}</Badge>
                </div>
                <p className='text-sm text-slate-700'>{visit.observations}</p>
                {visit.treatment ? (
                  <p className='mt-2 text-sm text-slate-700'>
                    <strong>Tratamiento:</strong> {visit.treatment}
                  </p>
                ) : null}
                {visit.nextVisitDate ? (
                  <p className='mt-1 text-sm text-slate-600'>
                    Próxima consulta: {formatDate(visit.nextVisitDate)}
                  </p>
                ) : null}
                <p className='mt-2 text-xs text-slate-500'>
                  Atendió: {visit.healthcareWorkerName}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}

function CuidadoresTab({
  patientId,
  caregivers,
  onChanged,
}: {
  patientId: string;
  caregivers: PublicCaregiverLink[];
  onChanged: () => void;
}) {
  const relationshipTypes = useCatalogueStore((s) => s.relationshipTypes);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicCaregiver[]>([]);
  const [selected, setSelected] = useState<PublicCaregiver | null>(null);
  const [relationshipTypeId, setRelationshipTypeId] = useState('');
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSearching(true);
    try {
      setResults(await api.searchCaregivers(query.trim()));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo buscar cuidadores',
      );
    } finally {
      setSearching(false);
    }
  }

  async function handleLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !relationshipTypeId) {
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api.linkCaregiver(patientId, {
        caregiverId: selected.id,
        relationshipTypeId: Number(relationshipTypeId),
      });
      setSelected(null);
      setRelationshipTypeId('');
      setQuery('');
      setResults([]);
      await onChanged();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo vincular al cuidador',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUnlink(caregiverId: string) {
    setError(null);
    try {
      await api.unlinkCaregiver(patientId, caregiverId);
      await onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo desvincular');
    }
  }

  const alreadyLinked = new Set(caregivers.map((link) => link.caregiverId));

  return (
    <div className='flex flex-col gap-4'>
      <Card title='Cuidadores vinculados'>
        {error ? <Alert>{error}</Alert> : null}
        {caregivers.length === 0 ? (
          <p className='text-sm text-slate-500'>
            Este paciente no tiene cuidadores vinculados.
          </p>
        ) : (
          <ul className='flex flex-col gap-3'>
            {caregivers.map((link) => (
              <li
                key={link.caregiverId}
                className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3'
              >
                <div>
                  <p className='font-medium text-slate-900'>
                    {link.caregiverName}{' '}
                    {link.isPrimary ? (
                      <Badge variant='primary'>Principal</Badge>
                    ) : null}
                  </p>
                  <p className='text-xs text-slate-500'>
                    {link.caregiverEmail} · {link.relationshipTypeName}
                  </p>
                </div>
                <button
                  onClick={() => void handleUnlink(link.caregiverId)}
                  className='text-sm font-medium text-red-600 hover:underline'
                >
                  Desvincular
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title='Vincular cuidador'>
        <form onSubmit={handleSearch} className='flex flex-col gap-3'>
          <div className='flex gap-2'>
            <input
              type='search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Buscar cuidador por nombre o correo…'
              className='flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
            />
            <Button type='submit' loading={searching}>
              Buscar
            </Button>
          </div>
          {results.length > 0 ? (
            <ul className='flex flex-col gap-2'>
              {results.map((caregiver) => (
                <li key={caregiver.id}>
                  <button
                    type='button'
                    disabled={alreadyLinked.has(caregiver.id)}
                    onClick={() => setSelected(caregiver)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selected?.id === caregiver.id
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-primary/40'
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <p className='font-medium text-slate-900'>
                      {caregiver.name}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {caregiver.email}
                      {alreadyLinked.has(caregiver.id)
                        ? ' · Ya vinculado'
                        : ''}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </form>
        {selected ? (
          <form
            onSubmit={handleLink}
            className='mt-4 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4'
          >
            <p className='text-sm font-medium text-slate-900'>
              Vincular a {selected.name}
            </p>
            <Select
              label='Tipo de relación'
              value={relationshipTypeId}
              onChange={(event) => setRelationshipTypeId(event.target.value)}
              required
            >
              <option value=''>Selecciona una relación</option>
              {relationshipTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                onClick={() => setSelected(null)}
                className='bg-slate-200 text-slate-700 hover:bg-slate-300'
              >
                Cancelar
              </Button>
              <Button type='submit' loading={saving}>
                Vincular
              </Button>
            </div>
          </form>
        ) : null}
      </Card>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
