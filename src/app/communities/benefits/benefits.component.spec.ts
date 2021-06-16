import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsComponent } from './benefits.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('BenefitsComponent', () => {
  let component: BenefitsComponent;
  let fixture: ComponentFixture<BenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BenefitsComponent],
      imports: [
        MatCardModule,
        MatIconModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
