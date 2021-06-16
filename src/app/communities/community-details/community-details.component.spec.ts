import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDetailsComponent } from './community-details.component';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { communityTest } from '../../shared/test-data';
import { CommunityDTO } from '../../model/api';
import { OrvAccessDeniedComponent } from '@orvium/ux-components';

describe('CommunityDetailsComponent', () => {
  let component: CommunityDetailsComponent;
  let fixture: ComponentFixture<CommunityDetailsComponent>;

  const community: CommunityDTO = communityTest();
  const routeSnapshot = { snapshot: { data: { community } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityDetailsComponent, OrvAccessDeniedComponent],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        MatIconModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
