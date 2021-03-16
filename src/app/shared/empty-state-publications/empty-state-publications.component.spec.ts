import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyStatePublicationsComponent } from './empty-state-publications.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareModule } from 'ngx-sharebuttons';

describe('EmptyStatePublicationsComponent', () => {
  let component: EmptyStatePublicationsComponent;
  let fixture: ComponentFixture<EmptyStatePublicationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyStatePublicationsComponent],
      imports: [
        RouterTestingModule, HttpClientTestingModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSmartModalModule.forRoot(),
        MatInputModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatIconModule, MatCardModule, FontAwesomeModule, ShareModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStatePublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
