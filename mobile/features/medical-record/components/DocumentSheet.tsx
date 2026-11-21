// features/medical-record/components/DocumentSheet.tsx
import { FileText } from '@/lib/icons';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { DOCUMENT_CATEGORIES } from '@/constants/labels';
import { formatIsoDateShort } from '@/lib/date-format';
import { colors } from '@/lib/tokens';
import type { MedicalDocument } from '../api/mock-medical-record';
import { ScanImage } from './ScanImage';

function MetaChip({ label }: { label: string }) {
  return (
    <View className="bg-primary/10 rounded-full px-3 py-1.5">
      <Text className="text-caption font-body-semibold text-primary">{label}</Text>
    </View>
  );
}

/** Contenido de un documento del expediente: tipo, título, datos, texto y archivo. */
export function DocumentSheet({ document }: { document: MedicalDocument }) {
  const hasImage = document.format === 'image' && !!document.fileUri;

  return (
    <View className="bg-card border-border gap-4 rounded-3xl border p-6 shadow-lg shadow-black/5">
      <View className="gap-1">
        <Text className="text-caption font-body-semibold text-primary tracking-widest uppercase">
          {DOCUMENT_CATEGORIES[document.category].singular}
        </Text>
        <Text className="text-h3 font-heading text-foreground">{document.title}</Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        <MetaChip label={formatIsoDateShort(document.issuedAt)} />
        {document.provider && <MetaChip label={document.provider} />}
      </View>

      {document.notes && (
        <Text className="text-body font-body text-muted-foreground">{document.notes}</Text>
      )}

      {hasImage && document.fileUri ? (
        <ScanImage uri={document.fileUri} label={document.title} />
      ) : (
        document.fileName && (
          <View className="bg-muted/20 flex-row items-center gap-3 rounded-2xl p-4">
            <FileText size={22} color={colors.brandGreen} />
            <Text className="text-small font-body text-foreground flex-1" numberOfLines={1}>
              {document.fileName}
            </Text>
          </View>
        )
      )}
    </View>
  );
}
