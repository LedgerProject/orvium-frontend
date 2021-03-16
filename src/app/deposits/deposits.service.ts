import { Injectable } from '@angular/core';
import { Community, Deposit, DEPOSIT_STATUS, Profile } from '../model/orvium';

@Injectable({
  providedIn: 'root'
})
export class DepositsService {

  constructor() {
  }

  canUpdateDeposit(profile: Profile | undefined, deposit: Deposit): boolean {
    let hasRights = false;

    if (!profile) {
      return false;
    }

    const community = deposit.community as unknown as Community;

    // If deposit is published then restrict the update
    if (profile.userId === deposit.owner && deposit.status === DEPOSIT_STATUS.draft) {
      hasRights = true;
    }

    // Moderator can update
    if (community && profile.roles.includes(`moderator:${community._id}`)) {
      hasRights = true;
    }

    // Admin can update
    if (profile.roles.includes('admin')) {
      hasRights = true;
    }

    return hasRights;
  }

  canManageDeposit(profile: Profile | undefined, deposit: Deposit): boolean {
    let hasRights = false;

    if (!profile) {
      return false;
    }

    const community = deposit.community as unknown as Community;

    // If deposit is published then restrict the update
    if (profile.userId === deposit.owner) {
      hasRights = true;
    }

    // Moderator can update
    if (community && profile.roles.includes(`moderator:${community._id}`)) {
      hasRights = true;
    }

    // Admin can update
    if (profile.roles.includes('admin')) {
      hasRights = true;
    }

    return hasRights;
  }

  canModerateDeposit(profile: Profile | undefined, deposit: Deposit): boolean {
    let hasRights = false;

    if (!profile) {
      return false;
    }

    const community = deposit.community as unknown as Community;

    if (community && profile.roles.includes(`moderator:${community._id}`)) {
      hasRights = true;
    }

    if (profile.roles.includes('admin')) {
      hasRights = true;
    }
    return hasRights;
  }

  canInviteReviewers(profile: Profile | undefined, deposit: Deposit): boolean {
    let hasRights = false;

    if (!profile) {
      return false;
    }

    // deposits in preprint, inreview and published can invite reviewers but only owners and admins
    if (deposit.status === DEPOSIT_STATUS.preprint ||
      deposit.status === DEPOSIT_STATUS.inReview ||
      deposit.status === DEPOSIT_STATUS.published) {

      if (profile.roles.includes('admin')) {
        hasRights = true;
      }

      if (profile && deposit.owner === profile.userId) {
        hasRights = true;
      }
    }
    return hasRights;
  }

  canCreateVersion(profile: Profile | undefined, deposit: Deposit): boolean {
    let hasRights = false;

    // If deposit is not
    if (profile && profile.userId === deposit.owner && deposit.status !== DEPOSIT_STATUS.draft
      && deposit.status !== DEPOSIT_STATUS.pendingApproval) {
      hasRights = true;
    }

    // Admin can create version
    if (profile && profile.roles.includes('admin')) {
      hasRights = true;
    }

    return hasRights;
  }
}
