/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BrowserService } from './browser.service';

describe('Service: Browser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserService]
    });
  });

  it('should ...', inject([BrowserService], (service: BrowserService) => {
    expect(service).toBeTruthy();
  }));
});
