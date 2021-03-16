import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export enum THEMES {
  light = 'light-theme',
  dark = 'dark-theme',
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = new BehaviorSubject<string>(THEMES.light);

  constructor(
    private overlayContainer: OverlayContainer,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.setInitialTheme();
  }

  getTheme(): BehaviorSubject<string> {
    return this.theme;
  }

  toggleTheme(): THEMES {
    let nextTheme: THEMES;
    if (this.theme.getValue() === THEMES.light) {
      nextTheme = THEMES.dark;
      this.overlayContainer.getContainerElement().classList.remove(THEMES.light);
      this.overlayContainer.getContainerElement().classList.add(THEMES.dark);
    } else {
      nextTheme = THEMES.light;
      this.overlayContainer.getContainerElement().classList.remove(THEMES.dark);
      this.overlayContainer.getContainerElement().classList.add(THEMES.light);
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', nextTheme);
    }

    this.theme.next(nextTheme);
    return nextTheme;
  }

  private setInitialTheme(): void {
    let theme = THEMES.light;
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme') as THEMES;
      if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
        theme = storedTheme;
      }
    }
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.theme.next(theme);
  }
}
