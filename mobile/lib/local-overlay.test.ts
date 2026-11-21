// lib/local-overlay.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clearLocalOverlays, createLocalOverlay, isLocalId, newLocalId } from './local-overlay';

type Item = { id: string; name: string };

const remote: Item[] = [
  { id: 'a', name: 'uno' },
  { id: 'b', name: 'dos' },
];

describe('createLocalOverlay', () => {
  it('sin cambios devuelve los datos del backend tal cual', () => {
    assert.deepEqual(createLocalOverlay<Item>().apply(remote), remote);
  });

  it('un elemento nuevo se agrega al final', () => {
    const overlay = createLocalOverlay<Item>();
    overlay.upsert({ id: 'local-1', name: 'nuevo' });
    assert.deepEqual(
      overlay.apply(remote).map((item) => item.id),
      ['a', 'b', 'local-1'],
    );
  });

  it('un elemento existente se reemplaza en su lugar', () => {
    const overlay = createLocalOverlay<Item>();
    overlay.upsert({ id: 'a', name: 'editado' });
    assert.deepEqual(overlay.apply(remote), [{ id: 'a', name: 'editado' }, remote[1]]);
  });

  it('remove oculta el elemento y descarta su edición local', () => {
    const overlay = createLocalOverlay<Item>();
    overlay.upsert({ id: 'a', name: 'editado' });
    overlay.remove('a');
    assert.deepEqual(overlay.apply(remote), [remote[1]]);
  });

  it('upsert después de remove lo vuelve a mostrar', () => {
    const overlay = createLocalOverlay<Item>();
    overlay.remove('a');
    overlay.upsert({ id: 'a', name: 'de vuelta' });
    assert.equal(overlay.apply(remote)[0].name, 'de vuelta');
  });

  it('clearLocalOverlays descarta los cambios de todos los overlays', () => {
    const overlay = createLocalOverlay<Item>();
    overlay.upsert({ id: 'local-1', name: 'nuevo' });
    overlay.remove('b');
    clearLocalOverlays();
    assert.deepEqual(overlay.apply(remote), remote);
  });
});

describe('newLocalId', () => {
  it('genera ids reconocibles y distintos', () => {
    const [first, second] = [newLocalId(), newLocalId()];
    assert.ok(isLocalId(first) && isLocalId(second));
    assert.notEqual(first, second);
    assert.equal(isLocalId('3f2b8c1e-0000-4000-8000-000000000000'), false);
  });
});
