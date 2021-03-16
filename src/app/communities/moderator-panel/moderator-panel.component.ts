import { Component, OnInit } from '@angular/core';
import { Community, Deposit, Profile } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';

@Component({
  selector: 'app-moderator-panel',
  templateUrl: './moderator-panel.component.html',
  styleUrls: ['./moderator-panel.component.scss']
})
export class ModeratorPanelComponent implements OnInit {
  deposits: Deposit[] = [];
  profile: Profile;
  community: Community;
  isModerator = false;
  constructor(private route: ActivatedRoute,
              private orviumService: OrviumService) { }

  ngOnInit(): void {
    this.route.data.pipe().subscribe(async data => {
      this.community = data.community;
    });
    this.orviumService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
        this.isModerator = this.profile.roles.includes('moderator:' + this.community._id);
      }
    });
    this.orviumService.getModeratorDeposits(this.community._id).subscribe(deposits => {
      this.deposits = deposits;
    });
  }

}
