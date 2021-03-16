import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrviumService } from '../services/orvium.service';
import { depositsQueryTest } from '../shared/test-data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const depositsQuery = depositsQueryTest;

  const routeSnapshot = {
    snapshot: {
      data: { depositsQuery },
      queryParamMap: convertToParamMap({ query: '/publications' })
    },
    queryParamMap: of(convertToParamMap({ query: 'publications' }))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        SharedModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        NoopAnimationsModule
      ],
      declarations: [HomeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    spyOn(orviumService, 'getCommunities').and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
