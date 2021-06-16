import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { DepositsService } from '../deposits.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ProfileService } from '../../profile/profile.service';
import { DepositDTO, InviteDTO, UserPrivateDTO } from '../../model/api';

@Component({
  selector: 'app-deposit-reviewers-invitations',
  templateUrl: './deposit-reviewers-invitations.component.html',
  styleUrls: ['./deposit-reviewers-invitations.component.scss']
})
export class DepositReviewersInvitationsComponent implements OnInit {
  displayedColumns = ['reviewer', 'request_date', 'deadline', 'status'];
  invites: InviteDTO[] = [];
  profile?: UserPrivateDTO;
  deposit: DepositDTO;
  canInviteReviewers = false;

  constructor(private route: ActivatedRoute,
              private orviumService: OrviumService,
              private profileService: ProfileService,
              private depositService: DepositsService,
              public ngxSmartModalService: NgxSmartModalService) {
    this.deposit = this.route.snapshot.data.deposit;
  }

  ngOnInit(): void {
    const profile = this.profileService.profile.getValue();
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

  openInviteReviewerModal(): void {
    this.ngxSmartModalService.open('inviteReviewerModal');
  }
}
