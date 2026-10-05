import { useNavigate } from "react-router";
import { usePatientForm } from "./usePatientForm";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Alert } from "../../components/ui/Alert";
import { LocationSelectFields } from "../../components/forms/LocationSelectFields";

export default function PatientForm() {
  const navigate = useNavigate();
  const {
    isEditing,
    isAdmin,
    form,
    updateField,
    loading,
    saving,
    error,
    genres,
    healthCenters,
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    handleSubmit,
  } = usePatientForm();

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        {isEditing ? "Editar paciente" : "Nuevo paciente"}
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error ? <Alert>{error}</Alert> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre completo"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
            />
            <Input
              label="Nombre de usuario"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              required
            />
            <Input
              label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              minLength={8}
              required={!isEditing}
            />
            <Input
              label="Teléfono"
              value={form.phoneNumber}
              onChange={(event) =>
                updateField("phoneNumber", event.target.value)
              }
              required
            />
            <Input
              label="Cédula (opcional)"
              value={form.dni}
              onChange={(event) => updateField("dni", event.target.value)}
            />
            <div className="sm:col-span-2">
              <Input
                label="Dirección"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                required
              />
            </div>
            <LocationSelectFields
              departments={departments}
              departmentId={departmentId}
              onDepartmentChange={(value) =>
                void handleDepartmentChange(value, () =>
                  updateField("municipalityId", ""),
                )
              }
              municipalities={municipalityOptions}
              municipalityId={form.municipalityId}
              onMunicipalityChange={(value) =>
                updateField("municipalityId", value)
              }
            />
            <Input
              label="Fecha de nacimiento"
              type="date"
              value={form.dateOfBirth}
              onChange={(event) =>
                updateField("dateOfBirth", event.target.value)
              }
              required
            />
            <Select
              label="Género"
              value={form.genreId}
              onChange={(event) => updateField("genreId", event.target.value)}
              required
            >
              <option value="">Selecciona un género</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </Select>
            <Input
              label="Contacto de emergencia"
              value={form.emergencyContactName}
              onChange={(event) =>
                updateField("emergencyContactName", event.target.value)
              }
              required
            />
            <Input
              label="Teléfono de emergencia"
              value={form.emergencyContactPhoneNumber}
              onChange={(event) =>
                updateField("emergencyContactPhoneNumber", event.target.value)
              }
              required
            />
            {isAdmin && !isEditing ? (
              <Select
                label="Centro de salud"
                value={form.healthCenterId}
                onChange={(event) =>
                  updateField("healthCenterId", event.target.value)
                }
                required
              >
                <option value="">Selecciona un centro</option>
                {healthCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              {isEditing ? "Guardar cambios" : "Crear paciente"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
