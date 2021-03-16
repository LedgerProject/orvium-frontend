import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewViewComponent } from './review-view.component';
import { PeerReview, REVIEW_DECISION, REVIEW_STATUS } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GravatarModule } from 'ngx-gravatar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { OrviumService } from '../../services/orvium.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { depositDraft } from '../../shared/test-data';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ReviewViewComponent', () => {
  let component: ReviewViewComponent;
  let fixture: ComponentFixture<ReviewViewComponent>;

  const deposit = depositDraft;
  const review: PeerReview = {
    _id: '123412341234',
    deposit,
    owner: 'theowner',
    author: 'theauthor',
    decision: REVIEW_DECISION.accepted,
    comments: 'the comments',
    gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
    creationDate: '01/01/2020',
    publicationDate: '01/01/2020',
    status: REVIEW_STATUS.draft
  };
  const routeSnapshot = { snapshot: { data: { deposit, review } } };

  beforeEach(waitForAsync(() => {

    const orviumServiceSpy = jasmine.createSpyObj('OrviumService', ['getProfile']);
    orviumServiceSpy.getProfile.and.returnValue(of(Promise.resolve({})));

    TestBed.configureTestingModule({
      declarations: [ReviewViewComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
        NgxSmartModalModule.forRoot(),
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        GravatarModule,
        LoggerTestingModule,
        MatChipsModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: OrviumService, useValue: orviumServiceSpy },
        { provide: ActivatedRoute, useValue: routeSnapshot }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewViewComponent);
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
