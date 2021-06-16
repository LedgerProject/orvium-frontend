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
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationsPanelComponent } from '../notification/notifications-panel/notifications-panel.component';
import { ProfileService } from '../profile/profile.service';
import { profilePrivateTest } from '../shared/test-data';
import { UserPrivateDTO } from '../model/api';
import { SharedModule } from '../shared/shared.module';
import { OrviumUxLibModule } from '@orvium/ux-components';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  const profile = profilePrivateTest();

  beforeEach(waitForAsync(() => {
    const sidenavSpy = jasmine.createSpyObj('SidenavService', ['toggle', 'setSidenav']);
    const orviumServiceSpy = jasmine.createSpyObj('OrviumService', ['getProfile']);

    orviumServiceSpy.getProfile.and.returnValue(of(Promise.resolve({})));

    TestBed.configureTestingModule({
      declarations: [SideNavComponent, NotificationsPanelComponent],
      imports: [RouterTestingModule, MatSnackBarModule, HttpClientModule, MatSidenavModule,
        MatIconModule,
        MatListModule,
        SharedModule,
        NoopAnimationsModule,
        MatDialogModule,
        OrviumUxLibModule
      ],
      providers: [
        // { provide: SidenavService, useValue: sidenavSpy },
        { provide: OrviumService, useValue: orviumServiceSpy },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    const profileService = fixture.debugElement.injector.get(ProfileService);
    profileService.profile = new BehaviorSubject<UserPrivateDTO | undefined>(profile);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
