import { ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const build = (query: jest.Mock) =>
    new HealthController({ query } as unknown as DataSource);

  it('responde ok cuando la base de datos contesta', async () => {
    const query = jest.fn().mockResolvedValue([{ '?column?': 1 }]);

    await expect(build(query).check()).resolves.toEqual({ status: 'ok' });
    expect(query).toHaveBeenCalledWith('SELECT 1');
  });

  it('responde 503 sin filtrar el error cuando la base no responde', async () => {
    const query = jest
      .fn()
      .mockRejectedValue(new Error('connect ECONNREFUSED 10.0.0.5:5432'));

    const result = build(query).check();

    await expect(result).rejects.toBeInstanceOf(ServiceUnavailableException);
    await expect(result).rejects.toThrow('Base de datos no disponible');
  });
});
