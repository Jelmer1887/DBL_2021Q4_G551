import { TestBed } from '@angular/core/testing';

import { ForceGraphDataShareService } from './force-graph-data-share.service';

describe('ForceGraphDataShareService', () => {
  let service: ForceGraphDataShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForceGraphDataShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
