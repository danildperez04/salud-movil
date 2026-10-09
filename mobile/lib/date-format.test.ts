// lib/date-format.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hhmmToTimeLabel, timeLabelToMinutes } from './date-format';

describe('hhmmToTimeLabel', () => {
  it('pasa la hora de 24 h a 12 h con AM/PM', () => {
    assert.equal(hhmmToTimeLabel('08:00'), '08:00 AM');
    assert.equal(hhmmToTimeLabel('14:30'), '02:30 PM');
  });

  it('medianoche y mediodía', () => {
    assert.equal(hhmmToTimeLabel('00:05'), '12:05 AM');
    assert.equal(hhmmToTimeLabel('12:00'), '12:00 PM');
  });

  it('es la inversa de timeLabelToMinutes', () => {
    assert.equal(timeLabelToMinutes(hhmmToTimeLabel('21:45')), 21 * 60 + 45);
  });
});
