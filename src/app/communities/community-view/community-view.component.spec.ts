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
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { BenefitsComponent } from '../benefits/benefits.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { CallForPapersComponent } from '../call-for-papers/call-for-papers.component';
import { communityTest } from '../../shared/test-data';
import { CommunityDTO } from '../../model/api';

describe('CommunityViewComponent', () => {
  let component: CommunityViewComponent;
  let fixture: ComponentFixture<CommunityViewComponent>;


  const community: CommunityDTO = communityTest();
  const routeSnapshot = {
    data: of({ community })
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityViewComponent, BenefitsComponent, CallForPapersComponent],
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
        FontAwesomeTestingModule,
        MatTabsModule,
        MatChipsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot }
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
