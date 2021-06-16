import { Injectable } from '@angular/core';
import { DEPOSIT_STATUS, DepositDTO, REVIEW_STATUS, ReviewDTO, UserPrivateDTO } from '../model/api';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor() {
  }

  canReadReview(user: UserPrivateDTO | undefined, review: ReviewDTO): boolean {
    let hasRights = false;

    // owner has access
    if (user && review.owner === user.userId) {
      hasRights = true;
    }

    // admin has access
    if (user && user.roles.includes('admin')) {
      hasRights = true;
    }

    if (review.status === REVIEW_STATUS.published) {
      hasRights = true;
    }

    return hasRights;
  }

  canUpdateReview(user: UserPrivateDTO | undefined, review: ReviewDTO): boolean {
    let hasRights = false;

    if (!user) {
      return false;
    }

    // If deposit is published then restrict the update
    if (user && user.userId === review.owner && review.status === REVIEW_STATUS.draft) {
      hasRights = true;
    }

    // Admin can update
    if (user.roles.includes('admin')) {
      hasRights = true;
    }

    return hasRights;
  }

  canDeleteReview(user: UserPrivateDTO | undefined, review: ReviewDTO): boolean {
    let hasRights = false;

    if (!user) {
      return false;
    }

    // If deposit is published then restrict the update
    if (user.userId === review.owner && review.status === REVIEW_STATUS.draft) {
      hasRights = true;
    }

    // Admin can update
    if (user.roles.includes('admin')) {
      hasRights = true;
    }

    return hasRights;
  }

  canCreateReview(user: UserPrivateDTO | undefined, deposit: DepositDTO): boolean {
    if (!user) {
      return false;
    }

    // Admin can update
    if (user.roles.includes('admin')) {
      return true;
    }

    // User needs to be onboarded
    if (!user.isReviewer) {
      return false;
    }

    // Owner of the deposit cannot create review
    if (deposit.owner === user.userId) {
      return false;
    }

    // Deposits in draft cannot be reviewed yet
    if (deposit.status === DEPOSIT_STATUS.draft) {
      return false;
    }

    return true;
  }
}
