import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DepositDetailsComponent } from './deposit-details.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ACCESS_RIGHT, Deposit, DEPOSIT_STATUS, OrviumFile, Profile, PUBLICATION_TYPE, REVIEW_TYPE } from '../../model/orvium';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonHarness } from '@angular/material/button/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GravatarModule } from 'ngx-gravatar';
import { FileuploadComponent } from '../../shared/fileupload/fileupload.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepositsReviewsTableComponent } from '../deposits-reviews-table/deposits-reviews-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { DisciplinesService } from '../../services/disciplines.service';
import { MatButtonModule } from '@angular/material/button';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { AccessDeniedComponent } from '../../shared/access-denied/access-denied.component';
import { profileTest } from '../../shared/test-data';

describe('DepositDetailsComponent', () => {
  let component: DepositDetailsComponent;
  let fixture: ComponentFixture<DepositDetailsComponent>;
  let loader: HarnessLoader;

  const profile: Profile = { ...profileTest, ...{ isOnboarded: true } };

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

  const routeSnapshot = { snapshot: { data: { deposit } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepositDetailsComponent, FileuploadComponent, DepositsReviewsTableComponent, AccessDeniedComponent],
      imports: [RouterTestingModule, MatSnackBarModule,
        FormsModule, ReactiveFormsModule, HttpClientModule,
        HttpClientTestingModule, MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxSpinnerModule,
        MatChipsModule,
        MatTableModule,
        FontAwesomeModule,
        MatTooltipModule,
        GravatarModule,
        MatTabsModule,
        MatStepperModule,
        NgxSmartModalModule.forRoot(),
        MatIconModule,
        MatDividerModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        FontAwesomeTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DepositDetailsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    const disciplinesService = fixture.debugElement.injector.get(DisciplinesService);
    spyOn(disciplinesService, 'getDisciplines').and.returnValue([]);

    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a discipline', () => {
    component.canManageDeposit = true;
    component.canUpdateDeposit = true;
    expect(component.deposit?.disciplines?.length).toBe(2);
    component.removeDiscipline('Acoustics');
    expect(component.deposit?.disciplines?.length).toBe(1);
  });

  it('should remove a keyword', () => {
    component.canManageDeposit = true;
    component.canUpdateDeposit = true;
    expect(component.deposit?.keywords?.length).toBe(2);
    component.removeKeyword('science');
    expect(component.deposit?.keywords?.length).toBe(1);
  });

  it('should remove an author', () => {
    component.canManageDeposit = true;
    component.canUpdateDeposit = true;
    expect(component.deposit.authors.length).toBe(2);
    component.removeAuthor(component.deposit.authors[0]);
    expect(component.deposit.authors.length).toBe(1);
  });

  it('should submit to preprint', async () => {
    const profile: Profile = { ...profileTest, ...{ userId: deposit.owner } };
    component.profile = profile;
    component.refreshDeposit(deposit);
    component.depositForm.markAsPristine();
    expect(component.canBeSentToReview()).toBe(true);
    // component.deposit.status = DEPOSIT_STATUS.preprint;
    // const publish = await loader.getHarness(MatButtonHarness.with({ text: 'publish Submit' }));
    // expect(await publish.isDisabled()).toBe(true);
  });
});
