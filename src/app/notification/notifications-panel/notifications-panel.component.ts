import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { NotificationService } from '../notification.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { AppNotificationDTO } from '../../model/api';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {

  notifications: AppNotificationDTO[] = [];

  constructor(private sidenavService: SidenavService,
              private notificationService: NotificationService,
              private snackBar: AppSnackBarService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.notificationService.getNotifications()
      .subscribe(notifications => {
        const newNotifications = notifications.length > this.notifications.length;
        this.notifications = notifications;

        if (newNotifications) {
          this.snackBar.info('You have new notifications!');
        }
      });

    this.router.events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart)
    ).subscribe(event => {
      this.sidenavService.closeRight();
    });
  }

  toggleSidenav(): void {
    this.sidenavService.toggleRight();
  }

  deleteNotification(index: number, $event: MouseEvent): void {
    this.notificationService.readNotification(this.notifications[index]._id).subscribe(() => {
      this.notifications.splice(index, 1);
    });
    $event.stopPropagation();
  }
}
