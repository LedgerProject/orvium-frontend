import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewsCreateComponent } from './reviews-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PeerReview, Profile, REVIEW_DECISION, REVIEW_STATUS } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OrviumService } from '../../services/orvium.service';
import { BehaviorSubject } from 'rxjs';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { depositDraft, profileTest } from '../../shared/test-data';
import { AccessDeniedComponent } from '../../shared/access-denied/access-denied.component';

describe('ReviewsCreateComponent', () => {
  let component: ReviewsCreateComponent;
  let fixture: ComponentFixture<ReviewsCreateComponent>;
  const deposit = depositDraft;
  const review: PeerReview = {
    _id: '123412341234',
    deposit,
    owner: 'theowner',
    author: 'theauthor',
    decision: REVIEW_DECISION.accepted,
    comments: 'the comments',
    creationDate: '01/01/2020',
    publicationDate: '01/01/2020',
    status: REVIEW_STATUS.draft
  };
  const profile = profileTest;


  const routeSnapshot = { snapshot: { data: { review } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        LoggerTestingModule
      ],
      declarations: [ReviewsCreateComponent, AccessDeniedComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsCreateComponent);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    orviumService.profile = new BehaviorSubject<Profile | undefined>(profile);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
