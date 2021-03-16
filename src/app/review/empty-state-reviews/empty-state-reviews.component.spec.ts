import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyStateReviewsComponent } from './empty-state-reviews.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { DisciplinesService } from '../../services/disciplines.service';
import { profileTest } from '../../shared/test-data';

describe('EmptyStateReviewsComponent', () => {
  let component: EmptyStateReviewsComponent;
  let fixture: ComponentFixture<EmptyStateReviewsComponent>;
  const profile = profileTest;

  const routeSnapshot = { snapshot: { data: { profile } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyStateReviewsComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule,
        MatChipsModule, MatAutocompleteModule,
        MatCardModule, MatFormFieldModule, HttpClientModule, MatSliderModule, MatCheckboxModule, BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateReviewsComponent);
    component = fixture.componentInstance;
    const disciplinesService = fixture.debugElement.injector.get(DisciplinesService);
    spyOn(disciplinesService, 'getDisciplines').and.returnValue([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
