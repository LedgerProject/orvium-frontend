import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { OrviumService } from '../../services/orvium.service';
import { NGXLogger } from 'ngx-logger';
import { DepositsService } from '../deposits.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ProfileService } from '../../profile/profile.service';
import { DepositDTO, INVITE_TYPE, InviteDTO, UserPrivateDTO } from '../../model/api';
import { OrvSpinnerService } from '@orvium/ux-components';

@Component({
  selector: 'app-invite-reviewers',
  templateUrl: './invite-reviewers.component.html',
  styleUrls: ['./invite-reviewers.component.scss']
})
export class InviteReviewersComponent implements OnInit {
  deposit: DepositDTO;
  profile?: UserPrivateDTO;
  inviteForm: FormGroup;
  canInviteReviewers = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private orviumService: OrviumService,
              private profileService: ProfileService,
              private spinnerService: OrvSpinnerService,
              private logger: NGXLogger,
              private depositService: DepositsService,
              public ngxSmartModalService: NgxSmartModalService) {
    this.inviteForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });

    this.deposit = this.route.snapshot.data.deposit;
  }

  ngOnInit(): void {
    const profile = this.profileService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }
    this.canInviteReviewers = this.depositService.canInviteReviewers(this.profile, this.deposit);
  }

  createInvitation(): void {
    const invitation = new InviteDTO();
    invitation.inviteType = INVITE_TYPE.review;
    invitation.addressee = this.inviteForm.get('email')?.value;
    invitation.data = { depositId: this.deposit._id };

    this.spinnerService.show();
    this.orviumService.createInvitation(invitation).pipe(
      finalize(() => {
        this.spinnerService.hide();
        this.ngxSmartModalService.close('inviteReviewerModal');
        this.inviteForm.reset();
      })
    ).subscribe((response) => {
      this.logger.debug(response);
    });
  }
}
