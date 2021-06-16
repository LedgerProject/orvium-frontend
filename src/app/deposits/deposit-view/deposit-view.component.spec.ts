import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DepositViewComponent } from './deposit-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowMoreComponent } from '../../shared/show-more/show-more.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GravatarModule } from 'ngx-gravatar';
import { ShareModule } from 'ngx-sharebuttons';
import { MatBadgeModule } from '@angular/material/badge';
import { DepositsReviewsTableComponent } from '../deposits-reviews-table/deposits-reviews-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { of } from 'rxjs';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { SharedModule } from '../../shared/shared.module';
import { DepositsModule } from '../deposits.module';
import { CommentsComponent } from '../comments/comments.component';
import { depositDraft } from '../../shared/test-data';

describe('DepositViewComponent', () => {
  let component: DepositViewComponent;
  let fixture: ComponentFixture<DepositViewComponent>;
  const deposit = depositDraft();

  const routeSnapshot = { data: of({ deposit }) };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepositViewComponent, ShowMoreComponent, DepositsReviewsTableComponent, CommentsComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatBadgeModule,
        MatTooltipModule,
        MatExpansionModule,
        GravatarModule,
        FontAwesomeModule,
        NgxSmartModalModule.forRoot(),
        ShareModule,
        ClipboardModule,
        HttpClientTestingModule, MatCardModule, MatStepperModule,
        LoggerTestingModule,
        FontAwesomeTestingModule,
        SharedModule,
        DepositsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
        TitleCasePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
