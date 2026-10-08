import type { BandSeverity } from '../catalogues/entities/clinical-range-band.entity';

export type IpcpLevel = 'low' | 'moderate' | 'high';

export type IpcpComponentKey =
  'indicatorDeviation' | 'adherence' | 'appointmentControl' | 'trend';

export interface IpcpIndicatorDetail {
  typeIndicatorId: number;
  typeIndicatorName: string;
  value: number;
  valueSecondary: number | null;
  severity: BandSeverity;
  band: string;
}

export interface IpcpComponent {
  key: IpcpComponentKey;
  /** Etiqueta lista para mostrar en el panel. */
  label: string;
  /** Puntuación 0-100 de la variable, o `null` si no hay datos. */
  score: number | null;
  /** Peso nominal de la variable. */
  weight: number;
  /**
   * Peso realmente aplicado tras renormalizar. Es menor que `weight` cuando
   * alguna variable no tiene datos y el resto absorbe su proporción.
   */
  effectiveWeight: number;
  /** Por qué no hay datos, para que el panel pueda explicarlo. */
  unavailableReason: string | null;
  /** Evidencia que sustenta la puntuación, para que el índice sea explicable. */
  detail: string;
  /** Desglose por indicador, solo en `indicatorDeviation`. */
  indicators?: IpcpIndicatorDetail[];
}

export interface PublicIpcp {
  score: number;
  level: IpcpLevel;
  components: IpcpComponent[];
  /** Peso del paciente queda fuera del índice. Ver `PatientOverviewCard`. */
  exclusions: string[];
  /** Fecha de la última lectura de indicador usada en el cálculo. */
  computedFrom: string | null;
  generatedAt: string;
}
