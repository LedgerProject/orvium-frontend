import { TestBed } from '@angular/core/testing';

import { AppSnackBarService } from './app-snack-bar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AppSnackBarService', () => {
  let service: AppSnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule]
    });
    service = TestBed.inject(AppSnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
