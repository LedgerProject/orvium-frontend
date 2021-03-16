import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommunityViewComponent } from './community-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareModule } from 'ngx-sharebuttons';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Community } from '../../model/orvium';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

describe('CommunityViewComponent', () => {
  let component: CommunityViewComponent;
  let fixture: ComponentFixture<CommunityViewComponent>;

  const community: Community = {
    _id: '123412341234',
    name: 'Delft University of Technology (TU Delft)',
    description: 'Top education and research are at the heart of the oldest and largest technical university in the Netherlands. ' +
      'Our 8 faculties offer 16 bachelors and more than 30 masters programmes. ' +
      'Our more than 25,000 students and 6,000 employees share a fascination for science, design and technology. ' +
      'Our common mission: impact for a better society.',
    country: 'Delft, Netherlands',
    twitterURL: 'https://twitter.com/tudelft',
    facebookURL: 'https://www.facebook.com/TUDelft/',
    websiteURL: 'https://www.tudelft.nl/',
    users: [],
    logoURL: '',
    acknowledgement: '',
    guidelinesURL: '',
  };
  const routeSnapshot = { data: of({ community }) };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityViewComponent],
      imports: [
        RouterTestingModule,
        SharedModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSmartModalModule.forRoot(),
        MatInputModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatIconModule, MatCardModule, FontAwesomeModule, ShareModule,
        FontAwesomeTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
