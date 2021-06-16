import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { ProfileService } from '../../profile/profile.service';
import { CommunityDTO, DepositDTO, UserPrivateDTO } from '../../model/api';
import { CommunityService } from '../community.service';

@Component({
  selector: 'app-moderator-panel',
  templateUrl: './moderator-panel.component.html',
  styleUrls: ['./moderator-panel.component.scss']
})
export class ModeratorPanelComponent implements OnInit {
  deposits: DepositDTO[] = [];
  profile?: UserPrivateDTO;
  community!: CommunityDTO;
  isModerator = false;

  constructor(private route: ActivatedRoute,
              private orviumService: OrviumService,
              private profileService: ProfileService,
              private communityService: CommunityService
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.community = data.community;
      if (!this.community) {
        throw new Error('Community not found');
      }
      this.init();
    });
  }

  private init(): void {
    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
        this.isModerator = this.communityService.canModerateCommunity(this.community);
      }
    });
    this.orviumService.getModeratorDeposits(this.community._id).subscribe(deposits => {
      this.deposits = deposits;
    });
  }
}
