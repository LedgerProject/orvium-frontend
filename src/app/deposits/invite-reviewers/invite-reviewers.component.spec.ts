import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteReviewersComponent } from './invite-reviewers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerModule } from 'ngx-logger';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { OrviumService } from '../../services/orvium.service';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { profileTest } from '../../shared/test-data';
import { AccessDeniedComponent } from '../../shared/access-denied/access-denied.component';


describe('InviteReviewersComponent', () => {
  const file: OrviumFile = {
    filename: 'file',
    contentType: 'image/png',
    keccak256: '0x1111111111111111111111111111111111111111111111111111111111111111',
    contentLength: 21500,
  };
  const deposit: Deposit = {
    _id: '123412341234',
    owner: '6a6b93803006b7dc200',
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
  deposit.peerReviews.push(review1, review2);
  const profile = profileTest;

  let component: InviteReviewersComponent;
  let fixture: ComponentFixture<InviteReviewersComponent>;
  const routeSnapshot = { snapshot: { data: { deposit, profile } } };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InviteReviewersComponent, AccessDeniedComponent],
      imports: [FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerModule.forRoot(null),
        MatCardModule,
        MatIconModule,
        MatButtonModule,
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
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    orviumService.profile = new BehaviorSubject<Profile | undefined>(profile);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
