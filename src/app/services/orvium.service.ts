import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AppNotification,
  Citation,
  Community,
  Deposit,
  DepositsQuery,
  Domain,
  Institution,
  Invite,
  PeerReview,
  Profile
} from '../model/orvium';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class OrviumService {

  public profile = new BehaviorSubject<Profile | undefined>(undefined);

  constructor(private http: HttpClient) {
  }

  // *************************
  // Profile
  // *************************

  updateProfile(profile: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(`${environment.apiEndpoint}/users/profile`, profile).pipe(
      tap(profileUpdated => {
        this.profile.next(profileUpdated);
      })
    );
  }

  sendConfirmationEmail(): Observable<unknown> {
    return this.http.post(`${environment.apiEndpoint}/users/sendConfirmationEmail`, {});
  }

  isUserLoggedIn(): boolean {
    if (this.profile) {
      return true;
    }
    return false;
  }

  getProfile(): Observable<Profile | undefined> {
    return this.profile.asObservable();
  }

  getProfileFromApi(inviteToken?: string): Observable<Profile> {
    let params = new HttpParams();
    return this.http.get<Profile>(`${environment.apiEndpoint}/users/profile`, { params }).pipe(
      tap(profile => {
        console.log('Profile from API returned');
        this.profile.next(profile);
      })
    );
  }

  confirmEmail(token: string): Observable<{message: string}> {
    const params = new HttpParams().set('token', encodeURIComponent(token));
    return this.http.get<{message: string}>(`${environment.apiEndpoint}/users/confirmEmail`, { params });
  }

  sendInvite(emails: string[]): Observable<unknown> {
    return this.http.post(`${environment.apiEndpoint}/users/sendInvitations`, { emails });
  }


  // *************************
  // Deposits
  // *************************

  getDeposit(id: string): Observable<Deposit> {
    return this.http.get<Deposit>(`${environment.apiEndpoint}/deposits/${id}`);
  }

  getDepositVersions(id: string): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/deposits/${id}/versions`);
  }

  getDeposits(query = '', page = 1): Observable<DepositsQuery> {
    let params = new HttpParams()
      .set('page', page.toString());
    if (query) {
      params = params.set('query', query);
    }
    return this.http.get<DepositsQuery>(`${environment.apiEndpoint}/deposits`, { params });
  }

  getMyDeposits(): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/deposits/myDeposits`);
  }

  getPreprintDeposits(): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/deposits/preprintDeposits`);
  }

  getPendingApprovalDeposits(): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/deposits/pendingApprovalDeposits`);
  }


  getMyStarredDeposits(): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/deposits/myStarredDeposits`);
  }

  createDeposit(payload: Partial<Deposit>): Observable<Deposit> {
    return this.http.post<Deposit>(`${environment.apiEndpoint}/deposits`, payload);
  }

  createDepositRevision(id: string): Observable<Deposit> {
    return this.http.post<Deposit>(`${environment.apiEndpoint}/deposits/${id}/createRevision`, {});
  }

  updateDeposit(id: string, payload: Partial<Deposit>): Observable<Deposit> {
    return this.http.patch<Deposit>(`${environment.apiEndpoint}/deposits/${id}`, payload);
  }

  deleteDeposit(id: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiEndpoint}/deposits/${id}`);
  }

  getCitation(id: string): Observable<Citation> {
    return this.http.get<Citation>(`${environment.apiEndpoint}/deposits/${id}/citation`);
  }


  // **************************
  // Deposit files
  // **************************

  deleteDepositFiles(depositId: string, fileId: string): Observable<Deposit> {
    return this.http.delete<Deposit>(`${environment.apiEndpoint}/deposits/${depositId}/files/${fileId}`);
  }


  // **************************
  // Peer Reviews
  // **************************
  getMyReviews(): Observable<PeerReview[]> {
    return this.http.get<PeerReview[]>(`${environment.apiEndpoint}/reviews/myReviews`);
  }

  getPeerReviews(id: string): Observable<PeerReview[]> {
    return this.http.get<PeerReview[]>(`${environment.apiEndpoint}/reviews?depositId=${id}`);
  }

  getPeerReview(reviewId: string): Observable<PeerReview> {
    return this.http.get<PeerReview>(`${environment.apiEndpoint}/reviews/${reviewId}`);
  }

  createReview(payload: Partial<PeerReview>): Observable<PeerReview> {
    return this.http.post<PeerReview>(`${environment.apiEndpoint}/reviews`, payload);
  }

  updatePeerReview(id: string, peerReview: Partial<PeerReview>): Observable<PeerReview> {
    return this.http.patch<PeerReview>(`${environment.apiEndpoint}/reviews/${id}`, peerReview);
  }

  deleteReview(reviewId: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiEndpoint}/reviews/${reviewId}`);
  }


  // *************************
  // Institutions
  // *************************

  getInstitutions(name: string): Observable<Institution[]> {
    if (name.length > 2) {
      const params = new HttpParams().set('name', name);
      return this.http.get<Institution[]>(`${environment.apiEndpoint}/institutions`, { params });
    } else {
      return new Observable<Institution[]>();
    }
  }

  getInstitutionByDomain(domain: string): Observable<Institution> {
    const params = new HttpParams().set('domain', domain);
    return this.http.get<Institution>(`${environment.apiEndpoint}/institutions`, { params });
  }

  // *************************
  // Domains
  // *************************

  getDomains(): Observable<Domain[]> {
    return this.http.get<Domain[]>(`${environment.apiEndpoint}/domains`);
  }

  getDomain(domain: string): Observable<Domain> {
    return this.http.get<Domain>(`${environment.apiEndpoint}/domains/${domain}`);
  }

  // **************************
  // Community
  // **************************

  getCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(`${environment.apiEndpoint}/communities`);
  }

  getMyCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(`${environment.apiEndpoint}/users/myCommunities`);
  }

  getCommunity(communityId: string): Observable<Community> {
    return this.http.get<Community>(`${environment.apiEndpoint}/communities/${communityId}`);
  }

  joinCommunity(communityId: string): Observable<Community> {
    return this.http.post<Community>(`${environment.apiEndpoint}/communities/${communityId}/join`, null);
  }

  getCommunityDeposits(communityId: string): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/communities/${communityId}/deposits`);
  }

  getModeratorDeposits(communityId: string): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(`${environment.apiEndpoint}/communities/${communityId}/moderate/deposits`);
  }

  // *************************
  // Invitations
  // *************************

  createInvitation(payload: Partial<Invite>): Observable<Invite> {
    return this.http.post<Invite>(`${environment.apiEndpoint}/invites`, payload);
  }

  getDepositInvitations(depositId: string): Observable<Invite[]> {
    const params = new HttpParams().set('depositId', depositId);
    return this.http.get<Invite[]>(`${environment.apiEndpoint}/invites`, { params });
  }

  getMyInvitations(): Observable<Invite[]> {
    return this.http.get<Invite[]>(`${environment.apiEndpoint}/invites/myInvites`);
  }

  updateInvite(id: string, payload: Partial<Invite>): Observable<Invite> {
    return this.http.patch<Invite>(`${environment.apiEndpoint}/invites/${id}`, payload);
  }

  login() {
    this.getProfileFromApi().subscribe();
  }

  logout() {
    this.profile.next(undefined);
    console.log('User logged out');
    window.location.reload();
  }
}
