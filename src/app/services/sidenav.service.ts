import { Injectable } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private sidenav?: MatSidenav;
  private rightSidenav?: MatSidenav;

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  public setRightSidenav(rightSidenav: MatSidenav): void {
    this.rightSidenav = rightSidenav;
  }

  public open(): Promise<MatDrawerToggleResult> {
    if (!this.sidenav) {
      throw new Error('Left sidenav not available');
    }
    return this.sidenav.open();
  }

  public close(): Promise<MatDrawerToggleResult> {
    if (!this.sidenav) {
      throw new Error('Left sidenav not available');
    }
    return this.sidenav.close();
  }

  public openRight(): Promise<MatDrawerToggleResult> {
    if (!this.rightSidenav) {
      throw new Error('Right sidenav not available');
    }
    return this.rightSidenav.open();
  }

  public closeRight(): Promise<MatDrawerToggleResult> {
    if (!this.rightSidenav) {
      throw new Error('Right sidenav not available');
    }
    return this.rightSidenav.close();
  }

  public toggle(): Promise<MatDrawerToggleResult> {
    if (!this.sidenav) {
      throw new Error('Left sidenav not available');
    }
    return this.sidenav.toggle();
  }

  public toggleRight(): Promise<MatDrawerToggleResult> {
    if (!this.rightSidenav) {
      throw new Error('Right sidenav not available');
    }
    return this.rightSidenav.toggle();
  }

}
