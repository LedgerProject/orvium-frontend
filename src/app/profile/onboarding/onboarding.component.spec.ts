import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OnboardingComponent } from './onboarding.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GravatarModule } from 'ngx-gravatar';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { profilePrivateTest } from '../../shared/test-data';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let httpTestingController: HttpTestingController;
  const profile = profilePrivateTest();


  const routeSnapshot = { snapshot: { data: { profile } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule,
        HttpClientModule, MatButtonToggleModule,
        MatStepperModule,
        MatFormFieldModule,
        GravatarModule,
        MatInputModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        LoggerTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ],
      declarations: [OnboardingComponent],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
