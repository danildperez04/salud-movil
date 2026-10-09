// features/medical-record/hooks/useAttachmentActions.ts
import { useMediaPicker, type PickedMedia } from '@/hooks/useMediaPicker';

/**
 * Acciones para adjuntar un archivo (cámara, galería, documento) a un
 * formulario. `onPicked` recibe el archivo solo si el usuario eligió uno.
 */
export function useAttachmentActions(onPicked: (media: PickedMedia) => void) {
  const picker = useMediaPicker();

  const attach = (pick: () => Promise<PickedMedia | null>) => async () => {
    const media = await pick();
    if (media) onPicked(media);
  };

  return {
    takePhoto: attach(picker.takePhoto),
    chooseImage: attach(picker.chooseImage),
    chooseDocument: attach(picker.chooseDocument),
  };
}
