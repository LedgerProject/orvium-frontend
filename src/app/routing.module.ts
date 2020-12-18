import { RouterModule, Routes } from '@angular/router';
import { DepositDetailsComponent } from './deposits/deposit-details/deposit-details.component';
import { ReviewsCreateComponent } from './review/reviews-create/reviews-create.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { MyworkComponent } from './mywork/mywork.component';
import { FirstLoginComponent } from './first-login/first-login.component';
import { ProfileComponent } from './profile/profile.component';
import { StarredDepositsComponent } from './starred-deposits/starred-deposits.component';
import { DepositViewComponent } from './deposits/deposit-view/deposit-view.component';
import { DepositListResolver, DepositResolver, PeerReviewResolver, ProfileResolver } from './shared/orvium.resolvers';
import { HomeComponent } from './home/home.component';
import { MyreviewsComponent } from './review/myreviews/myreviews.component';
import { ReviewViewComponent } from './review/review-view/review-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { depositsQuery: DepositListResolver },
  },
  {
    path: 'search',
    component: SearchComponent,
    runGuardsAndResolvers: 'always',
    resolve: { depositsQuery: DepositListResolver },
  },
  {
    path: 'profile', component: ProfileComponent,
    resolve: { profile: ProfileResolver }
  },
  {
    path: 'publications',
    component: MyworkComponent,
    runGuardsAndResolvers: 'always',
    resolve: { depositsQuery: DepositListResolver },
  },
  {
    path: 'reviews',
    component: MyworkComponent,
    runGuardsAndResolvers: 'always',
    resolve: { depositsQuery: DepositListResolver },
  },
  { path: 'starred', component: StarredDepositsComponent },
  {
    path: 'deposits/:depositId/edit',
    runGuardsAndResolvers: 'always',
    component: DepositDetailsComponent,
    resolve: { deposit: DepositResolver },
  },
  {
    path: 'deposits/:depositId', redirectTo: 'deposits/:depositId/view', pathMatch: 'full',
  },
  {
    path: 'deposits/:depositId/view',
    runGuardsAndResolvers: 'always',
    component: DepositViewComponent,
    resolve: { deposit: DepositResolver },
  },
  {
    path: 'deposits/:depositId/reviews/:reviewId/edit',
    runGuardsAndResolvers: 'always',
    component: ReviewsCreateComponent,
    resolve: {
      review: PeerReviewResolver,
      deposit: DepositResolver,
      profile: ProfileResolver
    },
  },
  {
    path: 'deposits/:depositId/reviews/:reviewId/view',
    runGuardsAndResolvers: 'always',
    component: ReviewViewComponent,
    canActivate: [],
    resolve: {
      review: PeerReviewResolver,
      deposit: DepositResolver
    },
  },
  { path: 'error', component: PageNotFoundComponent },
  {
    path: 'firstlogin',
    component: FirstLoginComponent,
    resolve: { profile: ProfileResolver }
  },
  { path: 'myreviews', component: MyreviewsComponent },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ProfileResolver,
    DepositResolver,
    DepositListResolver,
    PeerReviewResolver
  ]
})
export class RoutingModule {
}
