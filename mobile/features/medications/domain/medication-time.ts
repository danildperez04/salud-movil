// features/medications/domain/medication-time.ts

/** Date -> "09:00 AM", el mismo formato que usan los registros de medicamentos */
export function formatMedicationTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
