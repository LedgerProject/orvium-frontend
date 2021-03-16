import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EthereumService } from '../blockchain/ethereum.service';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OrviumService } from '../services/orvium.service';
import { AppNotification, Profile } from '../model/orvium';
import { SidenavService } from '../services/sidenav.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { ThemeService } from '../theme/theme.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  networkName: string;
  searchInput = '';
  isReviewer = false;
  ethereumIsAvailable: boolean;
  ethereumIsEnabled = false;
  notifications: AppNotification[] = [];
  profile: Profile;
  smallScreen = false;
  clientId: string;
  redirectUrl: string;
  newPublicationForm: FormGroup;

  constructor(public ethereumService: EthereumService,
              public router: Router,
              public dialog: MatDialog,
              public breakpointObserver: BreakpointObserver,
              private sidenavService: SidenavService,
              public orviumService: OrviumService,
              private snackBar: MatSnackBar,
              public ngxSmartModalService: NgxSmartModalService,
              private themeService: ThemeService,
              private notificationService: NotificationService,
              @Inject(PLATFORM_ID) private platformId: string) {
  }

  ngOnInit(): void {

    this.newPublicationForm = new FormGroup({
      title: new FormControl(''),
    });

    this.breakpointObserver.observe('(max-width: 768px)')
      .subscribe(result => {
        this.smallScreen = result.matches;
      });

    if (isPlatformBrowser(this.platformId)) {
      this.orviumService.getProfile().subscribe(profile => {
        if (profile) {
          this.profile = profile;
        }
      });

      this.ethereumIsAvailable = this.ethereumService.isAvailable();
    }

    this.notificationService.getNotifications()
      .subscribe(notifications => {
        const newNotifications = notifications.length > this.notifications.length;
        this.notifications = notifications;

        if (newNotifications) {
          this.snackBar.open('You have new notifications!',
            'Dismiss',
            { panelClass: ['ok-snackbar'] });
        }
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

  create(): void {
    if (!this.profile?.isOnboarded) {
      this.snackBar.open('Complete your profile first to create publications', 'Dismiss', { panelClass: ['info-snackbar'] });
    } else {
      this.ngxSmartModalService.open('createNewDeposit');
    }
  }

  save(): void {
    if (this.newPublicationForm.get('title')?.value !== '' && this.newPublicationForm.get('title')?.value !== null) {
      this.orviumService.createDeposit({ title: this.newPublicationForm.get('title')?.value }).subscribe(response => {
        this.newPublicationForm.reset();
        this.router.navigate(['deposits', response._id, 'edit']);
      });
    } else {
      this.snackBar.open('Please, enter a title for your publication', 'Dismiss', { panelClass: ['error-snackbar'] });
      this.newPublicationForm.reset();
    }
    this.close();
  }

  close(): void {
    this.newPublicationForm.reset();
    this.ngxSmartModalService.close('createNewDeposit');
  }

  changeTheme(): void {
    this.themeService.toggleTheme();
  }

  login() {
    this.orviumService.login();
  }

  logout() {
    this.orviumService.logout();
  }
}
