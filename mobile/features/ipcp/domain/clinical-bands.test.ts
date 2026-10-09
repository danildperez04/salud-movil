// features/ipcp/domain/clinical-bands.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyReading } from './clinical-bands';

const severity = (typeName: string, value: string) => classifyReading(typeName, value)?.severity;

describe('classifyReading', () => {
  it('presión arterial: normal, elevada y crítica', () => {
    assert.equal(severity('Blood pressure', '120/80'), 'normal');
    assert.equal(severity('Blood pressure', '150/85'), 'alert');
    assert.equal(severity('Blood pressure', '165/85'), 'critical');
  });

  it('presión arterial: prevalece el componente más grave', () => {
    assert.equal(severity('Blood pressure', '120/112'), 'critical'); // diastólica crítica
    assert.equal(severity('Blood pressure', '120/95'), 'alert'); // diastólica elevada
    assert.equal(severity('Blood pressure', '85/55'), 'alert'); // hipotensión
  });

  it('presión arterial: acepta el valor solo con la sistólica', () => {
    assert.equal(severity('Blood pressure', '150'), 'alert');
  });

  it('glucosa', () => {
    assert.equal(severity('Glucose', '110'), 'normal');
    assert.equal(severity('Glucose', '130'), 'alert');
    assert.equal(severity('Glucose', '250'), 'critical');
    assert.equal(severity('Glucose', '65'), 'alert');
  });

  it('temperatura: la hipotermia (≤ 35) es crítica aunque también caiga en "hipotermia leve"', () => {
    assert.equal(severity('Temperature', '36.6'), 'normal');
    assert.equal(severity('Temperature', '38'), 'alert');
    assert.equal(severity('Temperature', '39.5'), 'critical');
    assert.equal(severity('Temperature', '35.2'), 'alert');
    assert.equal(severity('Temperature', '34.5'), 'critical');
  });

  it('devuelve el tipo normalizado', () => {
    assert.equal(classifyReading('Blood pressure', '120/80')?.type, 'bloodPressure');
  });

  it('devuelve null para el peso, tipos desconocidos y valores no numéricos', () => {
    assert.equal(classifyReading('Weight', '72.5'), null);
    assert.equal(classifyReading('Unknown', '10'), null);
    assert.equal(classifyReading('Glucose', 'abc'), null);
  });
});
