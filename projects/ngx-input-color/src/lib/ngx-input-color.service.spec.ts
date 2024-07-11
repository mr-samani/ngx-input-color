import { TestBed } from '@angular/core/testing';

import { NgxInputColorService } from './ngx-input-color.service';

describe('NgxInputColorService', () => {
  let service: NgxInputColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxInputColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
