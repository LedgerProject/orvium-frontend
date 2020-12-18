import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Deposit, DepositsQuery, PeerReview, Profile } from '../model/orvium';
import { OrviumService } from '../services/orvium.service';


@Injectable()
export class DepositResolver implements Resolve<Deposit> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.orviumService.getDeposit(route.paramMap.get('depositId'));
  }
}


@Injectable()
export class DepositListResolver implements Resolve<DepositsQuery> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const query = route.queryParamMap.get('query') || '';
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    const pageSize = parseInt(route.queryParamMap.get('pageSize') || '10', 10);
    const drafts = route.queryParamMap.get('drafts') || 'no';
    const starred = route.queryParamMap.get('starred') || 'no';
    const inReview = route.queryParamMap.get('inReview') || 'no';

    return this.orviumService.getDeposits(query, page, pageSize, drafts, starred, inReview);
  }
}


@Injectable()
export class ProfileResolver implements Resolve<Profile> {
  constructor(private orviumService: OrviumService) {
  }

  resolve() {
    return this.orviumService.getProfileFromApi();
  }
}

@Injectable()
export class PeerReviewResolver implements Resolve<PeerReview> {
  constructor(private orviumService: OrviumService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.orviumService.getPeerReview(route.paramMap.get('depositId'), route.paramMap.get('reviewId'));
  }
}

