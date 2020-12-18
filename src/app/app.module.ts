import { NgModule } from '@angular/core';
// Angular imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Angular Material imports
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MAT_CHIPS_DEFAULT_OPTIONS, MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
// Application imports
import { AppComponent } from './app.component';
import { ShowMoreComponent } from './show-more/show-more.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DepositDetailsComponent } from './deposits/deposit-details/deposit-details.component';
import { DepositViewComponent } from './deposits/deposit-view/deposit-view.component';
import { DepositsListComponent } from './deposits/deposits-list/deposits-list.component';
import { ProfileComponent } from './profile/profile.component';
import { RoutingModule } from './routing.module';
import { DatePipe } from '@angular/common';
import { ReviewsCreateComponent } from './review/reviews-create/reviews-create.component';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchComponent } from './search/search.component';
import { MyworkComponent } from './mywork/mywork.component';
import { PagingComponent } from './shared/paging/paging.component';
import { ENTER } from '@angular/cdk/keycodes';
import { LoggerModule } from 'ngx-logger';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { environment } from 'src/environments/environment';
import { FirstLoginComponent } from './first-login/first-login.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { StarredDepositsComponent } from './starred-deposits/starred-deposits.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ShareModule } from '@ngx-share/core';
import { InviteComponent } from './invite/invite.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GravatarModule } from 'ngx-gravatar';
import { MyreviewsComponent } from './review/myreviews/myreviews.component';
import { ReviewViewComponent } from './review/review-view/review-view.component';
import { FileuploadComponent } from './shared/fileupload/fileupload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    ShowMoreComponent,
    HomeComponent,
    PageNotFoundComponent,
    DepositDetailsComponent,
    DepositsListComponent,
    DepositViewComponent,
    ProfileComponent,
    ReviewsCreateComponent,
    FooterComponent,
    ToolbarComponent,
    SearchComponent,
    MyworkComponent,
    PagingComponent,
    FirstLoginComponent,
    StarredDepositsComponent,
    SideNavComponent,
    InviteComponent,
    MyreviewsComponent,
    ReviewViewComponent,
    FileuploadComponent
  ],
  imports: [
    RoutingModule,
    FormsModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatChipsModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatStepperModule,
    LoggerModule.forRoot({
      level: environment.logLevel,
      disableConsoleLogging: false,
      enableSourceMaps: true
    }),
    NgCircleProgressModule.forRoot({}),
    FontAwesomeModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatBadgeModule,
    NgxSpinnerModule,
    MatTabsModule,
    ShareModule,
    GravatarModule.forRoot({ fallback: 'identicon' }),
    NgxSmartModalModule.forRoot(),
    MatProgressBarModule,
    BrowserAnimationsModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { showDelay: 100 } },
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER]
      }
    },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true } },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {

  }
}
