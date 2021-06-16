import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSubmitViewComponent } from './after-submit-view.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { profilePrivateTest } from '../../shared/test-data';
import { UserPrivateDTO } from '../../model/api';
import { OrvAccessDeniedComponent } from '@orvium/ux-components';

describe('AfterSubmitViewComponent', () => {
  let component: AfterSubmitViewComponent;
  let fixture: ComponentFixture<AfterSubmitViewComponent>;

  const profile: UserPrivateDTO = { ...profilePrivateTest(), ...{ isOnboarded: true, emailConfirmed: true } };

  const routeSnapshot = { snapshot: { data: { profile } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AfterSubmitViewComponent, OrvAccessDeniedComponent],
      imports: [HttpClientModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterSubmitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
