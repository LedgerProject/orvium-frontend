import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DepositsQuery } from '../model/orvium';
import { OrviumService } from '../services/orvium.service';
import { Observable } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { CommunityDTO, DepositDTO, ReviewDTO, UserPrivateDTO, UserSummaryDTO, CommunityPrivateDTO } from '../model/api';


@Injectable()
export class DepositResolver implements Resolve<DepositDTO> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepositDTO> {
    return this.orviumService.getDeposit(route.paramMap.get('depositId') || '');
  }
}


@Injectable()
export class DepositListResolver implements Resolve<DepositsQuery> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepositsQuery> {
    const query = route.queryParamMap.get('query') || '';
    const doi = route.queryParamMap.get('doi') || '';
    const orcid = route.queryParamMap.get('orcid') || '';
    const status = route.queryParamMap.get('status') || '';
    const from = route.queryParamMap.get('from') || '';
    const until = route.queryParamMap.get('until') || '';
    const discipline = route.queryParamMap.get('discipline') || '';
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.orviumService.getDeposits(query, doi, orcid, discipline, from, until, status, page);
  }
}

@Injectable()
export class ProfileResolver implements Resolve<UserPrivateDTO> {
  constructor(private profileService: ProfileService) {
  }

  resolve(): Observable<UserPrivateDTO> {
    return this.profileService.getProfileFromApi();
  }
}

@Injectable()
export class PublicProfileResolver implements Resolve<UserSummaryDTO> {
  constructor(private profileService: ProfileService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<UserSummaryDTO> {
    return this.profileService.getPublicProfile(route.paramMap.get('nickname') || '');
  }
}

@Injectable()
export class PeerReviewResolver implements Resolve<ReviewDTO> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ReviewDTO> {
    return this.orviumService.getPeerReview(route.paramMap.get('reviewId') || '');
  }
}

@Injectable()
export class CommunityResolver implements Resolve<CommunityDTO | CommunityPrivateDTO> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<CommunityDTO | CommunityPrivateDTO> {
    return this.orviumService.getCommunity(route.paramMap.get('communityId') || '');
  }
}

