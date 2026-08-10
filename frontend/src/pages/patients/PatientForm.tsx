import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api, ApiError } from '../../lib/api';
import { useCatalogueStore } from '../../store/catalogues';
import { useAuthStore } from '../../store/auth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';

export default function PatientForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = currentUser?.role === 'admin';

  const departments = useCatalogueStore((s) => s.departments);
  const loadDepartments = useCatalogueStore((s) => s.loadDepartments);
  const municipalities = useCatalogueStore((s) => s.municipalities);
  const loadMunicipalities = useCatalogueStore((s) => s.loadMunicipalities);
  const loadAllMunicipalities = useCatalogueStore((s) => s.loadAllMunicipalities);
  const genres = useCatalogueStore((s) => s.genres);
  const loadGenres = useCatalogueStore((s) => s.loadGenres);
  const healthCenters = useCatalogueStore((s) => s.healthCenters);
  const loadHealthCenters = useCatalogueStore((s) => s.loadHealthCenters);

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    dni: '',
    municipalityId: '',
    dateOfBirth: '',
    genreId: '',
    emergencyContactName: '',
    emergencyContactPhoneNumber: '',
    healthCenterId: '',
  });
  const [departmentId, setDepartmentId] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDepartments();
    void loadGenres();
    if (isAdmin) {
      void loadHealthCenters();
    }
  }, [loadDepartments, loadGenres, loadHealthCenters, isAdmin]);

  useEffect(() => {
    if (!isEditing || !id) {
      return;
    }
    const patientId = id;
    let cancelled = false;
    async function loadPatient() {
      try {
        const patient = await api.getPatient(patientId);
        if (cancelled) {
          return;
        }
        setForm((previous) => ({
          ...previous,
          name: patient.name,
          email: patient.email,
          username: patient.username,
          phoneNumber: patient.phoneNumber,
          address: patient.address,
          dni: patient.dni ?? '',
          municipalityId: String(patient.municipalityId),
          dateOfBirth: patient.dateOfBirth.slice(0, 10),
          genreId: String(patient.genreId),
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhoneNumber: patient.emergencyContactPhoneNumber,
          healthCenterId: patient.healthCenterId,
        }));
        if (useCatalogueStore.getState().allMunicipalities.length === 0) {
          await loadAllMunicipalities();
        }
        const list = useCatalogueStore.getState().allMunicipalities;
        const match = list.find(
          (municipality) => municipality.id === patient.municipalityId,
        );
        if (match) {
          setDepartmentId(String(match.departmentId));
          await loadMunicipalities(match.departmentId);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'No se pudo cargar el paciente',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadPatient();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  async function handleDepartmentChange(value: string) {
    setDepartmentId(value);
    setForm((previous) => ({ ...previous, municipalityId: '' }));
    if (value) {
      await loadMunicipalities(Number(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEditing && id) {
        const payload: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          username: form.username,
          phoneNumber: form.phoneNumber,
          address: form.address,
          municipalityId: Number(form.municipalityId),
          dateOfBirth: form.dateOfBirth,
          genreId: Number(form.genreId),
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhoneNumber: form.emergencyContactPhoneNumber,
        };
        if (form.dni) {
          payload.dni = form.dni;
        }
        if (form.password) {
          payload.password = form.password;
        }
        await api.updatePatient(id, payload);
      } else {
        await api.createPatient({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          phoneNumber: form.phoneNumber,
          address: form.address,
          dni: form.dni || undefined,
          municipalityId: Number(form.municipalityId),
          dateOfBirth: form.dateOfBirth,
          genreId: Number(form.genreId),
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhoneNumber: form.emergencyContactPhoneNumber,
          healthCenterId: isAdmin
            ? form.healthCenterId || undefined
            : undefined,
        });
      }
      navigate('/patients', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo guardar el paciente',
      );
    } finally {
      setSaving(false);
    }
  }

  const municipalityOptions = departmentId
    ? (municipalities[Number(departmentId)] ?? [])
    : [];

  if (loading) {
    return <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>;
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <h1 className='mb-4 text-2xl font-bold text-slate-900'>
        {isEditing ? 'Editar paciente' : 'Nuevo paciente'}
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {error ? <Alert>{error}</Alert> : null}
          <div className='grid gap-4 sm:grid-cols-2'>
            <Input
              label='Nombre completo'
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, name: event.target.value }))
              }
              required
            />
            <Input
              label='Correo electrónico'
              type='email'
              value={form.email}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              required
            />
            <Input
              label='Nombre de usuario'
              value={form.username}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  username: event.target.value,
                }))
              }
              required
            />
            <Input
              label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              type='password'
              value={form.password}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
              minLength={8}
              required={!isEditing}
            />
            <Input
              label='Teléfono'
              value={form.phoneNumber}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  phoneNumber: event.target.value,
                }))
              }
              required
            />
            <Input
              label='Cédula (opcional)'
              value={form.dni}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  dni: event.target.value,
                }))
              }
            />
            <div className='sm:col-span-2'>
              <Input
                label='Dirección'
                value={form.address}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    address: event.target.value,
                  }))
                }
                required
              />
            </div>
            <Select
              label='Departamento'
              value={departmentId}
              onChange={(event) => void handleDepartmentChange(event.target.value)}
              required
            >
              <option value=''>Selecciona un departamento</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
            <Select
              label='Municipio'
              value={form.municipalityId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  municipalityId: event.target.value,
                }))
              }
              required
              disabled={!departmentId}
            >
              <option value=''>Selecciona un municipio</option>
              {municipalityOptions.map((municipality) => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </Select>
            <Input
              label='Fecha de nacimiento'
              type='date'
              value={form.dateOfBirth}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  dateOfBirth: event.target.value,
                }))
              }
              required
            />
            <Select
              label='Género'
              value={form.genreId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  genreId: event.target.value,
                }))
              }
              required
            >
              <option value=''>Selecciona un género</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </Select>
            <Input
              label='Contacto de emergencia'
              value={form.emergencyContactName}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  emergencyContactName: event.target.value,
                }))
              }
              required
            />
            <Input
              label='Teléfono de emergencia'
              value={form.emergencyContactPhoneNumber}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  emergencyContactPhoneNumber: event.target.value,
                }))
              }
              required
            />
            {isAdmin && !isEditing ? (
              <Select
                label='Centro de salud'
                value={form.healthCenterId}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    healthCenterId: event.target.value,
                  }))
                }
                required
              >
                <option value=''>Selecciona un centro</option>
                {healthCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
          <div className='mt-2 flex justify-end gap-3'>
            <Button
              type='button'
              onClick={() => navigate(-1)}
              className='bg-slate-200 text-slate-700 hover:bg-slate-300'
            >
              Cancelar
            </Button>
            <Button type='submit' loading={saving}>
              {isEditing ? 'Guardar cambios' : 'Crear paciente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
