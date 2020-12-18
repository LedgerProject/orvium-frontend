import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrviumService } from '../services/orvium.service';
import { Institution, Profile } from '../model/orvium';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { CustomValidators } from '../shared/CustomValidators';
import errorMessagesJSON from '../../assets/messages.json';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss']
})
export class FirstLoginComponent implements OnInit {
  userTypeFormGroup: FormGroup;
  userProfileFormGroup: FormGroup;
  userInstitutionFormGroup: FormGroup;
  done = false;
  gravatar: string;
  institution: Institution;
  errorMessages = errorMessagesJSON;

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private orviumService: OrviumService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.userTypeFormGroup = this.formBuilder.group({
      userType: ['', Validators.required]
    });

    this.userProfileFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, CustomValidators.validateEmail]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    });

    this.userInstitutionFormGroup = this.formBuilder.group({});

    this.userTypeFormGroup.controls.userType.valueChanges.subscribe(value => {
      if (value === 'not researcher') {
        this.userProfileFormGroup.controls.email
          .setValidators([Validators.required, CustomValidators.validateEmail]);
      } else {
        this.userProfileFormGroup.controls.email
          .setValidators([Validators.required, CustomValidators.validateEmail]);
      }
      this.userProfileFormGroup.controls.email.updateValueAndValidity();
      this.userProfileFormGroup.controls.email.markAsTouched();
    });

    this.userProfileFormGroup.controls.email.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.onBlurInstitutionalEmail())
      ).subscribe();

    this.populateFormOnLoad(this.route.snapshot.data.profile);

  }

  populateFormOnLoad(profile: Profile) {

    this.userTypeFormGroup.get('userType').setValue(profile.userType);

    this.userProfileFormGroup.get('email').setValue(profile.email);

    this.userProfileFormGroup.get('firstName')
      .setValue(profile.firstName);

    this.userProfileFormGroup.get('lastName')
      .setValue(profile.lastName);

    this.gravatar = Md5.hashStr(profile.email).toString();
  }

  onBlurInstitutionalEmail() {
    const emailField = this.userProfileFormGroup.get('email');
    if (emailField.valid) {
      const emailDomain = emailField.value.replace(/.*@/, '');

      this.orviumService.getInstitutionByDomain(emailDomain)
        .subscribe(institution => {
          console.log('the institution', institution);
          this.institution = institution;
        });
    }
  }

  save() {
    let profile = new Profile();
    profile.isOnboarded = true;
    profile = Object.assign(profile, this.userTypeFormGroup.value);
    profile = Object.assign(profile, this.userProfileFormGroup.value);
    profile.isOnboarded = true;

    this.orviumService.updateProfile(profile).subscribe(response => {
      this.done = true;
      this.logger.debug(response);
      this.router.navigate(['/profile']);
    });
  }
}
