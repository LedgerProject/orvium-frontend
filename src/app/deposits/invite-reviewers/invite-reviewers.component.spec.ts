import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteReviewersComponent } from './invite-reviewers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerModule } from 'ngx-logger';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { depositDraft, profilePrivateTest, profileSummaryTest } from '../../shared/test-data';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ProfileService } from '../../profile/profile.service';
import { REVIEW_DECISION, REVIEW_STATUS, ReviewDTO, UserPrivateDTO } from '../../model/api';
import { OrvAccessDeniedComponent } from '@orvium/ux-components';


describe('InviteReviewersComponent', () => {
  const deposit = depositDraft();
  const review1: ReviewDTO = {
    _id: '123412341234',
    deposit,
    owner: 'theowner',
    ownerProfile: profileSummaryTest(),
    author: 'theauthor',
    decision: REVIEW_DECISION.accepted,
    comments: 'the comments',
    gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
    creationDate: '01/01/2020',
    publicationDate: '01/01/2020',
    status: REVIEW_STATUS.draft,
    revealReviewerIdentity: true,
    actions: []
  };
  const review2: ReviewDTO = {
    _id: '123412341237',
    deposit,
    owner: 'theowner',
    ownerProfile: profileSummaryTest(),
    author: 'theauthor',
    decision: REVIEW_DECISION.accepted,
    comments: 'the comments',
    gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8',
    creationDate: '01/01/2020',
    publicationDate: '01/01/2020',
    status: REVIEW_STATUS.draft,
    revealReviewerIdentity: true,
    actions: []
  };
  deposit.peerReviews.push(review1, review2);
  const profile = profilePrivateTest();

  let component: InviteReviewersComponent;
  let fixture: ComponentFixture<InviteReviewersComponent>;
  const routeSnapshot = { snapshot: { data: { deposit, profile } } };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InviteReviewersComponent, OrvAccessDeniedComponent],
      imports: [FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerModule.forRoot(null),
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        NgxSmartModalModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteReviewersComponent);
    component = fixture.componentInstance;
    const profileService = fixture.debugElement.injector.get(ProfileService);
    profileService.profile = new BehaviorSubject<UserPrivateDTO | undefined>(profile);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
