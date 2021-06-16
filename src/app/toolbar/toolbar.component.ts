import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EthereumService } from '../blockchain/ethereum.service';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OrviumService } from '../services/orvium.service';
import { SidenavService } from '../services/sidenav.service';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../theme/theme.service';
import { NotificationService } from '../notification/notification.service';
import { ProfileService } from '../profile/profile.service';
import { AppSnackBarService } from '../services/app-snack-bar.service';
import { finalize } from 'rxjs/operators';
import { AppNotificationDTO, USER_TYPE, UserPrivateDTO } from '../model/api';
import { OrvSpinnerService } from '@orvium/ux-components';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  searchInput = '';
  isReviewer = false;
  ethereumIsEnabled = false;
  notifications: AppNotificationDTO[] = [];
  profile?: UserPrivateDTO;
  smallScreen = false;
  newPublicationForm: FormGroup;
  newPublicationWithDOIForm: FormGroup;
  USER_TYPE = USER_TYPE;
  isAdmin = false;

  constructor(
    public ethereumService: EthereumService,
    public router: Router,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private sidenavService: SidenavService,
    public orviumService: OrviumService,
    private profileService: ProfileService,
    private snackBar: AppSnackBarService,
    public ngxSmartModalService: NgxSmartModalService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private spinnerService: OrvSpinnerService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.newPublicationForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.pattern(/.*\S.*/)]],
    });

    this.newPublicationWithDOIForm = this.formBuilder.group({
      doi: [null, [Validators.required, Validators.pattern(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i)]],
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 768px)')
      .subscribe(result => {
        this.smallScreen = result.matches;
      });

    if (isPlatformBrowser(this.platformId)) {
      this.profileService.getProfile().subscribe(profile => {
        this.profile = profile;
        if (this.profile) {
          this.isAdmin = this.profile.roles.includes('admin');
        }
      });

    }

    this.notificationService.getNotifications()
      .subscribe(notifications => {
        const newNotifications = notifications.length > this.notifications.length;
        this.notifications = notifications;
      });
  }

  searchPapers(): void {
    this.router.navigate(['/search'],
      { queryParams: { query: this.searchInput, page: 1, size: 10 }, queryParamsHandling: 'merge' });
  }

  toggleBlockchain($event: MatSlideToggleChange): void {
    if ($event.checked) {
      this.ethereumService.init().then(value => {
        $event.source.checked = value;
        this.ethereumIsEnabled = value;
      });
    } else {
      $event.source.checked = false;
      this.ethereumIsEnabled = false;
      this.ethereumService.close();
    }
  }

  deleteNotification(index: number, $event: MouseEvent): void {
    this.notificationService.readNotification(this.notifications[index]._id).subscribe(() => {
      this.notifications.splice(index, 1);
    });
    $event.stopPropagation();
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }

  toggleRightSidenav(): void {
    this.sidenavService.toggleRight();
  }

  create(): void {
    if (!this.profile?.isOnboarded || !this.profile?.emailConfirmed) {
      this.snackBar.info('Complete your profile & confirm your email first');
    } else {
      this.ngxSmartModalService.open('createNewDeposit');
    }
  }


  createWithDOI(): void {
    this.ngxSmartModalService.close('createNewDeposit');
    this.ngxSmartModalService.open('createNewDepositWithDOI');
  }

  save(): void {
    if (this.newPublicationForm.get('title')?.value !== '' && this.newPublicationForm.get('title')?.value !== null) {
      this.orviumService.createDeposit({ title: this.newPublicationForm.get('title')?.value }).subscribe(response => {
        this.newPublicationForm.reset();
        this.router.navigate(['deposits', response._id, 'edit']);
      });
    } else {
      this.snackBar.error('Please, enter a title for your publication');
      this.newPublicationForm.reset();
    }
    this.close();
  }


  saveWithDOI(): void {
    if (this.newPublicationWithDOIForm.get('doi')?.value !== '' && this.newPublicationWithDOIForm.get('doi')?.value !== null) {
      this.spinnerService.show();
      this.orviumService.createDepositWithDOI({
        title: 'Publication title',
        doi: this.newPublicationWithDOIForm.get('doi')?.value
      }).pipe(finalize(() => {
        this.spinnerService.hide();
      })).subscribe(response => {
        this.spinnerService.hide();
        this.newPublicationWithDOIForm.reset();
        this.router.navigate(['deposits', response._id, 'edit']);
      });
    } else {
      this.snackBar.error('Please, enter a DOI');
      this.newPublicationWithDOIForm.reset();
    }
    this.close();
  }

  close(): void {
    this.newPublicationForm.reset();
    this.ngxSmartModalService.close('createNewDeposit');
    this.ngxSmartModalService.close('createNewDepositWithDOI');
  }

  changeTheme(): void {
    this.themeService.toggleTheme();
  }

  login(): void {
    this.profileService.login();
  }

  logout(): void {
    this.profileService.logout();
  }
}
