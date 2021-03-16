import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositReviewersInvitationsComponent } from './deposit-reviewers-invitations.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerModule } from 'ngx-logger';
import {
  ACCESS_RIGHT,
  Deposit,
  DEPOSIT_STATUS,
  OrviumFile,
  PeerReview,
  Profile,
  PUBLICATION_TYPE,
  REVIEW_DECISION,
  REVIEW_STATUS,
  REVIEW_TYPE
} from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { OrviumService } from '../../services/orvium.service';
import { profileTest } from '../../shared/test-data';
import { AccessDeniedComponent } from '../../shared/access-denied/access-denied.component';

describe('DepositReviewersInvitationsComponent', () => {
  let component: DepositReviewersInvitationsComponent;
  let fixture: ComponentFixture<DepositReviewersInvitationsComponent>;
  const file: OrviumFile = {
    filename: 'file',
    contentType: 'image/png',
    keccak256: '0x1111111111111111111111111111111111111111111111111111111111111111',
    contentLength: 21500,
  };
  const deposit: Deposit = {
    _id: '123412341234',
    owner: 'theowner',
    title: 'the title',
    abstract: 'the abstract',
    publicationType: PUBLICATION_TYPE.book,
    accessRight: ACCESS_RIGHT.CC0,
    publicationDate: '1968-11-16T00:00:00',
    status: DEPOSIT_STATUS.draft,
    peerReviews: [],
    reviewType: REVIEW_TYPE.openReview,
    authors: [{ name: 'John', surname: 'Doe' }, { name: 'William', surname: 'Wallace' }],
    keywords: ['science', 'cloud'],
    keccak256: '0x1111111111111111111111111111111111111111111111111111111111111111',
    files: [],
    doi: '10.1000/182',
    url: '',
    pdfUrl: '',
    gravatar: '11111111111111111111111111111111',
    disciplines: ['Abnormal psychology', 'Acoustics'],
    references: [],
    publicationFile: file,
  };
  const review1: PeerReview = {
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
  const review2: PeerReview = {
    _id: '123412341237',
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
  const profile = profileTest;

  deposit.peerReviews.push(review1, review2);

  const routeSnapshot = { snapshot: { data: { deposit, profile } } };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositReviewersInvitationsComponent, AccessDeniedComponent],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        LoggerModule.forRoot(null),
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSortModule,
        MatTableModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositReviewersInvitationsComponent);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    orviumService.profile = new BehaviorSubject<Profile | undefined>(profile);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
