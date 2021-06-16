import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, concat, Observable, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { first, retry, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ProfileService } from '../profile/profile.service';
import { AppNotificationDTO } from '../model/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<AppNotificationDTO[]>([]);

  constructor(
    private http: HttpClient,
    private appRef: ApplicationRef,
    private profileService: ProfileService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {

    if (!isPlatformBrowser(platformId)) {
      return;
    }

    const appIsStable = appRef.isStable.pipe(first(isStable => isStable));
    const profileLogged = this.profileService.getProfile().pipe(
      first(profile => profile !== undefined));
    const notificationsPolling = timer(1000, 60000).pipe(
      switchMap(tick => this.getNotificationsFromApi()),
      retry(2),
      tap(notifications => {
        // Update notifications observable
        if (notifications.length > 0 &&
          JSON.stringify(notifications) !== JSON.stringify(this.notifications.getValue())) {
          this.notifications.next(notifications);
        }
      })
    );

    concat(appIsStable, profileLogged, notificationsPolling).subscribe();
  }

  readNotification(notificationId: string): Observable<unknown> {
    return this.http.patch(`${environment.apiEndpoint}/notifications/${notificationId}/read`, null);
  }

  getNotifications(): BehaviorSubject<AppNotificationDTO[]> {
    return this.notifications;
  }

  private getNotificationsFromApi(): Observable<AppNotificationDTO[]> {
    return this.http.get<AppNotificationDTO[]>(`${environment.apiEndpoint}/notifications/myNotifications`);
  }
}
