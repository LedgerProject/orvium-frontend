import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { MyworkComponent } from './mywork/mywork.component';
import { StarredDepositsComponent } from './starred-deposits/starred-deposits.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommunityResolver, DepositListResolver, DepositResolver, PeerReviewResolver, ProfileResolver } from './shared/orvium.resolvers';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { depositsQuery: DepositListResolver },
  },
  {
    path: 'profile',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'communities',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./communities/community.module').then(m => m.CommunityModule)
  },
  {
    path: 'reviews',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./review/reviews.module').then(m => m.ReviewsModule)
  },
  {
    path: 'deposits',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./deposits/deposits.module').then(m => m.DepositsModule)
  },
  {
    path: 'search',
    component: SearchComponent,
    runGuardsAndResolvers: 'always',
    resolve: { depositsQuery: DepositListResolver },
  },
  {
    path: 'publications',
    component: MyworkComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuardService],
    resolve: { depositsQuery: DepositListResolver },
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'starred', component: StarredDepositsComponent, canActivate: [AuthGuardService] },
  { path: 'error', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ProfileResolver,
    DepositResolver,
    DepositListResolver,
    PeerReviewResolver,
    CommunityResolver
  ]
})
export class RoutingModule {
}
