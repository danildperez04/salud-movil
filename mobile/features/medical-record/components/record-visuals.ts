// features/medical-record/components/record-visuals.ts
// Íconos y colores de cada catálogo del expediente.
import {
  ClipboardList,
  Eye,
  FileText,
  FlaskConical,
  Stethoscope,
  TriangleAlert,
  Users,
  type LucideIcon,
} from '@/lib/icons';
import { statusColors } from '@/lib/tokens';
import type { AllergySeverity, DocumentCategory, LabStatus } from '../domain/record-catalogs';
import type { RecordMenuItem } from '../hooks/useMedicalRecordMenu';

export const DOCUMENT_CATEGORY_ICONS: Record<DocumentCategory, LucideIcon> = {
  prescriptions: FileText,
  certificates: ClipboardList,
  studies: Eye,
  notes: Stethoscope,
};

export const MENU_VISUALS: Record<
  RecordMenuItem['id'],
  { icon: LucideIcon; tone: 'primary' | 'danger' }
> = {
  summary: { icon: ClipboardList, tone: 'primary' },
  diagnosis: { icon: Stethoscope, tone: 'primary' },
  history: { icon: Users, tone: 'primary' },
  allergies: { icon: TriangleAlert, tone: 'danger' },
  documents: { icon: FileText, tone: 'primary' },
  labs: { icon: FlaskConical, tone: 'primary' },
};

export const ALLERGY_SEVERITY_COLORS: Record<AllergySeverity, string> = {
  mild: statusColors.success,
  moderate: statusColors.warning,
  severe: statusColors.danger,
};

export const LAB_STATUS_COLORS: Record<LabStatus, string> = {
  normal: statusColors.success,
  review: statusColors.warning,
  'out-of-range': statusColors.danger,
};
