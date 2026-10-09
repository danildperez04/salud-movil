// features/language/domain/language-options.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { languageOptions } from './language-options';

const options = languageOptions('Próximamente');
const byValue = Object.fromEntries(options.map((option) => [option.value, option]));

describe('languageOptions', () => {
  it('lista todas las lenguas de la Costa Caribe, no solo las traducidas', () => {
    assert.deepEqual(
      options.map((option) => option.value),
      ['es', 'bzk', 'miq', 'yan', 'ulw', 'cab', 'rma'],
    );
  });

  it('español y criollo se pueden elegir', () => {
    for (const code of ['es', 'bzk']) {
      assert.equal(byValue[code].disabled, undefined, code);
      assert.equal(byValue[code].hint, undefined, code);
    }
  });

  it('las lenguas sin traducción quedan deshabilitadas y dicen "Próximamente"', () => {
    for (const code of ['miq', 'yan', 'ulw', 'cab', 'rma']) {
      assert.equal(byValue[code].disabled, true, code);
      assert.equal(byValue[code].hint, 'Próximamente', code);
    }
  });

  it('cada lengua se nombra en sí misma', () => {
    assert.equal(byValue.es.label, 'Español');
    assert.equal(byValue.bzk.label, 'Inglés Creole (Kriol)');
    assert.equal(byValue.miq.label, 'Mískito');
  });
});
