// Extiende app.json con la configuración de tamaño y endurecimiento del build Android.
// expo-build-properties solo actúa en `expo prebuild` (EAS lo corre en cada build).

// EAS define EAS_BUILD_PROFILE; en local (`expo run:android`) queda vacío.
const profile = process.env.EAS_BUILD_PROFILE ?? '';
const isReleaseBuild = ['preview', 'production', 'apk'].includes(profile);
// `apk` es el instalable de distribución directa (sin Play Store): ahí cada MB se descarga.
const isDirectApk = profile === 'apk';

module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    // Datos de salud: que Android no los copie a la nube del usuario ni a otro dispositivo.
    allowBackup: false,
    // Permiso de depuración (dibujar sobre otras apps) que las librerías de desarrollo agregan al
    // manifiesto; en un build de usuarios no debe estar.
    ...(isReleaseBuild && { blockedPermissions: ['android.permission.SYSTEM_ALERT_WINDOW'] }),
  },
  plugins: [
    ...(config.plugins ?? []),
    [
      'expo-build-properties',
      {
        android: {
          // R8 + recursos sin usar: solo afectan a las variantes release.
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          // x86/x86_64 solo sirven para emuladores: en un APK de teléfonos reales
          // son ~46 MB de librerías nativas que nadie ejecuta. En desarrollo local
          // se dejan las 4 para no romper el emulador.
          // El APK directo lleva solo arm64-v8a (todo teléfono 64-bit, o sea casi cualquiera
          // desde 2017); el AAB de Play conserva armeabi-v7a porque Play entrega a cada
          // teléfono únicamente su arquitectura.
          ...(isReleaseBuild && {
            buildArchs: isDirectApk ? ['arm64-v8a'] : ['arm64-v8a', 'armeabi-v7a'],
          }),
          // Las librerías nativas (24 MB sin comprimir, 7,5 MB comprimidas) se guardan
          // comprimidas dentro del APK. Se instalan extraídas, así que el arranque no cambia;
          // solo se descarga menos. En el AAB no hace falta: Play ya comprime la descarga.
          ...(isDirectApk && { useLegacyPackaging: true }),
        },
      },
    ],
  ],
});
