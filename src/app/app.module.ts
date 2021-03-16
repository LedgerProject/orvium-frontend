import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
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
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RoutingModule } from './routing.module';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchComponent } from './search/search.component';
import { MyworkComponent } from './mywork/mywork.component';
import { ENTER } from '@angular/cdk/keycodes';
import { LoggerModule } from 'ngx-logger';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { environment } from 'src/environments/environment';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { StarredDepositsComponent } from './starred-deposits/starred-deposits.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ShareModule } from 'ngx-sharebuttons';
import { InviteComponent } from './invite/invite.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GravatarModule } from 'ngx-gravatar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DisciplinesService } from './services/disciplines.service';
import { SharedModule } from './shared/shared.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BrowserModule } from '@angular/platform-browser';
import { MatPaginatorModule } from '@angular/material/paginator';


export function initApp(disciplinesService: DisciplinesService): () => Promise<void> {
  return (): Promise<void> => {
    return disciplinesService.init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    FooterComponent,
    ToolbarComponent,
    SearchComponent,
    MyworkComponent,
    StarredDepositsComponent,
    DashboardComponent,
    SideNavComponent,
    InviteComponent
  ],
  imports: [
    CommonModule,
    RoutingModule,
    SharedModule,
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
    NgCircleProgressModule.forRoot(),
    MatProgressBarModule,
    ClipboardModule,
    FontAwesomeModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { showDelay: 100 } },
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER]
      }
    },
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true } },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [DisciplinesService]
    },
  ],
})
export class AppModule {
  constructor() {
  }
}
