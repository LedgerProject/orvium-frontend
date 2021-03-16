import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Deposit, Invite, Profile } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { OrviumService } from '../../services/orvium.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { DepositsService } from '../deposits.service';

@Component({
  selector: 'app-invite-reviewers',
  templateUrl: './invite-reviewers.component.html',
  styleUrls: ['./invite-reviewers.component.scss']
})
export class InviteReviewersComponent implements OnInit {
  deposit: Deposit;
  profile: Profile;
  inviteForm: FormGroup;
  canInviteReviewers = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private orviumService: OrviumService,
              private spinnerService: NgxSpinnerService,
              private logger: NGXLogger,
              private depositService: DepositsService) {
  }

  ngOnInit(): void {
    this.deposit = this.route.snapshot.data.deposit;
    const profile = this.orviumService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }
    this.inviteForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
    this.canInviteReviewers = this.depositService.canInviteReviewers(this.profile, this.deposit);
  }

  createInvitation(): void {
    const invitation = new Invite();
    invitation.inviteType = 'review';
    invitation.addressee = this.inviteForm.get('email')?.value;
    invitation.data = { depositId: this.deposit._id };
    this.spinnerService.show();
    this.orviumService.createInvitation(invitation).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe((response) => {
      this.logger.debug(response);
    });
  }
}
