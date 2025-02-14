import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShareService } from 'ngx-sharebuttons';
import { MatDialogRef } from '@angular/material/dialog';
import { AppCustomValidators } from '../shared/AppCustomValidators';
import { environment } from '../../environments/environment';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  sendEmailFormGroup: FormGroup;
  public inviteLink?: string;
  description = 'Orvium connect researchers and publishers with trusted reviewers to accelerate publishing ' +
    'along with incentivized peer review.';

  constructor(private formBuilder: FormBuilder,
              public share: ShareService,
              private profileService: ProfileService,
              public dialogRef: MatDialogRef<InviteComponent>) {
    this.sendEmailFormGroup = this.formBuilder.group({
      emails: [this.emails, [AppCustomValidators.validateRequired, AppCustomValidators.validateEmails]],
    });
  }

  ngOnInit(): void {

    this.sendEmailFormGroup.controls.emails.setValue(this.emails);
    const inviteToken = this.profileService.profile.getValue()?.inviteToken;
    this.inviteLink = `${environment.publicUrl}/profile/invite?inviteToken=${inviteToken}`;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value.trim() !== '')) {
      this.sendEmailFormGroup.controls.emails.setErrors(null);
      const tempEmails = this.sendEmailFormGroup.controls.emails.value;
      tempEmails.push(value.trim());
      this.sendEmailFormGroup.controls.emails.setValue(tempEmails);
      if (this.sendEmailFormGroup.controls.emails.valid) {
        this.sendEmailFormGroup.controls.emails.markAsDirty();
        input.value = '';
      } else {
        const index = this.emails.findIndex(value1 => value1 === value.trim());
        if (index !== -1) {
          this.emails.splice(index, 1);
        }
      }
    } else {
      this.sendEmailFormGroup.controls.emails.updateValueAndValidity();
    }
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email, 0);
    if (index > -1) {
      this.emails.splice(index, 1);
    }
    this.sendEmailFormGroup.controls.emails.updateValueAndValidity();  // <---- Here it is
    this.sendEmailFormGroup.controls.emails.markAsDirty();
  }

  send(): void {
    this.profileService.sendInvite(this.emails).subscribe();
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
