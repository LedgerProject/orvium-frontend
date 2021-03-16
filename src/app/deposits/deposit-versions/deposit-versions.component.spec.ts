import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DepositVersionsComponent } from './deposit-versions.component';

describe('DepositVersionsComponent', () => {
  let component: DepositVersionsComponent;
  let fixture: ComponentFixture<DepositVersionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepositVersionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
