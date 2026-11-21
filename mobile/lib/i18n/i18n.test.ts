// lib/i18n/i18n.test.ts
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { applyLanguage, i18n } from './index';
import {
  AVAILABLE_LANGUAGES,
  LANGUAGE_PROFILES,
  isAvailableLanguage,
  resolveLanguage,
} from './languages';

afterEach(() => applyLanguage('es'));

describe('resolveLanguage', () => {
  it('respeta los idiomas con traducción', () => {
    assert.equal(resolveLanguage('es'), 'es');
    assert.equal(resolveLanguage('bzk'), 'bzk');
  });

  it('lo que no tiene traducción cae en español', () => {
    for (const code of ['miq', 'yan', 'ulw', 'cab', 'rma', 'en', '', undefined]) {
      assert.equal(resolveLanguage(code), 'es');
    }
    assert.equal(isAvailableLanguage('miq'), false);
  });
});

describe('perfiles de idioma', () => {
  it('cada idioma se registra con una etiqueta que Intl entiende', () => {
    for (const language of AVAILABLE_LANGUAGES) {
      const { locale } = LANGUAGE_PROFILES[language];
      assert.deepEqual(Intl.PluralRules.supportedLocalesOf([locale]), [locale]);
    }
  });

  // Si algún día Intl/CLDR incorpora `bzk`, este test falla y la etiqueta `en-NI` ya no hace falta.
  it('bzk no existe en Intl: por eso el criollo se registra como inglés de Nicaragua', () => {
    assert.deepEqual(Intl.PluralRules.supportedLocalesOf(['bzk']), []);
    assert.notEqual(LANGUAGE_PROFILES.bzk.locale, 'bzk');
  });

  it('el criollo usa los plurales del inglés, no los del idioma del teléfono', () => {
    const rule = new Intl.PluralRules(LANGUAGE_PROFILES.bzk.locale);
    assert.deepEqual([...rule.resolvedOptions().pluralCategories].sort(), ['one', 'other']);
    assert.equal(rule.select(1), 'one');
    assert.equal(rule.select(0), 'other');
    assert.equal(rule.select(2), 'other');
  });
});

describe('applyLanguage', () => {
  it('arranca en español', () => {
    assert.equal(i18n.t('save'), 'Guardar');
  });

  it('cambia todos los textos al criollo y vuelve', () => {
    applyLanguage('bzk');
    assert.equal(i18n.t('retry'), 'Try agen');
    assert.equal(i18n.t('errors.unexpected'), 'Someting go wrong. Try agen.');

    applyLanguage('es');
    assert.equal(i18n.t('retry'), 'Reintentar');
  });

  it('un idioma sin traducción deja la app en español', () => {
    applyLanguage('miq');
    assert.equal(i18n.t('retry'), 'Reintentar');
  });

  it('lo que falta en el criollo se muestra en español, nunca como una clave', () => {
    i18n.addResource('es', 'common', 'soloEspanol', 'Solo existe en español');
    applyLanguage('bzk');
    assert.equal(i18n.t('soloEspanol' as never), 'Solo existe en español');
  });

  it('interpola valores y aplica plurales con las reglas del idioma activo', () => {
    i18n.addResources('es', 'common', {
      saludo: 'Hola {{name}}',
      item_one: '{{count}} cosa',
      item_other: '{{count}} cosas',
    });
    i18n.addResources('en-NI', 'common', {
      saludo: 'Hi {{name}}',
      item_one: '{{count}} ting',
      item_other: '{{count}} tings',
    });

    assert.equal(i18n.t('saludo' as never, { name: 'Ana' }), 'Hola Ana');
    assert.equal(i18n.t('item' as never, { count: 1 }), '1 cosa');

    applyLanguage('bzk');
    assert.equal(i18n.t('saludo' as never, { name: 'Ana' }), 'Hi Ana');
    assert.equal(i18n.t('item' as never, { count: 0 }), '0 tings');
    assert.equal(i18n.t('item' as never, { count: 1 }), '1 ting');
    assert.equal(i18n.t('item' as never, { count: 3 }), '3 tings');
  });
});
