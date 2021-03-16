import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, concat, Observable, timer } from 'rxjs';
import { AppNotification } from '../model/orvium';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { first, retry, switchMap, tap } from 'rxjs/operators';
import { OrviumService } from '../services/orvium.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<AppNotification[]>([]);

  constructor(
    private http: HttpClient,
    private appRef: ApplicationRef,
    private orviumService: OrviumService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {

    if (!isPlatformBrowser(platformId)) {
      return;
    }

    const appIsStable = appRef.isStable.pipe(first(isStable => isStable));
    const profileLogged = this.orviumService.getProfile().pipe(
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

  private getNotificationsFromApi(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${environment.apiEndpoint}/notifications/myNotifications`);
  }

  readNotification(notificationId: string): Observable<unknown> {
    return this.http.patch(`${environment.apiEndpoint}/notifications/${notificationId}/read`, null);
  }

  getNotifications(): BehaviorSubject<AppNotification[]> {
    return this.notifications;
  }
}
