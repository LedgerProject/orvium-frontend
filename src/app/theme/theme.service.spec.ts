import { TestBed } from '@angular/core/testing';

import { THEMES, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toogle theme', () => {
    service.toggleTheme();
    expect(service.getTheme().value).toEqual(THEMES.dark);
  });
});
