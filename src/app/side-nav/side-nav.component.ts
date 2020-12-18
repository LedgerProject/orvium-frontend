import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav.service';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../model/orvium';
import { Router } from '@angular/router';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  profile: Profile;
  smallScreen = false;
  tinyScreen = false;
  mobileQuery: MediaQueryList;
  mobileQueryListener: () => void;

  constructor(private sidenavService: SidenavService,
              private snackBar: MatSnackBar,
              public router: Router,
              public orviumService: OrviumService,
              public breakpointObserver: BreakpointObserver,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              @Inject(PLATFORM_ID) private platformId: any) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    if (isPlatformBrowser(platformId)) {
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    }
  }


  ngOnInit() {
    this.sidenavService.setSidenav(this.sidenav);

    this.breakpointObserver.observe(['(min-width: 768px)', '(min-width: 500px)'])
      .subscribe(result => {
        this.smallScreen = !result.breakpoints['(min-width: 768px)'];
        this.tinyScreen = !result.breakpoints['(min-width: 500px)'];
      });

    if (!this.smallScreen && !this.tinyScreen) {
      this.toggleSidenav();
    }

    this.orviumService.getProfile().subscribe(profile => {
      this.profile = profile;
    });
  }

  isReviewer() {
    if (!this.profile?.isReviewer) {
      this.snackBar.open('Complete your profile first to become a Reviewer', null, { panelClass: ['info-snackbar'] });
    }
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  closeSidenav() {
    if (this.tinyScreen || this.smallScreen) {
      this.sidenavService.close();
    }
  }
}
