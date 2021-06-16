import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../../profile/profile.service';
import { REVIEW_DECISION, REVIEW_STATUS, ReviewDTO, UserPrivateDTO } from 'src/app/model/api';

@Component({
  selector: 'app-deposits-reviews-table',
  templateUrl: './deposits-reviews-table.component.html',
  styleUrls: ['./deposits-reviews-table.component.scss']
})
export class DepositsReviewsTableComponent implements OnInit {
  @Input() reviews: ReviewDTO[] = [];
  @Input() basic = false;

  reviewColumnsToDisplay = ['author', 'creationDate', 'publicationDate', 'status', 'decision', 'file', 'actions'];
  reviewColumnsToDisplayBasic = ['author', 'status', 'actions'];
  REVIEW_STATUS = REVIEW_STATUS;
  REVIEW_DECISION = REVIEW_DECISION;
  environment = environment;
  selectedReviewer: unknown;
  profile?: UserPrivateDTO;

  constructor(
    private profileService: ProfileService,
  ) {
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });
  }
}
