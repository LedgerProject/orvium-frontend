import { TestBed } from '@angular/core/testing';

import { DisciplinesService } from './disciplines.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DisciplinesService', () => {
  let service: DisciplinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DisciplinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
