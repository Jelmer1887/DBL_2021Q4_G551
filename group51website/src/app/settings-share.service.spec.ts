import { TestBed } from '@angular/core/testing';

import { SettingsShareService } from './settings-share.service';

describe('SettingsShareService', () => {
  let service: SettingsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
