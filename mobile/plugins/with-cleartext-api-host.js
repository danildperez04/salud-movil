// Permite HTTP sin cifrar SOLO hacia el host de la API, y solo cuando EXPO_PUBLIC_API_URL es
// `http://`. Android 9+ bloquea el tráfico HTTP por defecto; habilitarlo para toda la app
// (`usesCleartextTraffic`) dejaría sin protección cualquier otra conexión.
//
// Con una URL `https://` este plugin no hace nada: al ponerle TLS al servidor basta con cambiar
// la URL en eas.json.
const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');

const HOST_PATTERN = /^[a-z0-9.-]+$/i;

/** Host de la API si la URL es `http://`; null si es `https://`, está vacía o no es válida. */
function cleartextHost(apiUrl) {
  if (!apiUrl) return null;

  let url;
  try {
    url = new URL(apiUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:') return null;
  if (!HOST_PATTERN.test(url.hostname)) {
    throw new Error(`with-cleartext-api-host: host no válido "${url.hostname}"`);
  }
  return url.hostname;
}

function networkSecurityConfig(host) {
  return `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">${host}</domain>
  </domain-config>
</network-security-config>
`;
}

function withCleartextApiHost(config, { apiUrl } = {}) {
  const host = cleartextHost(apiUrl);
  if (!host) return config;

  config = withDangerousMod(config, [
    'android',
    (modConfig) => {
      const dir = path.join(modConfig.modRequest.platformProjectRoot, 'app/src/main/res/xml');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'network_security_config.xml'), networkSecurityConfig(host));
      return modConfig;
    },
  ]);

  return withAndroidManifest(config, (modConfig) => {
    const application = modConfig.modResults.manifest.application[0];
    application.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return modConfig;
  });
}

module.exports = withCleartextApiHost;
module.exports.cleartextHost = cleartextHost;
module.exports.networkSecurityConfig = networkSecurityConfig;
