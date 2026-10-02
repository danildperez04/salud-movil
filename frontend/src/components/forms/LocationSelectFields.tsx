import { Select } from "../ui/Select";

interface LocationOption {
  id: number;
  name: string;
}

interface LocationSelectFieldsProps {
  departments: LocationOption[];
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  municipalities: LocationOption[];
  municipalityId: string;
  onMunicipalityChange: (value: string) => void;
}

export function LocationSelectFields({
  departments,
  departmentId,
  onDepartmentChange,
  municipalities,
  municipalityId,
  onMunicipalityChange,
}: LocationSelectFieldsProps) {
  return (
    <>
      <Select
        label="Departamento"
        value={departmentId}
        onChange={(event) => onDepartmentChange(event.target.value)}
        required
      >
        <option value="">Selecciona un departamento</option>
        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </Select>
      <Select
        label="Municipio"
        value={municipalityId}
        onChange={(event) => onMunicipalityChange(event.target.value)}
        required
        disabled={!departmentId}
      >
        <option value="">Selecciona un municipio</option>
        {municipalities.map((municipality) => (
          <option key={municipality.id} value={municipality.id}>
            {municipality.name}
          </option>
        ))}
      </Select>
    </>
  );
}
