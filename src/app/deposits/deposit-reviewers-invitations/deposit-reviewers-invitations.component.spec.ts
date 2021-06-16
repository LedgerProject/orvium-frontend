import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositReviewersInvitationsComponent } from './deposit-reviewers-invitations.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerModule } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { depositDraft, fileTest, profilePrivateTest, profileSummaryTest } from '../../shared/test-data';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DepositsModule } from '../deposits.module';
import { ProfileService } from '../../profile/profile.service';
import { REVIEW_DECISION, REVIEW_STATUS, ReviewDTO, UserPrivateDTO } from '../../model/api';

describe('DepositReviewersInvitationsComponent', () => {
  let component: DepositReviewersInvitationsComponent;
  let fixture: ComponentFixture<DepositReviewersInvitationsComponent>;
  const file = fileTest;
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
  const profile = profilePrivateTest();

  deposit.peerReviews.push(review1, review2);

  const routeSnapshot = { snapshot: { data: { deposit, profile } } };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositReviewersInvitationsComponent],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        LoggerModule.forRoot(null),
        MatCardModule,
        MatButtonModule,
        NgxSmartModalModule.forRoot(),
        MatIconModule,
        MatSortModule,
        MatTableModule,
        DepositsModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositReviewersInvitationsComponent);
    component = fixture.componentInstance;
    const profileService = fixture.debugElement.injector.get(ProfileService);
    profileService.profile = new BehaviorSubject<UserPrivateDTO | undefined>(profile);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
