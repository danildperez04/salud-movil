// Extiende app.json con la configuración de tamaño del build Android.
// expo-build-properties solo actúa en `expo prebuild` (EAS lo corre en cada build).

// EAS define EAS_BUILD_PROFILE; en local (`expo run:android`) queda vacío.
const isReleaseBuild = ['preview', 'production', 'apk'].includes(
  process.env.EAS_BUILD_PROFILE ?? '',
);

module.exports = ({ config }) => ({
  ...config,
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
          ...(isReleaseBuild && { buildArchs: ['arm64-v8a', 'armeabi-v7a'] }),
        },
      },
    ],
  ],
});
