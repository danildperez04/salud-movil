// features/emergency/domain/emergency-contact.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { contactsFromPatient } from './emergency-contact';

describe('contactsFromPatient', () => {
  it('el contacto de la ficha del paciente es el principal', () => {
    assert.deepEqual(
      contactsFromPatient({
        emergencyContactName: ' María Martínez ',
        emergencyContactPhoneNumber: '+505 8888 8888',
      }),
      [
        {
          id: 'patient',
          name: 'María Martínez',
          relation: 'other',
          phone: '+505 8888 8888',
          isPrimary: true,
        },
      ],
    );
  });

  it('sin nombre ni teléfono no hay contacto', () => {
    assert.deepEqual(
      contactsFromPatient({ emergencyContactName: ' ', emergencyContactPhoneNumber: '' }),
      [],
    );
  });
});
