import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api, ApiError } from '../../lib/api';
import { useCatalogueStore } from '../../store/catalogues';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';

export default function CaregiverForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const departments = useCatalogueStore((s) => s.departments);
  const loadDepartments = useCatalogueStore((s) => s.loadDepartments);
  const municipalities = useCatalogueStore((s) => s.municipalities);
  const loadMunicipalities = useCatalogueStore((s) => s.loadMunicipalities);
  const loadAllMunicipalities = useCatalogueStore((s) => s.loadAllMunicipalities);

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    dni: '',
    municipalityId: '',
  });
  const [departmentId, setDepartmentId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    if (!isEditing || !id) {
      return;
    }
    const userId = id;
    let cancelled = false;
    async function loadCaregiver() {
      try {
        const user = await api.getCaregiver(userId);
        if (cancelled) {
          return;
        }
        setForm((previous) => ({
          ...previous,
          name: user.name,
          email: user.email,
          username: user.username,
          phoneNumber: user.phoneNumber,
          address: user.address,
          dni: user.dni ?? '',
          municipalityId: String(user.municipalityId ?? ''),
        }));
        setIsActive(user.isActive);
        if (user.municipalityId) {
          await loadAllMunicipalities();
          const list = useCatalogueStore.getState().allMunicipalities;
          const match = list.find(
            (municipality) => municipality.id === user.municipalityId,
          );
          if (match) {
            setDepartmentId(String(match.departmentId));
            await loadMunicipalities(match.departmentId);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'No se pudo cargar el cuidador',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadCaregiver();
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
          isActive,
        };
        if (form.dni) {
          payload.dni = form.dni;
        }
        if (form.password) {
          payload.password = form.password;
        }
        await api.updateCaregiver(id, payload);
      } else {
        await api.createCaregiver({
          name: form.name,
          email: form.email,
          username: form.username,
          password: form.password,
          phoneNumber: form.phoneNumber,
          address: form.address,
          dni: form.dni || undefined,
          municipalityId: Number(form.municipalityId),
        });
      }
      navigate('/caregivers', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se pudo guardar el cuidador',
      );
    } finally {
      setSaving(false);
    }
  }

  const municipalityOptions = departmentId
    ? (municipalities[Number(departmentId)] ?? [])
    : [];

  if (loading) {
    return (
      <p className='py-8 text-center text-sm text-slate-500'>Cargando…</p>
    );
  }

  return (
    <div className='mx-auto max-w-2xl'>
      <h1 className='mb-4 text-2xl font-bold text-slate-900'>
        {isEditing ? 'Editar cuidador' : 'Nuevo cuidador'}
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
            {!isEditing ? (
              <>
                <Select
                  label='Departamento'
                  value={departmentId}
                  onChange={(event) =>
                    void handleDepartmentChange(event.target.value)
                  }
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
              </>
            ) : (
              <label className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <input
                  type='checkbox'
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20'
                />
                Cuidador activo
              </label>
            )}
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
              {isEditing ? 'Guardar cambios' : 'Crear cuidador'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
