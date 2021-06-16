import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { ProfileResolver, PublicProfileResolver } from '../shared/orvium.resolvers';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { GravatarModule } from 'ngx-gravatar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareModule } from 'ngx-sharebuttons';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrviumUxLibModule } from '@orvium/ux-components';

const routes: Routes = [
  {
    path: '', component: ProfileComponent,
    canActivate: [AuthGuardService],
    resolve: { profile: ProfileResolver }
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [AuthGuardService],
    resolve: { profile: ProfileResolver }
  },
  {
    path: ':nickname', component: PublicProfileComponent,
    resolve: { profile: PublicProfileResolver }
  },
];

@NgModule({
  declarations: [
    ProfileComponent,
    OnboardingComponent,
    PublicProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    NgCircleProgressModule.forRoot({}),
    GravatarModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    FontAwesomeModule,
    ShareModule,
    SharedModule,
    MatCheckboxModule,
    OrviumUxLibModule,
  ],
  exports: [RouterModule]
})
export class ProfileModule {
}
