import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewsCreateComponent } from './reviews-create.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { profilePrivateTest, reviewDraft } from '../../shared/test-data';
import { ProfileService } from '../../profile/profile.service';
import { UserPrivateDTO } from '../../model/api';
import { OrvAccessDeniedComponent } from '@orvium/ux-components';

describe('ReviewsCreateComponent', () => {
  let component: ReviewsCreateComponent;
  let fixture: ComponentFixture<ReviewsCreateComponent>;
  const review = reviewDraft();

  const routeSnapshot = { snapshot: { data: { review } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        LoggerTestingModule
      ],
      declarations: [ReviewsCreateComponent, OrvAccessDeniedComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsCreateComponent);
    component = fixture.componentInstance;
    const profileService = fixture.debugElement.injector.get(ProfileService);
    profileService.profile = new BehaviorSubject<UserPrivateDTO | undefined>(profilePrivateTest());
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
