import { Component, OnDestroy, OnInit } from '@angular/core';
import { EthereumService } from '../services/ethereum.service';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OrviumService } from '../services/orvium.service';
import { AppNotification, Deposit, Profile } from '../model/orvium';
import { SidenavService } from '../services/sidenav.service';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  networkName: string;
  searchInput = '';
  isReviewer = false;
  ethereumIsAvailable: boolean;
  ethereumIsEnabled = false;
  notifications: AppNotification[];
  private notificationSubscription: Subscription;
  profile: Profile;
  smallScreen = false;
  tinyScreen = false;
  public newTitle;

  constructor(public ethereumService: EthereumService,
              public router: Router,
              public dialog: MatDialog,
              public breakpointObserver: BreakpointObserver,
              private sidenavService: SidenavService,
              public orviumService: OrviumService,
              private snackBar: MatSnackBar,
              public ngxSmartModalService: NgxSmartModalService) {
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(min-width: 768px)', '(min-width: 500px)'])
      .subscribe(result => {
        this.smallScreen = !result.breakpoints['(min-width: 768px)'];
        this.tinyScreen = !result.breakpoints['(min-width: 500px)'];
      });

    if (this.ethereumService.isAvailable()) {
      this.ethereumIsAvailable = this.ethereumService.isAvailable();
    }

    this.orviumService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;

        const notificationTimer = timer(0, 60000);

        this.notificationSubscription = notificationTimer.subscribe(
          x => this.orviumService.getNotifications().subscribe(notifications => {
              if (notifications.length > 0 &&
                JSON.stringify(notifications) !== JSON.stringify(this.notifications)) {
                this.notifications = notifications;
                this.snackBar.open('You have new notifications!',
                  null,
                  { panelClass: ['ok-snackbar'] });
              }
            }
          )
        );
      } else {
        this.profile = null;
      }
    });

    if (localStorage.getItem('metamask') && localStorage.getItem('metamask') === 'true') {
      this.ethereumService.init().then(value => {
        this.ethereumIsEnabled = value;
      });
    }
  }

  searchPapers() {
    this.router.navigate(['/search'],
      { queryParams: { query: this.searchInput, page: 1, size: 10 }, queryParamsHandling: 'merge' });
  }

  toggleBlockchain($event: MatSlideToggleChange) {
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

  deleteNotification(index, $event: MouseEvent) {
    this.orviumService.readNotification(this.notifications[index]._id.$oid).subscribe(() => {
      this.notifications.splice(index, 1);
    });
    $event.stopPropagation();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  create(): void {
    this.ngxSmartModalService.open('createDeposit');
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
  }

  save() {
    if (this.newTitle !== '') {
      const deposit = new Deposit();
      deposit.authors = [];
      deposit.abstract = '';
      deposit.title = this.newTitle;
      deposit.publicationDate = new Date().toISOString();
      this.orviumService.createDeposit(deposit).subscribe(response => {
        this.router.navigate(['deposits', response._id.$oid, 'edit']);
      });
    } else {
      this.snackBar.open('Please, enter a title for your publication', null, { panelClass: ['error-snackbar'] });
    }
    this.close();
  }

  close() {
    this.ngxSmartModalService.close('createDeposit');
    this.newTitle = '';
  }

  login() {
    this.orviumService.login();
  }

  logout() {
    this.orviumService.logout();
  }
}
