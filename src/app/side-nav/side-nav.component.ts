import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav.service';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../model/orvium';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { InviteComponent } from '../invite/invite.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  profile: Profile;
  smallScreen = false;

  constructor(private sidenavService: SidenavService,
              private snackBar: MatSnackBar,
              public router: Router,
              public orviumService: OrviumService,
              public breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              @Inject(PLATFORM_ID) private platformId: string,
              @Inject(DOCUMENT) private document: Document) {
  }


  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    this.orviumService.getProfile().subscribe(profileRefreshed => {
      if (profileRefreshed) {
        this.profile = profileRefreshed;
      }
    });
    this.breakpointObserver.observe('(max-width: 768px)')
      .subscribe(result => {
        console.log('screen', result);
        this.smallScreen = result.matches;
      });

    if (!this.smallScreen) {
      this.toggleSidenav();
    }
  }

  isReviewer(): void {
    if (!this.profile?.isOnboarded) {
      this.snackBar.open('Complete your profile first to become a reviewer', 'Dismiss', { panelClass: ['info-snackbar'] });
    } else if (!this.profile?.isReviewer) {
      this.router.navigateByUrl('/reviews');
    }
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }

  closeSidenav(): void {
    if (this.smallScreen) {
      this.sidenavService.close();
    }
  }

  openInviteDialog(): void {
    if (!this.profile.isOnboarded) {
      this.snackBar.open('You need to complete your profile first',
        'Dismiss',
        { panelClass: ['info-snackbar'] });
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
