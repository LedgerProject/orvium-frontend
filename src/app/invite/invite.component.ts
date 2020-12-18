import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faFacebookF, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ShareService } from '@ngx-share/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomValidators } from '../shared/CustomValidators';

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
  faTwitter = faTwitter;
  faFacebookF = faFacebookF;
  faLinkedin = faLinkedin;

  constructor(private formBuilder: FormBuilder,
              public share: ShareService,
              public dialogRef: MatDialogRef<InviteComponent>) {
  }

  ngOnInit(): void {
    this.sendEmailFormGroup = this.formBuilder.group({
      emails: [this.emails, [CustomValidators.validateRequired, CustomValidators.validateEmails]],
    });
    this.sendEmailFormGroup.controls.emails.setValue(this.emails);
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
    console.log(this.emails[0]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
