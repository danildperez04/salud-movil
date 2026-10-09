// features/medical-record/hooks/useShareRecord.ts
import { useCallback } from 'react';
import { Alert, Platform, Share } from 'react-native';
import { MEDICAL_RECORD_LABELS } from '@/constants/labels';
import type { ShareContent } from '../domain/share-content';

const { media } = MEDICAL_RECORD_LABELS;

/**
 * Abre el menú de compartir del sistema, desde donde el usuario puede guardar
 * una copia (Archivos, Drive, WhatsApp…).
 * TODO: descargar el archivo original del backend cuando exista.
 */
export function useShareRecord() {
  return useCallback(async ({ title, message, url }: ShareContent) => {
    try {
      await Share.share({ title, message, url: Platform.OS === 'ios' ? url : undefined });
    } catch {
      Alert.alert(media.errorTitle, media.shareError);
    }
  }, []);
}
