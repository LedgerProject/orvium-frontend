import { Injectable } from '@angular/core';
import { CommunityDTO, CommunityPrivateDTO } from '../model/api';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  constructor() {
  }

  canUpdateCommunity(community: CommunityDTO | CommunityPrivateDTO): boolean {
    let hasRights = false;

    if (community.actions.includes('update')) {
      return true;
    }

    return hasRights;
  }

  canModerateCommunity(community: CommunityDTO | CommunityPrivateDTO): boolean {
    let hasRights = false;

    if (community.actions.includes('moderate')) {
      return true;
    }

    return hasRights;
  }

}
