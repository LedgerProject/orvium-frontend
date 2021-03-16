import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public showBanner = false;
  private bannerKey = 'banner-cookie-consent-accepted';

  constructor(public orviumService: OrviumService,
              private snackBar: MatSnackBar,
              @Inject(PLATFORM_ID) private platformId: string) {

    if (isPlatformBrowser(platformId)) {
      const accepted = localStorage.getItem(this.bannerKey) === 'accepted';
      if (!accepted) {
        this.showBanner = true;
      }
    }
  }

  ngOnInit(): void {
  }

  onSend(event: object): void {
  }

  dismissBanner(): void {
    this.showBanner = false;
    localStorage.setItem(this.bannerKey, 'accepted');
  }
}
