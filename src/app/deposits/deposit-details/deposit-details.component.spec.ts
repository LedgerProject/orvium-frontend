import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DepositDetailsComponent } from './deposit-details.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GravatarModule } from 'ngx-gravatar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepositsReviewsTableComponent } from '../deposits-reviews-table/deposits-reviews-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { DisciplinesService } from '../../services/disciplines.service';
import { MatButtonModule } from '@angular/material/button';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { depositDraft, fileTest, profilePrivateTest } from '../../shared/test-data';
import { DepositsService } from '../deposits.service';
import { ProfileService } from '../../profile/profile.service';
import { BehaviorSubject } from 'rxjs';
import { Component, Input } from '@angular/core';
import { DepositDTO, FileMetadata, UserPrivateDTO } from '../../model/api';
import { of } from 'rxjs';

@Component({ selector: 'app-fileupload', template: '' })
class FileUploadStubComponent {
  @Input() url?: string;
  @Input() accept?: string;
  @Input() maxFileSize?: number;
  @Input() fileLimit?: number;
  @Input() uploadedFileCount?: number;
  @Input() isPublication?: boolean;
}

@Component({ selector: 'app-file-list', template: '' })
class FileListStubComponent {
  @Input() files: FileMetadata[] = [];
  @Input() baseHref?: string;
  @Input() readonly = true;
}

describe('DepositDetailsComponent', () => {
  let component: DepositDetailsComponent;
  let fixture: ComponentFixture<DepositDetailsComponent>;
  let loader: HarnessLoader;

  const profile: UserPrivateDTO = { ...profilePrivateTest(), ...{ isOnboarded: true, emailConfirmed: true } };
  const deposit: DepositDTO = {
    ...depositDraft(),
    disciplines: ['Acoustics', 'Computing'],
    authors: [{ name: 'John', surname: 'Doe' }, { name: 'William', surname: 'Wallace' }],
    keywords: ['science', 'cloud'],
    publicationFile: fileTest()
  };
  const file = fileTest;

  const routeSnapshot = { snapshot: { data: { deposit } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DepositDetailsComponent,
        DepositsReviewsTableComponent,
        FileUploadStubComponent,
        FileListStubComponent
      ],
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
    const depositService = fixture.debugElement.injector.get(DepositsService);
    spyOn(disciplinesService, 'getDisciplines').and.returnValue(of([]));
    spyOn(depositService, 'canUpdateDeposit').and.returnValue(true);
    const profileService = fixture.debugElement.injector.get(ProfileService);
    profileService.profile = new BehaviorSubject<UserPrivateDTO | undefined>(profile);
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
    expect(component.deposit?.disciplines.length).toBe(2);
    component.removeDiscipline('Acoustics');
    expect(component.deposit?.disciplines.length).toBe(1);
  });

  it('should remove a keyword', () => {
    component.canManageDeposit = true;
    component.canUpdateDeposit = true;
    expect(component.deposit?.keywords.length).toBe(2);
    component.removeKeyword('science');
    expect(component.deposit?.keywords.length).toBe(1);
  });

  it('should remove an author', () => {
    component.canManageDeposit = true;
    component.canUpdateDeposit = true;
    expect(component.deposit.authors.length).toBe(2);
    component.removeAuthor(component.deposit.authors[0]);
    expect(component.deposit.authors.length).toBe(1);
  });

  it('should submit to preprint', async () => {
    component.profile = { ...profilePrivateTest(), userId: deposit.owner };
    component.refreshDeposit(deposit);
    component.depositForm.markAsPristine();
    expect(component.canBeSentToReview()).toBe(true);
    // component.deposit.status = DEPOSIT_STATUS.preprint;
    // const publish = await loader.getHarness(MatButtonHarness.with({ text: 'publish Submit' }));
    // expect(await publish.isDisabled()).toBe(true);
  });
});
