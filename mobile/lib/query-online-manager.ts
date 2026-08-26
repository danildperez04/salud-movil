import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

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
        // getNetworkStateAsync can fail on some platforms/SDK versions; ignore and rely on the listener.
      });

    return subscription.remove;
  });
}
