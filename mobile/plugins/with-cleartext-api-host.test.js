// plugins/with-cleartext-api-host.test.js
const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { cleartextHost, networkSecurityConfig } = require('./with-cleartext-api-host');

describe('cleartextHost', () => {
  it('devuelve el host (sin puerto ni ruta) de una URL http', () => {
    assert.equal(cleartextHost('http://158.23.21.222/api'), '158.23.21.222');
    assert.equal(cleartextHost('http://api.ejemplo.test:8080/api'), 'api.ejemplo.test');
  });

  it('con https no se habilita nada', () => {
    assert.equal(cleartextHost('https://salud-movil.onrender.com'), null);
  });

  it('una URL vacía o inválida no habilita nada', () => {
    assert.equal(cleartextHost(undefined), null);
    assert.equal(cleartextHost(''), null);
    assert.equal(cleartextHost('no es una url'), null);
  });
});

describe('networkSecurityConfig', () => {
  it('permite HTTP solo para ese host, sin subdominios', () => {
    const xml = networkSecurityConfig('158.23.21.222');
    assert.match(xml, /cleartextTrafficPermitted="true"/);
    assert.match(xml, /<domain includeSubdomains="false">158\.23\.21\.222<\/domain>/);
    assert.equal(xml.match(/<domain /g).length, 1);
  });
});
