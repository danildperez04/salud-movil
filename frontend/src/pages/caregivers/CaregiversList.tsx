import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api, ApiError } from "../../lib/api";
import type { PublicCaregiver } from "../../types";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import type { Column } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { ConfirmDeleteModal } from "../../components/ui/ConfirmDeleteModal";

const SEARCH_DEBOUNCE_MS = 300;

export default function CaregiversList() {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState<PublicCaregiver[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<PublicCaregiver | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Evita que una respuesta "vieja" sobrescriba la de una búsqueda más reciente.
  const requestIdRef = useRef(0);
  // El montaje no debe esperar el debounce; solo lo que el usuario escribe después.
  const isFirstRunRef = useRef(true);

  async function loadCaregivers(search: string) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchCaregivers(search);
      if (requestIdRef.current === requestId) {
        setCaregivers(data);
      }
    } catch (err) {
      if (requestIdRef.current === requestId) {
        setError(
          err instanceof ApiError
            ? err.message
            : "No se pudieron cargar los cuidadores",
        );
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }

  // Carga inicial + búsqueda con debounce, en un único efecto: antes había
  // un efecto de montaje (`useEffect(..., [])`) y otro para `query` que
  // también se disparaba al montar, así que la primera carga se hacía dos
  // veces. `load()` siempre corre dentro del callback de `setTimeout`, nunca
  // de forma síncrona en el cuerpo del efecto.
  useEffect(() => {
    const delay = isFirstRunRef.current ? 0 : SEARCH_DEBOUNCE_MS;
    isFirstRunRef.current = false;
    const handle = setTimeout(() => {
      void loadCaregivers(query.trim());
    }, delay);
    return () => clearTimeout(handle);
  }, [query]);

  async function confirmDelete() {
    if (!toDelete) {
      return;
    }
    setDeleting(true);
    try {
      await api.deleteCaregiver(toDelete.id);
      setToDelete(null);
      await loadCaregivers(query.trim());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar al cuidador",
      );
      setDeleting(false);
    }
  }

  const columns: Column<PublicCaregiver>[] = [
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
      header: "Teléfono",
      render: (row) => (
        <span className="text-slate-700">{row.phoneNumber}</span>
      ),
    },
    {
      header: "Cédula",
      render: (row) => <span className="text-slate-700">{row.dni ?? "—"}</span>,
    },
    {
      header: "Acciones",
      render: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/app/caregivers/${row.id}`}
            className="text-sm font-medium text-slate-600 hover:underline"
          >
            Ver
          </Link>
          <Link
            to={`/app/caregivers/${row.id}/edit`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Editar
          </Link>
          <button
            onClick={() => setToDelete(row)}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Cuidadores</h1>
        <Button onClick={() => navigate("/app/caregivers/new")}>
          Nuevo cuidador
        </Button>
      </div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nombre, correo, usuario o cédula…"
        className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {error ? <Alert>{error}</Alert> : null}
      <Card>
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>
        ) : (
          <Table
            columns={columns}
            rows={caregivers}
            rowKey={(row) => row.id}
            emptyMessage="No hay cuidadores registrados"
          />
        )}
      </Card>
      {toDelete ? (
        <ConfirmDeleteModal
          title="Eliminar cuidador"
          message={
            <>
              ¿Seguro que deseas eliminar a <strong>{toDelete.name}</strong>? El
              cuidador quedará desactivado y no podrá iniciar sesión en la
              aplicación móvil.
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
