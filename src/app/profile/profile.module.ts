import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { ProfileResolver } from '../shared/orvium.resolvers';
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
];

@NgModule({
  declarations: [
    ProfileComponent,
    OnboardingComponent,
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
    NgCircleProgressModule,
    GravatarModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [RouterModule]
})
export class ProfileModule {
}
