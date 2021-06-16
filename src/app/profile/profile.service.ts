import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserPrivateDTO } from '../model/api';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public profile = new BehaviorSubject<UserPrivateDTO | undefined>(undefined);

  constructor(private http: HttpClient) {
  }

  updateProfile(profile: Partial<UserPrivateDTO>): Observable<UserPrivateDTO> {
    return this.http.patch<UserPrivateDTO>(`${environment.apiEndpoint}/users/profile`, profile).pipe(
      tap(profileUpdated => {
        this.profile.next(profileUpdated);
      })
    );
  }

  sendConfirmationEmail(): Observable<unknown> {
    return this.http.post(`${environment.apiEndpoint}/users/sendConfirmationEmail`, {});
  }

  getProfile(): Observable<UserPrivateDTO | undefined> {
    return this.profile.asObservable();
  }

  getProfileFromApi(): Observable<UserPrivateDTO> {
    let params = new HttpParams();
    const inviteToken = sessionStorage.getItem('inviteToken');
    if (inviteToken) {
      params = params.set('inviteToken', inviteToken);
    }
    return this.http.get<UserPrivateDTO>(`${environment.apiEndpoint}/users/profile`, { params }).pipe(
      tap(profile => {
        console.log('Profile from API returned');
        this.profile.next(profile);
      })
    );
  }

  getPublicProfile(id: string): Observable<UserPrivateDTO> {
    return this.http.get<UserPrivateDTO>(`${environment.apiEndpoint}/users/profile/${id}`);
  }

  confirmEmail(token: string): Observable<{ message: string }> {
    const params = new HttpParams().set('token', encodeURIComponent(token));
    return this.http.get<{ message: string }>(`${environment.apiEndpoint}/users/confirmEmail`, { params });
  }

  sendInvite(emails: string[]): Observable<unknown> {
    return this.http.post(`${environment.apiEndpoint}/users/sendInvitations`, { emails });
  }

  login(): void {
    this.getProfileFromApi().subscribe();
  }

  logout(): void {
    this.profile.next(undefined);
    console.log('User logged out');
    window.location.reload();
  }
}
