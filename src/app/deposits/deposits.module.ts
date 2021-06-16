import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GravatarModule } from 'ngx-gravatar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AuthGuardService } from '../services/auth-guard.service';
import { DepositResolver } from '../shared/orvium.resolvers';
import { DepositDetailsComponent } from './deposit-details/deposit-details.component';
import { DepositViewComponent } from './deposit-view/deposit-view.component';
import { DepositVersionsComponent } from './deposit-versions/deposit-versions.component';
import { DepositsReviewsTableComponent } from './deposits-reviews-table/deposits-reviews-table.component';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { ShareModule } from 'ngx-sharebuttons';
import { DepositReviewersInvitationsComponent } from './deposit-reviewers-invitations/deposit-reviewers-invitations.component';
import { InviteReviewersComponent } from './invite-reviewers/invite-reviewers.component';
import { CommentsComponent } from './comments/comments.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AfterSubmitViewComponent } from './after-submit-view/after-submit-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrviumUxLibModule } from '@orvium/ux-components';
import { MatExpansionModule } from '@angular/material/expansion';


const routes: Routes = [
  {
    path: 'submitted',
    component: AfterSubmitViewComponent
  },
  {
    path: ':depositId/edit',
    runGuardsAndResolvers: 'always',
    component: DepositDetailsComponent,
    canActivate: [AuthGuardService],
    resolve: { deposit: DepositResolver },
  },
  {
    path: ':depositId', redirectTo: 'deposits/:depositId/view', pathMatch: 'full',
  },
  {
    path: ':depositId/view',
    runGuardsAndResolvers: 'always',
    component: DepositViewComponent,
    resolve: { deposit: DepositResolver },
  },
  {
    path: ':depositId/reviewers',
    runGuardsAndResolvers: 'always',
    component: DepositReviewersInvitationsComponent,
    canActivate: [AuthGuardService],
    resolve: { deposit: DepositResolver },
  },
  {
    path: ':depositId/invite',
    runGuardsAndResolvers: 'always',
    component: InviteReviewersComponent,
    canActivate: [AuthGuardService],
    resolve: { deposit: DepositResolver },
  }
];

@NgModule({
  declarations: [
    DepositDetailsComponent,
    DepositViewComponent,
    DepositVersionsComponent,
    DepositsReviewsTableComponent,
    DepositReviewersInvitationsComponent,
    InviteReviewersComponent,
    CommentsComponent,
    AfterSubmitViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    ShareModule,
    MatChipsModule,
    MatDatepickerModule,
    GravatarModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatBadgeModule,
    NgxSmartModalModule.forChild(),
    FontAwesomeModule,
    ClipboardModule,
    MatSlideToggleModule,
    DragDropModule,
    OrviumUxLibModule,
    MatExpansionModule
  ],
  exports: [RouterModule],
})
export class DepositsModule {
}
