import { useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Alert } from "../../../components/ui/Alert";
import { Badge } from "../../../components/ui/Badge";
import { api, ApiError } from "../../../lib/api";
import { useCatalogueStore } from "../../../store/catalogues";
import type { PublicCaregiver, PublicCaregiverLink } from "../../../types";

const SEARCH_DEBOUNCE_MS = 300;

interface LinkCaregiverModalProps {
  patientId: string;
  /** Vínculos actuales, para no ofrecer un cuidador ya vinculado. */
  linked: PublicCaregiverLink[];
  onClose: () => void;
  /** Tras vincular, el padre recarga los vínculos del paciente. */
  onLinked: () => void;
}

/**
 * Alta de vínculo entre un paciente y un cuidador (HU-05, parte de "vincular").
 *
 * El buscador usa `GET /caregivers?q=` y el parentesco viene del catálogo que
 * `store/catalogues` ya precarga. Los errores del servidor se muestran tal
 * cual: un 409 significa que el vínculo ya existe, y uno 400 que el cuidador o
 * el parentesco no son válidos.
 */
export function LinkCaregiverModal({
  patientId,
  linked,
  onClose,
  onLinked,
}: LinkCaregiverModalProps) {
  const relationshipTypes = useCatalogueStore((s) => s.relationshipTypes);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicCaregiver[]>([]);
  const [selected, setSelected] = useState<PublicCaregiver | null>(null);
  const [relationshipTypeId, setRelationshipTypeId] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    const delay = isFirstRunRef.current ? 0 : SEARCH_DEBOUNCE_MS;
    isFirstRunRef.current = false;
    const handle = setTimeout(() => {
      const search = query.trim();
      if (!search) {
        setResults([]);
        return;
      }
      setSearching(true);
      void api
        .searchCaregivers(search)
        .then((data) => {
          setResults(data);
          setError(null);
        })
        .catch((err) => {
          setError(
            err instanceof ApiError
              ? err.message
              : "No se pudo buscar el cuidador",
          );
        })
        .finally(() => setSearching(false));
    }, delay);
    return () => clearTimeout(handle);
  }, [query]);

  const alreadyLinked = (caregiverId: string) =>
    linked.some((link) => link.caregiverId === caregiverId);

  const handleSubmit = async () => {
    if (!selected) {
      setError("Selecciona un cuidador");
      return;
    }
    if (!relationshipTypeId) {
      setError("Selecciona el parentesco");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.linkCaregiver(patientId, {
        caregiverId: selected.id,
        relationshipTypeId: Number(relationshipTypeId),
        isPrimary,
      });
      onLinked();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo crear el vínculo",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Vincular cuidador"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Vincular
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        {error ? <Alert>{error}</Alert> : null}

        <Input
          label="Buscar cuidador"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nombre, correo o usuario"
          autoFocus
        />

        {searching ? (
          <p className="font-body text-sm text-muted">Buscando…</p>
        ) : results.length > 0 ? (
          <ul className="flex max-h-48 flex-col divide-y divide-line overflow-y-auto rounded-lg border border-line">
            {results.map((caregiver) => {
              const linkedAlready = alreadyLinked(caregiver.id);
              return (
                <li key={caregiver.id}>
                  <button
                    type="button"
                    disabled={linkedAlready}
                    onClick={() => {
                      setSelected(caregiver);
                      setError(null);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left transition ${
                      selected?.id === caregiver.id
                        ? "bg-mint-soft"
                        : linkedAlready
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-surface"
                    }`}
                  >
                    <span>
                      <span className="block font-body text-sm font-medium text-navy">
                        {caregiver.name}
                      </span>
                      <span className="block font-body text-xs text-muted">
                        {caregiver.email}
                      </span>
                    </span>
                    {linkedAlready ? (
                      <Badge variant="neutral">Vinculado</Badge>
                    ) : selected?.id === caregiver.id ? (
                      <UserPlus size={14} className="text-primary" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : query.trim() ? (
          <p className="font-body text-sm text-muted">
            Sin resultados para “{query.trim()}”.
          </p>
        ) : null}

        {selected ? (
          <>
            <Select
              label="Parentesco"
              value={relationshipTypeId}
              onChange={(event) => setRelationshipTypeId(event.target.value)}
            >
              <option value="">Selecciona…</option>
              {relationshipTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Select>

            <label className="flex items-center gap-2 font-body text-sm text-navy">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(event) => setIsPrimary(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Cuidador principal
            </label>
          </>
        ) : null}
      </div>
    </Modal>
  );
}