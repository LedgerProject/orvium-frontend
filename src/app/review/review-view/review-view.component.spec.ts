import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewViewComponent } from './review-view.component';
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
import { depositDraft, reviewDraft } from '../../shared/test-data';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared/shared.module';

describe('ReviewViewComponent', () => {
  let component: ReviewViewComponent;
  let fixture: ComponentFixture<ReviewViewComponent>;

  const deposit = depositDraft();
  const review = reviewDraft();
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
        NoopAnimationsModule,
        SharedModule
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
