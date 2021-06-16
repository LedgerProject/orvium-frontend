import { Component, OnInit } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { InviteDTO, REVIEW_STATUS, ReviewDTO } from '../../model/api';

@Component({
  selector: 'app-invitations-panel',
  templateUrl: './invitations-panel.component.html',
  styleUrls: ['./invitations-panel.component.scss']
})
export class InvitationsPanelComponent implements OnInit {
  displayedColumns = ['publication', 'author', 'deadline', 'action'];
  invites: InviteDTO[] = [];
  inProgress: ReviewDTO[] = [];
  resolved: ReviewDTO[] = [];

  constructor(private orviumService: OrviumService) {
  }

  ngOnInit(): void {
    this.orviumService.getMyInvitations().subscribe((response) => {
      this.invites = response;
    });
    this.orviumService.getMyReviews().subscribe((response) => {
      this.inProgress = response.filter(review => review.status === REVIEW_STATUS.draft);
      this.resolved = response.filter(review => review.status === REVIEW_STATUS.published);
    });
  }
}
