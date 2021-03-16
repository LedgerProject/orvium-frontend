import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { OrviumService } from '../../services/orvium.service';
import { Institution, Profile, USER_TYPE } from '../../model/orvium';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, map, tap } from 'rxjs/operators';
import { CustomValidators } from '../../shared/CustomValidators';
import errorMessagesJSON from '../../../assets/messages.json';
import { Md5 } from 'ts-md5';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-first-login',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  userTypeFormGroup: FormGroup;
  userProfileFormGroup: FormGroup;
  userInstitutionFormGroup: FormGroup;
  done = false;
  gravatar: string;
  institution: Institution;
  errorMessages = errorMessagesJSON;
  USER_TYPE = USER_TYPE;

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private orviumService: OrviumService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.userTypeFormGroup = this.formBuilder.group({
      userType: ['', Validators.required]
    });

    this.userProfileFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, CustomValidators.validateEmail], [this.validateDomain.bind(this)]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    });

    this.userInstitutionFormGroup = this.formBuilder.group({});

    this.userProfileFormGroup.controls.email.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.onBlurInstitutionalEmail())
      ).subscribe();

    this.populateFormOnLoad(this.route.snapshot.data.profile);

  }


  validateDomain(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const domain = control.value.replace(/.*@/, '');
    return this.orviumService.getDomain(domain).pipe(
      map(invalidDomain => invalidDomain ? { invalidDomain: true } : null),
      catchError(() => of(null))
    );
  }

  populateFormOnLoad(profile: Profile): void {

    this.userTypeFormGroup.get('userType')?.setValue(profile.userType);

    this.userProfileFormGroup.get('email')?.setValue(profile.email);

    this.userProfileFormGroup.get('firstName')?.setValue(profile.firstName);

    this.userProfileFormGroup.get('lastName')?.setValue(profile.lastName);

    this.gravatar = Md5.hashStr(profile.email || '').toString();
  }

  onBlurInstitutionalEmail(): void {
    const emailField = this.userProfileFormGroup.get('email');
    if (emailField && emailField.valid) {
      const emailDomain = emailField.value.replace(/.*@/, '');

      this.orviumService.getInstitutionByDomain(emailDomain)
        .subscribe(institution => {
          console.log('the institution', institution);
          this.institution = institution;
        });
    }
  }

  save(): void {
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
