import { TestBed } from '@angular/core/testing';

import { CustomValidationServiceService } from './custom-validation-service.service';

describe('CustomValidationServiceService', () => {
  let service: CustomValidationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomValidationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
