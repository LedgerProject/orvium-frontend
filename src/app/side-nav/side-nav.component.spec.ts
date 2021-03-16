import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SidenavService } from '../services/sidenav.service';
import { BehaviorSubject, of } from 'rxjs';
import { OrviumService } from '../services/orvium.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { Profile } from '../model/orvium';
import { profileTest } from '../shared/test-data';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  const profile = profileTest;

  beforeEach(waitForAsync(() => {
    const sidenavSpy = jasmine.createSpyObj('SidenavService', ['toggle', 'setSidenav']);
    const orviumServiceSpy = jasmine.createSpyObj('OrviumService', ['getProfile']);

    orviumServiceSpy.getProfile.and.returnValue(of(Promise.resolve({})));

    TestBed.configureTestingModule({
      declarations: [SideNavComponent],
      imports: [RouterTestingModule, MatSnackBarModule, HttpClientModule, MatSidenavModule,
        MatIconModule,
        MatListModule,
        NgxSpinnerModule,
        NoopAnimationsModule,
        MatDialogModule
      ],
      providers: [
        { provide: SidenavService, useValue: sidenavSpy },
        { provide: OrviumService, useValue: orviumServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    orviumService.profile = new BehaviorSubject<Profile | undefined>(profile);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
