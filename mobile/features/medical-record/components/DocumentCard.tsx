// features/medical-record/components/DocumentCard.tsx
import { ListItemCard } from '@/components/ui/list-item-card';
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import { formatIsoDateShort } from '@/lib/date-format';
import type { MedicalDocument } from '../api/mock-medical-record';
import { joinParts } from '../domain/clinical-summary';
import { DOCUMENT_CATEGORY_ICONS } from './record-visuals';

type DocumentCardProps = {
  document: MedicalDocument;
  /**
   * recent: "PDF · 10 sep 2026" (en la lista general, donde importa el formato).
   * category: "10 sep 2026 · Dra. Karla Ruiz" (dentro de una categoría).
   */
  variant: 'recent' | 'category';
  onPress: () => void;
};

export function DocumentCard({ document, variant, onPress }: DocumentCardProps) {
  const { formatPdf, formatImage } = MEDICAL_RECORD_LABELS.documents;
  const date = formatIsoDateShort(document.issuedAt);
  const subtitle =
    variant === 'recent'
      ? joinParts([document.format === 'pdf' ? formatPdf : formatImage, date])
      : joinParts([date, document.provider]);

  return (
    <ListItemCard
      icon={DOCUMENT_CATEGORY_ICONS[document.category]}
      iconShape="square"
      title={document.title}
      subtitle={subtitle}
      onPress={onPress}
    />
  );
}
