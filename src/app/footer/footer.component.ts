import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Feedback } from '../shared/feedback/entity/feedback';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public showBanner = false;
  private bannerKey = 'banner-cookie-consent-accepted';

  constructor(
    private orviumService: OrviumService,
    public profileService: ProfileService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: string) {

    if (isPlatformBrowser(platformId)) {
      const accepted = localStorage.getItem(this.bannerKey) === 'accepted';
      if (!accepted) {
        this.showBanner = true;
      }
    }
  }

  onSend(event: object): void {
    const feedback = event as Feedback;
    this.orviumService.createFeedback(feedback).subscribe(data => {
      this.snackBar.open('Thank you for your feedback!', 'Dismiss',
        { panelClass: ['ok-snackbar'] });
    });
  }

  dismissBanner(): void {
    this.showBanner = false;
    localStorage.setItem(this.bannerKey, 'accepted');
  }
}
