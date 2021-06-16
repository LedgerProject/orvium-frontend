import { Component, OnInit } from '@angular/core';
import { ShareService } from 'ngx-sharebuttons';
import { REVIEW_DECISION_LOV } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { Meta, Title } from '@angular/platform-browser';
import { ProfileService } from '../profile.service';
import { CommunityDTO, DepositDTO, ReviewDTO, UserPrivateDTO, UserPublicDTO } from '../../model/api';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {
  publicProfile: UserPublicDTO;
  deposits: DepositDTO[] = [];
  reviews: ReviewDTO[] = [];
  communities: CommunityDTO[] = [];
  isUser = false;
  profile?: UserPrivateDTO;

  constructor(public share: ShareService,
              private route: ActivatedRoute,
              private orviumService: OrviumService,
              private titleService: Title,
              private profileService: ProfileService,
              private metaService: Meta,) {
    this.publicProfile = this.route.snapshot.data.profile;
  }

  ngOnInit(): void {
    this.route.data?.pipe().subscribe(async data => {
      this.publicProfile = this.route.snapshot.data.profile;
      this.profileService.getProfile().subscribe(profile => {
        if (profile) {
          this.profile = profile;
          this.profile.userId == this.publicProfile.userId ? this.isUser = true : this.isUser = false;
        }
      });
      this.orviumService.getProfileDeposits(this.publicProfile.userId).subscribe(deposits => {
        this.deposits = deposits;
      });
      this.orviumService.getPeerReviews('', this.publicProfile.userId).subscribe((response) => {
        this.reviews = response;
        for (let review of this.reviews) {
          if (review.decision) {
            const decision = REVIEW_DECISION_LOV.find(x => x.value === review.decision);
            if (decision) {
              // TODO check why was decision.viewValue??
              review.decision = decision.value;
            }
          }
        }
      });
      this.communities = this.publicProfile.communities;
      this.setSEOTags();
    });
  }

  public setSEOTags(): void {
    if (this.publicProfile.firstName && this.publicProfile.lastName) {
      this.titleService.setTitle(this.publicProfile.firstName + ' ' + this.publicProfile.lastName + ' | Orvium profile');
    }
    this.metaService.addTags([
      {
        name: 'description',
        content: this.publicProfile.aboutMe || this.publicProfile.nickname + ' Orvium user public profile.'
      },
    ]);
  }
}
