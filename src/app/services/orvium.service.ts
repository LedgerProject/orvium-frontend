import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Citation, DepositsQuery, TopDisciplinesQuery, } from '../model/orvium';
import { environment } from '../../environments/environment';
import { Feedback } from '../shared/feedback/entity/feedback';
import { map } from 'rxjs/operators';
import {
  CommentDTO,
  CommunityDTO,
  CommunityPrivateDTO,
  CreateDepositDTO,
  CreateInstitutionDTO,
  CreateReviewDTO,
  DepositDTO,
  DomainDTO,
  InstitutionDTO,
  InviteDTO,
  ReviewDTO
} from '../model/api';


@Injectable({ providedIn: 'root' })
export class OrviumService {

  constructor(private http: HttpClient) {
  }

  // *************************
  // Deposits
  // *************************

  getDeposit(id: string): Observable<DepositDTO> {
    return this.http.get<DepositDTO>(`${environment.apiEndpoint}/deposits/${id}`);
  }

  getDepositVersions(id: string): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/deposits/${id}/versions`);
  }

  getDeposits(query = '', doi = '', orcid = '', discipline = '', from = '', until = '', status = '', page = 1): Observable<DepositsQuery> {
    let params = new HttpParams()
      .set('page', page.toString());
    if (query) {
      params = params.set('query', query);
    }
    if (doi) {
      params = params.set('doi', doi);
    }
    if (orcid) {
      params = params.set('orcid', orcid);
    }
    if (discipline) {
      params = params.set('discipline', discipline);
    }
    if (from) {
      params = params.set('from', from);
    }
    if (until) {
      params = params.set('until', until);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<DepositsQuery>(`${environment.apiEndpoint}/deposits`, { params });
  }

  getMyDeposits(): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/deposits/myDeposits`);
  }

  getProfileDeposits(userId: string): Observable<DepositDTO[]> {
    let params = new HttpParams().set('userId', userId);
    let depositsQueryObservable = this.http.get<DepositsQuery>(`${environment.apiEndpoint}/deposits`, { params });
    return depositsQueryObservable.pipe(
      map(query => query.deposits)
    );
  }

  getPapersToReview(): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/deposits/papersToReview`);
  }

  getPendingApprovalDeposits(): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/deposits/pendingApprovalDeposits`);
  }

  getMyStarredDeposits(): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/deposits/myStarredDeposits`);
  }

  createDeposit(payload: CreateDepositDTO): Observable<DepositDTO> {
    return this.http.post<DepositDTO>(`${environment.apiEndpoint}/deposits`, payload);
  }

  createDepositWithDOI(payload: Partial<DepositDTO>): Observable<DepositDTO> {
    return this.http.post<DepositDTO>(`${environment.apiEndpoint}/deposits/createWithDOI`, payload);
  }

  createDepositRevision(id: string): Observable<DepositDTO> {
    return this.http.post<DepositDTO>(`${environment.apiEndpoint}/deposits/${id}/createRevision`, {});
  }

  updateDeposit(id: string, payload: Partial<DepositDTO>): Observable<DepositDTO> {
    return this.http.patch<DepositDTO>(`${environment.apiEndpoint}/deposits/${id}`, payload);
  }

  deleteDeposit(id: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiEndpoint}/deposits/${id}`);
  }

  getCitation(id: string): Observable<Citation> {
    return this.http.get<Citation>(`${environment.apiEndpoint}/deposits/${id}/citation`);
  }

  addComment(id: string, payload: Partial<CommentDTO>): Observable<DepositDTO> {
    return this.http.post<DepositDTO>(`${environment.apiEndpoint}/deposits/${id}/comments`, payload);
  }

  deleteComment(id: string, commentId: string): Observable<DepositDTO> {
    return this.http.delete<DepositDTO>(`${environment.apiEndpoint}/deposits/${id}/comments/${commentId}`);
  }

  getTopDisciplines(): Observable<TopDisciplinesQuery[]> {
    return this.http.get<TopDisciplinesQuery[]>(`${environment.apiEndpoint}/deposits/topDisciplines`);
  }

  // **************************
  // Deposit files
  // **************************

  /*eslint-disable */
  getPresignedURL(depositId: string, filename: string): Observable<any> {
    return this.http.get<any>(`${environment.apiEndpoint}/deposits/${depositId}/files/${filename}/presigned`);
  }

  /*eslint-disable */

  deleteDepositFiles(depositId: string, fileId: string): Observable<DepositDTO> {
    return this.http.delete<DepositDTO>(`${environment.apiEndpoint}/deposits/${depositId}/files/${fileId}`);
  }


  // **************************
  // Peer Reviews
  // **************************
  getMyReviews(): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${environment.apiEndpoint}/reviews/myReviews`);
  }

  getPeerReviews(id: string = '', owner: string = ''): Observable<ReviewDTO[]> {
    let params = new HttpParams();
    if (id) {
      params = params.set('depositId', id);
    }
    if (owner) {
      params = params.set('owner', owner);
    }
    return this.http.get<ReviewDTO[]>(`${environment.apiEndpoint}/reviews`, { params });
  }

  getPeerReview(reviewId: string): Observable<ReviewDTO> {
    return this.http.get<ReviewDTO>(`${environment.apiEndpoint}/reviews/${reviewId}`);
  }

  createReview(payload: CreateReviewDTO): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(`${environment.apiEndpoint}/reviews`, payload);
  }

  updatePeerReview(id: string, peerReview: Partial<ReviewDTO>): Observable<ReviewDTO> {
    return this.http.patch<ReviewDTO>(`${environment.apiEndpoint}/reviews/${id}`, peerReview);
  }

  deleteReview(reviewId: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiEndpoint}/reviews/${reviewId}`);
  }

  // **************************
  // Feedback
  // **************************

  createFeedback(feedback: Feedback): Observable<unknown> {
    return this.http.post(`${environment.apiEndpoint}/feedback`, feedback);
  }

  // *************************
  // Institutions
  // *************************

  getInstitutions(name: string): Observable<InstitutionDTO[]> {
    if (name.length > 2) {
      const params = new HttpParams().set('name', name);
      return this.http.get<InstitutionDTO[]>(`${environment.apiEndpoint}/institutions`, { params });
    } else {
      return new Observable<InstitutionDTO[]>();
    }
  }

  getInstitutionByDomain(domain: string): Observable<InstitutionDTO> {
    const params = new HttpParams().set('domain', domain);
    return this.http.get<InstitutionDTO>(`${environment.apiEndpoint}/institutions`, { params });
  }

  createInstitution(payload: CreateInstitutionDTO): Observable<InstitutionDTO> {
    return this.http.post<InstitutionDTO>(`${environment.apiEndpoint}/institutions`, payload);
  }

  updateUsersInstitution(): Observable<void> {
    return this.http.patch<void>(`${environment.apiEndpoint}/institutions`, null);
  }

  // *************************
  // Domains
  // *************************

  getDomains(): Observable<DomainDTO[]> {
    return this.http.get<DomainDTO[]>(`${environment.apiEndpoint}/domains`);
  }

  getDomain(domain: string): Observable<DomainDTO> {
    return this.http.get<DomainDTO>(`${environment.apiEndpoint}/domains/${domain}`);
  }

  // **************************
  // Community
  // **************************

  getCommunities(): Observable<CommunityDTO[]> {
    return this.http.get<CommunityDTO[]>(`${environment.apiEndpoint}/communities`);
  }

  getCommunity(communityId: string): Observable<CommunityDTO | CommunityPrivateDTO> {
    return this.http.get<CommunityDTO | CommunityPrivateDTO>(`${environment.apiEndpoint}/communities/${communityId}`);
  }

  joinCommunity(communityId: string): Observable<CommunityDTO> {
    return this.http.post<CommunityDTO>(`${environment.apiEndpoint}/communities/${communityId}/join`, null);
  }

  getCommunityDeposits(communityId: string): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/communities/${communityId}/deposits`);
  }

  getModeratorDeposits(communityId: string): Observable<DepositDTO[]> {
    return this.http.get<DepositDTO[]>(`${environment.apiEndpoint}/communities/${communityId}/moderate/deposits`);
  }

  updateCommunity(id: string, payload: Partial<CommunityPrivateDTO>): Observable<CommunityPrivateDTO> {
    return this.http.patch<CommunityPrivateDTO>(`${environment.apiEndpoint}/communities/${id}`, payload);
  }

  // *************************
  // Invitations
  // *************************

  createInvitation(payload: Partial<InviteDTO>): Observable<InviteDTO> {
    return this.http.post<InviteDTO>(`${environment.apiEndpoint}/invites`, payload);
  }

  getDepositInvitations(depositId: string): Observable<InviteDTO[]> {
    const params = new HttpParams().set('depositId', depositId);
    return this.http.get<InviteDTO[]>(`${environment.apiEndpoint}/invites`, { params });
  }

  getMyInvitations(): Observable<InviteDTO[]> {
    return this.http.get<InviteDTO[]>(`${environment.apiEndpoint}/invites/myInvites`);
  }

  getMyInvitationForDeposit(depositId: string): Observable<boolean> {
    const params = new HttpParams().set('id', depositId);
    console.log(params);
    return this.http.get<boolean>(`${environment.apiEndpoint}/invites/myInvitesForDeposit`, { params });
  }

  updateInvite(id: string, payload: Partial<InviteDTO>): Observable<InviteDTO> {
    return this.http.patch<InviteDTO>(`${environment.apiEndpoint}/invites/${id}`, payload);
  }

  inviteReviewerToken(token: string): Observable<{ message: string }> {
    let params = new HttpParams()
      .set('inviteReviewerToken', encodeURIComponent(token));
    return this.http.get<{ message: string }>(`${environment.apiEndpoint}/invites/inviteReviewerToken`, { params });
  }
}
