import { TestBed } from '@angular/core/testing';

import { BrushShareService } from './brush-share.service';

describe('BrushShare', () => {
    let service: BrushShareService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BrushShareService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
