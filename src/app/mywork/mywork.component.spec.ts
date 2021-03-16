import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MyworkComponent } from './mywork.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrviumService } from '../services/orvium.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { depositDraft } from '../shared/test-data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../shared/shared.module';

describe('MyworkComponent', () => {
  let component: MyworkComponent;
  let fixture: ComponentFixture<MyworkComponent>;
  let router: Router;

  const deposits = [depositDraft];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyworkComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
        HttpClientTestingModule,
        SharedModule
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyworkComponent);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    spyOn(orviumService, 'getMyDeposits').and.returnValue(of(deposits));
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
