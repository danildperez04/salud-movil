import type { ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDeleteModalProps {
  title: string;
  message: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  confirmLabel?: string;
}

/**
 * Modal "¿Seguro que deseas eliminar...?" genérico. Antes esta misma
 * estructura (Modal + botones Cancelar/Eliminar) estaba duplicada en
 * PatientsList y CaregiversList; ahora cada lista solo pasa el título y el
 * mensaje.
 */
export function ConfirmDeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
  loading = false,
  confirmLabel = "Eliminar",
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button
            onClick={onCancel}
            className="bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Cancelar
          </Button>
          <Button
            loading={loading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-700">{message}</p>
    </Modal>
  );
}
