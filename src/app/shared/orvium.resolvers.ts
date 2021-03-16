import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Community, Deposit, DepositsQuery, PeerReview, Profile } from '../model/orvium';
import { OrviumService } from '../services/orvium.service';
import { Observable } from 'rxjs';


@Injectable()
export class DepositResolver implements Resolve<Deposit> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Deposit> {
    return this.orviumService.getDeposit(route.paramMap.get('depositId') || '');
  }
}


@Injectable()
export class DepositListResolver implements Resolve<DepositsQuery> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DepositsQuery> {
    const query = route.queryParamMap.get('query') || '';
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);

    return this.orviumService.getDeposits(query, page);
  }
}


@Injectable()
export class ProfileResolver implements Resolve<Profile> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(): Observable<Profile> {
    return this.orviumService.getProfileFromApi();
  }
}

@Injectable()
export class PeerReviewResolver implements Resolve<PeerReview> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<PeerReview> {
    return this.orviumService.getPeerReview(route.paramMap.get('reviewId') || '');
  }
}

@Injectable()
export class CommunityResolver implements Resolve<Community> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Community> {
    return this.orviumService.getCommunity(route.paramMap.get('communityId') || '');
  }
}

