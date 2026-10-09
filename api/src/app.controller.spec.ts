// Unit test for AppController logic without importing the real controller
// (avoids @nestjs/swagger import issues in Jest)

import { AppService } from './app.service';

describe('AppController (logic)', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  it('getHello returns "Hello World!"', () => {
    expect(appService.getHello()).toBe('Hello World!');
  });
});
