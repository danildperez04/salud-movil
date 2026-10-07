// hooks/useMediaPicker.ts
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';
import { COMMON_LABELS, MEDICAL_RECORD_LABELS } from '@/constants/labels';

const { media: labels } = MEDICAL_RECORD_LABELS;

/** Archivo elegido por el usuario (foto de la cámara, imagen de la galería o documento). */
export type PickedMedia = {
  uri: string;
  name: string;
  mimeType?: string;
  /** image: foto o imagen; document: archivo (ej. PDF) */
  kind: 'image' | 'document';
};

const fileNameFromUri = (uri: string, fallback: string) => uri.split('/').pop() || fallback;

function imageToMedia(asset: ImagePicker.ImagePickerAsset): PickedMedia {
  return {
    uri: asset.uri,
    name: asset.fileName ?? fileNameFromUri(asset.uri, 'imagen.jpg'),
    mimeType: asset.mimeType,
    kind: 'image',
  };
}

function documentToMedia(asset: DocumentPicker.DocumentPickerAsset): PickedMedia {
  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType,
    kind: asset.mimeType?.startsWith('image/') ? 'image' : 'document',
  };
}

function askToOpenSettings(message: string) {
  Alert.alert(labels.permissionTitle, message, [
    { text: COMMON_LABELS.cancel, style: 'cancel' },
    { text: labels.openSettings, onPress: () => Linking.openSettings() },
  ]);
}

/** Ejecuta un selector y devuelve null si el usuario cancela o falla (con aviso). */
async function pick(run: () => Promise<PickedMedia | null>): Promise<PickedMedia | null> {
  try {
    return await run();
  } catch {
    Alert.alert(labels.errorTitle, labels.pickError);
    return null;
  }
}

/**
 * Selectores de archivos del dispositivo. Cada función devuelve el archivo
 * elegido o null (cancelado, sin permiso o con error).
 */
export function useMediaPicker() {
  const takePhoto = () =>
    pick(async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        askToOpenSettings(labels.cameraDenied);
        return null;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
      return result.canceled ? null : imageToMedia(result.assets[0]);
    });

  // el selector de fotos del sistema no necesita permiso de galería
  const chooseImage = () =>
    pick(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      return result.canceled ? null : imageToMedia(result.assets[0]);
    });

  const chooseDocument = () =>
    pick(async () => {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      return result.canceled ? null : documentToMedia(result.assets[0]);
    });

  return { takePhoto, chooseImage, chooseDocument };
}
