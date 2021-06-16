import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { AppCustomValidators } from '../../shared/AppCustomValidators';
import errorMessagesJSON from '../../../assets/messages.json';
import { Md5 } from 'ts-md5';
import { Observable, of } from 'rxjs';
import { ProfileService } from '../profile.service';
import { USER_TYPE, UserPrivateDTO } from 'src/app/model/api';

@Component({
  selector: 'app-first-login',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  profile: UserPrivateDTO;
  userTypeFormGroup: FormGroup;
  userProfileFormGroup: FormGroup;
  done = false;
  gravatar = '';
  errorMessages = errorMessagesJSON;
  USER_TYPE = USER_TYPE;
  canContinue = false;

  constructor(private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private orviumService: OrviumService,
              private profileService: ProfileService,
              private router: Router,
              private route: ActivatedRoute) {
    this.profile = this.route.snapshot.data.profile;

    this.userTypeFormGroup = this.formBuilder.group({
      userType: ['', Validators.required]
    });

    this.userProfileFormGroup = this.formBuilder.group({
      email: [null, [Validators.required, AppCustomValidators.validateEmail], [this.validateDomain.bind(this)]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      acceptedTC: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.populateFormOnLoad(this.profile);
  }


  validateDomain(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const domain = control.value.replace(/.*@/, '');
    return this.orviumService.getDomain(domain).pipe(
      catchError(() => of(null)),
      map(invalidDomain => invalidDomain ? { invalidDomain: true } : null),
    );
  }

  populateFormOnLoad(profile: UserPrivateDTO): void {

    this.userTypeFormGroup.get('userType')?.setValue(profile.userType);

    this.userProfileFormGroup.get('email')?.setValue(profile.email);

    this.userProfileFormGroup.get('firstName')?.setValue(profile.firstName);

    this.userProfileFormGroup.get('lastName')?.setValue(profile.lastName);

    this.gravatar = Md5.hashStr(profile.email || '').toString();
  }

  save(): void {
    let profile = new UserPrivateDTO();
    profile.isOnboarded = true;
    profile = Object.assign(profile, this.userTypeFormGroup.value);
    profile = Object.assign(profile, this.userProfileFormGroup.value);
    profile.isOnboarded = true;
    this.profileService.updateProfile(profile).subscribe(response => {
      this.done = true;
      this.logger.debug(response);
      this.router.navigate(['/profile']);
    });
  }

  getErrorMessage(errors: ValidationErrors | null): string | null {
    if (!errors) {
      return null;
    }
    let keys = Object.keys(errors);
    if (keys.includes('required')) {
      return 'You must enter a value';
    }

    return errors[keys[0]];
  }
}
