import { TestBed } from '@angular/core/testing';

import { CommunityService } from './community.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommunityService', () => {
  let service: CommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
