import { Component, Input, OnInit } from '@angular/core';
import { PeerReview, Profile, REVIEW_DECISION, REVIEW_STATUS } from '../../model/orvium';
import { OrviumService } from '../../services/orvium.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deposits-reviews-table',
  templateUrl: './deposits-reviews-table.component.html',
  styleUrls: ['./deposits-reviews-table.component.scss']
})
export class DepositsReviewsTableComponent implements OnInit {
  @Input() reviews: PeerReview[];
  @Input() basic = false;

  reviewColumnsToDisplay = ['author', 'creationDate', 'publicationDate', 'status', 'decision', 'file', 'actions'];
  reviewColumnsToDisplayBasic = ['author', 'status'];
  REVIEW_STATUS = REVIEW_STATUS;
  REVIEW_DECISION = REVIEW_DECISION;
  environment = environment;
  selectedReviewer: unknown;
  profile: Profile;

  constructor(private orviumService: OrviumService) {
  }

  ngOnInit(): void {
    this.orviumService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });
  }
}
