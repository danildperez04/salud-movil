// lib/i18n/locales.test.ts
// Guardas de calidad de los textos. El compilador ya obliga a que el criollo tenga las mismas
// claves que el español; esto revisa lo que los tipos no ven: marcadores, vacíos y español copiado.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resources } from './index';
import { LANGUAGE_PROFILES } from './languages';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') flat[path] = value;
    else Object.assign(flat, flatten(value, path));
  }
  return flat;
}

const es = flatten(resources[LANGUAGE_PROFILES.es.locale] as Tree);
const bzk = flatten(resources[LANGUAGE_PROFILES.bzk.locale] as Tree);

/** Textos que por su naturaleza se escriben igual en español y en criollo. */
const SAME_IN_BOTH: readonly RegExp[] = [
  /^[\d\s:.,+\-/A-Za-z%{}()]*$/, // solo cifras, siglas, símbolos o marcadores: "000000", "A+", "{{count}}"
  /\.(brand|codePlaceholder|emailPlaceholder)$/, // nombre de la marca y ejemplos de formato
  /\.(cancel|confirm|admin)$/, // palabras que el criollo toma tal cual del inglés y del español
];

/** Textos del criollo que conservan una letra del español (nombres propios). */
const SPANISH_LETTERS_OK: readonly RegExp[] = [/\.brand$/, /\.waitTitle$/];

const placeholders = (text: string) =>
  [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();

describe('textos del criollo', () => {
  it('tienen exactamente las mismas claves que el español', () => {
    assert.deepEqual(Object.keys(bzk).sort(), Object.keys(es).sort());
  });

  it('ninguno está vacío', () => {
    for (const [key, text] of Object.entries(bzk)) {
      assert.notEqual(text.trim(), '', key);
    }
  });

  it('conservan los mismos marcadores {{...}} que el español', () => {
    for (const key of Object.keys(es)) {
      assert.deepEqual(placeholders(bzk[key]), placeholders(es[key]), key);
    }
  });

  it('no son una copia del español (salvo los textos que se escriben igual)', () => {
    const copied = Object.keys(es).filter(
      (key) =>
        bzk[key] === es[key] && !SAME_IN_BOTH.some((same) => same.test(es[key]) || same.test(key)),
    );
    assert.deepEqual(copied, [], 'textos sin traducir al criollo');
  });

  it('no llevan signos ni letras del español', () => {
    const spanish = /[¿¡ñáéíóúü]/i;
    const offenders = Object.entries(bzk)
      .filter(([key, text]) => spanish.test(text) && !SPANISH_LETTERS_OK.some((ok) => ok.test(key)))
      .map(([key]) => key);
    assert.deepEqual(offenders, [], 'textos del criollo con ortografía del español');
  });
});
