import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
import { MatGridListModule } from '@angular/material/grid-list';
import { CommunityViewComponent } from './community-view/community-view.component';
import { ShareModule } from 'ngx-sharebuttons';
import { CommunityResolver } from '../shared/orvium.resolvers';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { SharedModule } from '../shared/shared.module';
import { ModeratorPanelComponent } from './moderator-panel/moderator-panel.component';

const routes: Routes = [
  {
    path: ':communityId/view',
    component: CommunityViewComponent,
    resolve: { community: CommunityResolver }
  },
  {
    path: ':communityId/moderate',
    component: ModeratorPanelComponent,
    resolve: { community: CommunityResolver }
  }
];

// @ts-ignore
@NgModule({
  declarations: [
    CommunityViewComponent,
    ModeratorPanelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
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
    MatGridListModule,
    FontAwesomeModule,
    ShareModule,
    NgxSmartModalModule.forChild(),
  ],
  exports: [RouterModule]
})
export class CommunityModule {
}
