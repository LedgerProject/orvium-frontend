import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav.service';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { InviteComponent } from '../invite/invite.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { ProfileService } from '../profile/profile.service';
import { AppSnackBarService } from '../services/app-snack-bar.service';
import { UserPrivateDTO } from '../model/api';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav?: MatSidenav;
  @ViewChild('rightSidenav', { static: true }) rightSidenav?: MatSidenav;
  profile?: UserPrivateDTO;
  smallScreen = false;

  constructor(
    private sidenavService: SidenavService,
    private snackBar: AppSnackBarService,
    public router: Router,
    private profileService: ProfileService,
    public breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    if (this.sidenav) {
      this.sidenavService.setSidenav(this.sidenav);
    }
    if (this.rightSidenav) {
      this.sidenavService.setRightSidenav(this.rightSidenav);
    }
    this.profileService.getProfile().subscribe(profileRefreshed => {
      if (profileRefreshed) {
        this.profile = profileRefreshed;
      }
    });
    this.breakpointObserver.observe('(max-width: 768px)')
      .subscribe(result => {
        this.smallScreen = result.matches;
      });

    if (!this.smallScreen) {
      this.toggleSidenav();
    }
  }

  isReviewer(): void {
    if (!this.profile?.isOnboarded || !this.profile?.emailConfirmed) {
      this.snackBar.info('Complete your profile & confirm your email first to become a reviewer');
    } else if (!this.profile?.isReviewer) {
      this.router.navigateByUrl('/reviews');
    }
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }

  toggleRightSidenav(): void {
    this.sidenavService.toggleRight();
  }

  closeSidenav(): void {
    if (this.smallScreen) {
      this.sidenavService.close();
      this.sidenavService.closeRight();
    }

  }

  openInviteDialog(): void {
    if (this.profile && !this.profile.isOnboarded) {
      this.snackBar.info('You need to complete your profile first');
      return;
    }

    const dialogRef = this.dialog.open(InviteComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The invite dialog was closed');
    });
  }

  resetPosition(): void {
    const content = this.document.getElementById('sidenav-content');
    if (content) {
      content.scrollTop = 0;
    }
  }
}
