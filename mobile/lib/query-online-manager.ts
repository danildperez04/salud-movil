// lib/query-online-manager.ts
import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

// React Query no sabe "escuchar" la conectividad de un dispositivo móvil
// por sí solo (no existe el evento `online`/`offline` del navegador acá).
// Con esto: si el celular pierde conexión, las queries se pausan solas;
// al recuperarla, refetchean automático. No hay que escribir esa lógica a mano.
export function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    let initialised = false;

    const subscription = Network.addNetworkStateListener((state) => {
      initialised = true;
      setOnline(!!state.isConnected);
    });

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!initialised) setOnline(!!state.isConnected);
      })
      .catch(() => {
        // getNetworkStateAsync puede fallar en algunas plataformas/versiones de SDK, se ignora
      });

    return subscription.remove;
  });
}
