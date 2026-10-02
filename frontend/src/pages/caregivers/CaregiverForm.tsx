import { useNavigate } from "react-router";
import { useCaregiverForm } from "./useCaregiverForm";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { LocationSelectFields } from "../../components/forms/LocationSelectFields";

export default function CaregiverForm() {
  const navigate = useNavigate();
  const {
    isEditing,
    form,
    updateField,
    isActive,
    setIsActive,
    loading,
    saving,
    error,
    departments,
    departmentId,
    municipalityOptions,
    handleDepartmentChange,
    handleSubmit,
  } = useCaregiverForm();

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        {isEditing ? "Editar cuidador" : "Nuevo cuidador"}
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
            {!isEditing ? (
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
            ) : (
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                Cuidador activo
              </label>
            )}
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
              {isEditing ? "Guardar cambios" : "Crear cuidador"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
