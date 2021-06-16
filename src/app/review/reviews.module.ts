import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateReviewsComponent } from './empty-state-reviews/empty-state-reviews.component';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { DepositListResolver, PeerReviewResolver, ProfileResolver } from '../shared/orvium.resolvers';
import { MyreviewsComponent } from './myreviews/myreviews.component';
import { GravatarModule } from 'ngx-gravatar';
import { PapersToReviewComponent } from './papers-to-review/papers-to-review.component';
import { SharedModule } from '../shared/shared.module';
import { ReviewViewComponent } from './review-view/review-view.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReviewsCreateComponent } from './reviews-create/reviews-create.component';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatInputModule } from '@angular/material/input';
import { InvitationsPanelComponent } from './invitations-panel/invitations-panel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OrviumUxLibModule } from '@orvium/ux-components';

const routes: Routes = [
  {
    path: '', component: EmptyStateReviewsComponent,
    canActivate: [AuthGuardService],
    resolve: { profile: ProfileResolver }
  },
  {
    path: 'myreviews', component: InvitationsPanelComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'paperstoreview', component: PapersToReviewComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuardService],
    resolve: { depositsQuery: DepositListResolver },
  },
  {
    path: ':reviewId/edit',
    runGuardsAndResolvers: 'always',
    component: ReviewsCreateComponent,
    canActivate: [AuthGuardService],
    resolve: {
      review: PeerReviewResolver,
    },
  },
  {
    path: ':reviewId/view',
    runGuardsAndResolvers: 'always',
    component: ReviewViewComponent,
    canActivate: [],
    resolve: {
      review: PeerReviewResolver,
    },
  },
];

@NgModule({
  declarations: [
    EmptyStateReviewsComponent,
    MyreviewsComponent,
    PapersToReviewComponent,
    ReviewViewComponent,
    ReviewsCreateComponent,
    InvitationsPanelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatSliderModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatButtonModule,
    GravatarModule,
    NgxSmartModalModule.forChild(),
    FontAwesomeModule,
    MatTabsModule,
    OrviumUxLibModule
  ],
  exports: [RouterModule]
})
export class ReviewsModule {
}
