import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EthereumService } from '../blockchain/ethereum.service';
import { Router } from '@angular/router';
import { OrviumService } from '../services/orvium.service';
import { of } from 'rxjs';
import { SidenavService } from '../services/sidenav.service';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { GravatarModule } from 'ngx-gravatar';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../notification/notification.service';
import SpyObj = jasmine.SpyObj;


describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let ethServiceSpy: jasmine.SpyObj<EthereumService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const ethSpy = jasmine.createSpyObj('EthereumService', ['getNetwork', 'isAvailable']);
    const orviumSpy = jasmine.createSpyObj('OrviumService', ['getProfile']);
    const sidenavSpy = jasmine.createSpyObj('SidenavService', ['toggle']);

    const notificationSpy = jasmine.createSpyObj('NotificationService', ['getNotifications']);
    notificationSpy.getNotifications.and.returnValue(of([]));

    ethSpy.isAvailable.and.returnValue(true);
    ethSpy.getNetwork.and.returnValue(Promise.resolve('ropsten'));
    orviumSpy.getProfile.and.returnValue(of({
      gravatar: '0a2aaae0ac1310d1f8e8e68df45fe7b8'
    }));
    sidenavSpy.toggle.and.returnValue(true);

    TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatIconModule,
        MatIconTestingModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatInputModule,
        MatBadgeModule,
        GravatarModule,
        NoopAnimationsModule,
        HttpClientModule,
        MatListModule,
        MatDialogModule,
        NgxSmartModalModule.forRoot()],
      providers: [
        { provide: EthereumService, useValue: ethSpy },
        { provide: OrviumService, useValue: orviumSpy },
        { provide: SidenavService, useValue: sidenavSpy },
        {
          provide: NotificationService,
          useValue: notificationSpy
        }
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
    ethServiceSpy = TestBed.inject(EthereumService) as SpyObj<EthereumService>;
    ethServiceSpy.isAvailable.and.returnValue(true);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate when searching', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.searchInput = 'My deposit title';
    component.searchPapers();

    expect(navigateSpy).toHaveBeenCalledWith(['/search'],
      { queryParams: { query: 'My deposit title', page: 1, size: 10 }, queryParamsHandling: 'merge' });
  });
});
