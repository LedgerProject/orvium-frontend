import { Component, OnInit } from '@angular/core';
import { Deposit, Invite, Profile } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { DepositsService } from '../deposits.service';

@Component({
  selector: 'app-deposit-reviewers-invitations',
  templateUrl: './deposit-reviewers-invitations.component.html',
  styleUrls: ['./deposit-reviewers-invitations.component.scss']
})
export class DepositReviewersInvitationsComponent implements OnInit {
  displayedColumns = ['reviewer', 'request_date', 'deadline', 'status'];
  invites: Invite[] = [];
  profile: Profile;
  deposit: Deposit;
  canInviteReviewers = false;

  constructor(private route: ActivatedRoute,
              private orviumService: OrviumService,
              private depositService: DepositsService) {
  }

  ngOnInit(): void {
    this.deposit = this.route.snapshot.data.deposit;
    const profile = this.orviumService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }

    this.orviumService.getDepositInvitations(this.deposit._id).subscribe((response) => {
      this.invites = response;
    });
    this.canInviteReviewers = this.depositService.canInviteReviewers(this.profile, this.deposit);
  }

  refresh(): void {
    this.orviumService.getDepositInvitations(this.deposit._id).subscribe((response) => {
      this.invites = response;
    });
  }
}
