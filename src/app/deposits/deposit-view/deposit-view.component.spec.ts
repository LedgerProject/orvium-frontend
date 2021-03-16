import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DepositViewComponent } from './deposit-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ACCESS_RIGHT, Deposit, DEPOSIT_STATUS, PUBLICATION_TYPE, REVIEW_TYPE } from '../../model/orvium';
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

describe('DepositViewComponent', () => {
  let component: DepositViewComponent;
  let fixture: ComponentFixture<DepositViewComponent>;
  const deposit: Deposit = {
    _id: '123412341234',
    owner: 'theowner',
    title: 'the title',
    abstract: '',
    authors: [],
    references: [],
    peerReviews: [],
    publicationFile: { filename: 'file', contentType: 'pdf', contentLength: 1, keccak256: 'xxx' },
    files: [{ filename: 'file', contentType: 'pdf', contentLength: 1, keccak256: 'xxx' }],
    gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
    publicationType: PUBLICATION_TYPE.article,
    accessRight: ACCESS_RIGHT.CCBY,
    status: DEPOSIT_STATUS.draft,
    reviewType: REVIEW_TYPE.openReview,
    keywords: []
  };

  const routeSnapshot = { data: of({ deposit }) };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepositViewComponent, ShowMoreComponent, DepositsReviewsTableComponent],
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
