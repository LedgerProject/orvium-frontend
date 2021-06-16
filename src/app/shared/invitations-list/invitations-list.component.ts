import { Component, Input, OnInit } from '@angular/core';
import { OrviumService } from 'src/app/services/orvium.service';
import { finalize } from 'rxjs/operators';
import { ReviewService } from '../../review/review.service';
import { ProfileService } from '../../profile/profile.service';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { DepositDTO, INVITE_STATUS, INVITE_TYPE, InviteDTO, UserPrivateDTO } from '../../model/api';
import { OrvSpinnerService } from '@orvium/ux-components';

@Component({
  selector: 'app-invitations-list',
  templateUrl: './invitations-list.component.html',
  styleUrls: ['./invitations-list.component.scss']
})
export class InvitationsListComponent implements OnInit {
  profile?: UserPrivateDTO;
  displayedColumns = ['publication', 'author', 'deadline', 'status', 'action'];
  @Input() invites: InviteDTO[] = [];

  constructor(private orviumService: OrviumService,
              private reviewService: ReviewService,
              private profileService: ProfileService,
              private snackBar: AppSnackBarService,
              private spinnerService: OrvSpinnerService,
              private logger: NGXLogger,
              private router: Router) {
  }

  ngOnInit(): void {
    const profile = this.profileService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }
  }

  acceptInvite(invite: InviteDTO): void {
    const newInvite = new InviteDTO();
    let deposit = new DepositDTO();
    newInvite.status = INVITE_STATUS.accepted;
    this.orviumService.updateInvite(invite._id, newInvite).subscribe(response => {
      invite.status = INVITE_STATUS.accepted;
    });

    if (invite.inviteType === INVITE_TYPE.review) {
      if (!invite.data || !invite.data.hasOwnProperty('depositId')) {
        this.snackBar.error('The invitation has not been properly created.');
        return;
      }

      this.orviumService.getDeposit(invite.data.depositId as string).subscribe(response => {
        deposit = response;
        this.createReview(deposit, invite);
      });
    }

  }

  rejectInvite(invite: InviteDTO): void {
    const newInvite = new InviteDTO();
    newInvite.status = INVITE_STATUS.rejected;
    this.orviumService.updateInvite(invite._id, newInvite).subscribe(response => {
      invite.status = INVITE_STATUS.rejected;
    });

  }

  createReview(deposit: DepositDTO, invite: InviteDTO): void {
    if (!this.reviewService.canCreateReview(this.profile, deposit)) {
      this.snackBar.error('You already created a review for this publication');
      return;
    }

    this.spinnerService.show();
    this.orviumService.createReview({
      revealReviewerIdentity: true,
      deposit: deposit._id,
      invite: invite._id
    }).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe((response) => {
      this.logger.debug(response);
      this.router.navigate(['reviews', response._id, 'edit']);
    });
  }
}
