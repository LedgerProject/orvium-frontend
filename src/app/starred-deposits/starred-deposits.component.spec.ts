import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StarredDepositsComponent } from './starred-deposits.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DisciplinesService } from '../services/disciplines.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StarredDepositsComponent', () => {
  let component: StarredDepositsComponent;
  let fixture: ComponentFixture<StarredDepositsComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      declarations: [StarredDepositsComponent],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredDepositsComponent);
    component = fixture.componentInstance;
    const disciplinesService = fixture.debugElement.injector.get(DisciplinesService);
    spyOn(disciplinesService, 'getDisciplines').and.returnValue([]);

    fixture.detectChanges();

    const req = httpTestingController.expectOne('http://localhost:4200/api/v1/deposits/myStarredDeposits');
    expect(req.request.method).toEqual('GET');
    req.flush({ deposit: [] });
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
