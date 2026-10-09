// features/auth/domain/login-response.test.ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AuthResponse, TwoFactorChallengeResponse } from '@/types/auth';
import { isMobileRoleAllowed, isSession, isTwoFactorChallenge } from './login-response';

const challenge: TwoFactorChallengeResponse = {
  requiresTwoFactor: true,
  challengeId: 'abc',
  expiresAt: '2026-10-08T12:05:00.000Z',
};
const session = { accessToken: 'token', user: { role: 'patient' } } as AuthResponse;

describe('isTwoFactorChallenge / isSession', () => {
  it('distingue el desafío de la sesión por requiresTwoFactor', () => {
    assert.equal(isTwoFactorChallenge(challenge), true);
    assert.equal(isSession(challenge), false);
    assert.equal(isTwoFactorChallenge(session), false);
    assert.equal(isSession(session), true);
  });
});

describe('isMobileRoleAllowed', () => {
  it('solo permite paciente y cuidador', () => {
    assert.equal(isMobileRoleAllowed('patient'), true);
    assert.equal(isMobileRoleAllowed('caregiver'), true);
    assert.equal(isMobileRoleAllowed('admin'), false);
    assert.equal(isMobileRoleAllowed('health_staff'), false);
  });
});
