import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DepositsReviewsTableComponent } from './deposits-reviews-table.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

describe('DepositsReviewsTableComponent', () => {
  let component: DepositsReviewsTableComponent;
  let fixture: ComponentFixture<DepositsReviewsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatTableModule,
        MatSnackBarModule],
      declarations: [DepositsReviewsTableComponent],
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositsReviewsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
