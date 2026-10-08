import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api, ApiError } from "../../lib/api";
import { ageOf } from "../../lib/age";
import { useAuthStore } from "../../store/auth";
import type { PublicPatient } from "../../types";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import type { Column } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import { ConfirmDeleteModal } from "../../components/ui/ConfirmDeleteModal";

/** Espera antes de disparar la búsqueda mientras el usuario sigue escribiendo. */
const SEARCH_DEBOUNCE_MS = 400;

export default function PatientsList() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  const [patients, setPatients] = useState<PublicPatient[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<PublicPatient | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Evita que una respuesta "vieja" (de una búsqueda anterior más lenta)
  // sobrescriba el resultado de una búsqueda más reciente.
  const requestIdRef = useRef(0);
  // Distingue el primer disparo (montaje) de los siguientes (mientras el
  // usuario escribe), para no aplicarle debounce a la carga inicial.
  const isFirstRunRef = useRef(true);

  async function load(search?: string) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await api.listPatients(search);
      if (requestIdRef.current === requestId) {
        setPatients(data);
      }
    } catch (err) {
      if (requestIdRef.current === requestId) {
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudo cargar los pacientes",
        );
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }

  // Carga inicial + búsqueda reactiva con debounce (reemplaza el botón
  // "Buscar" del diseño anterior). El disparo de montaje no espera; los
  // siguientes sí, para no lanzar una petición por cada tecla.
  //
  // Nota: `load()` siempre se invoca dentro del callback de `setTimeout`,
  // nunca de forma síncrona en el cuerpo del efecto, para no disparar un
  // setState síncrono durante el efecto (regla react-hooks/set-state-in-effect).
  useEffect(() => {
    const delay = isFirstRunRef.current ? 0 : SEARCH_DEBOUNCE_MS;
    isFirstRunRef.current = false;
    const handle = setTimeout(() => {
      void load(query.trim() || undefined);
    }, delay);
    return () => clearTimeout(handle);
  }, [query]);

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }
    setDeleting(true);
    try {
      await api.deletePatient(toDelete.id);
      setToDelete(null);
      await load(query.trim() || undefined);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar al paciente",
      );
      setDeleting(false);
    }
  }

  const columns: Column<PublicPatient>[] = [
    {
      header: "Nombre",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Edad",
      render: (row) => (
        <span className="text-slate-700">{ageOf(row.dateOfBirth)}</span>
      ),
    },
    {
      header: "Género",
      render: (row) => <span className="text-slate-700">{row.genreName}</span>,
    },
    {
      header: "Centro de salud",
      render: (row) => (
        <span className="text-slate-700">{row.healthCenterName}</span>
      ),
    },
    {
      header: "Estado",
      render: (row) =>
        row.isActive ? (
          <Badge variant="success">Activo</Badge>
        ) : (
          <Badge variant="danger">Inactivo</Badge>
        ),
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex gap-3">
          <Link
            to={`/app/patients/${row.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver
          </Link>
          <Link
            to={`/app/patients/${row.id}/edit`}
            className="text-sm font-medium text-slate-600 hover:underline"
          >
            Editar
          </Link>
          {isAdmin ? (
            <button
              onClick={() => setToDelete(row)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Eliminar
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
          <p className="text-sm text-slate-500">
            Consulta y administra pacientes y expedientes.
          </p>
        </div>
        <Button onClick={() => navigate("/app/patients/new")}>
          Nuevo paciente
        </Button>
      </div>

      <div className="relative max-w-md">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre, correo, usuario o cédula…"
          aria-label="Buscar pacientes"
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <Card>
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>
        ) : (
          <Table
            columns={columns}
            rows={patients}
            rowKey={(row) => row.id}
            emptyMessage="No hay pacientes registrados"
          />
        )}
      </Card>

      {toDelete ? (
        <ConfirmDeleteModal
          isOpen={!!toDelete}
          title="Eliminar paciente"
          message={
            <>
              ¿Seguro que deseas eliminar a <strong>{toDelete.name}</strong>? El
              paciente quedará desactivado y no podrá volver a iniciar sesión.
            </>
          }
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
          loading={deleting}
        />
      ) : null}
    </div>
  );
}
