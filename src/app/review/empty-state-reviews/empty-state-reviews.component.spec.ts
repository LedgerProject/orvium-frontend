import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyStateReviewsComponent } from './empty-state-reviews.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { DisciplinesService } from '../../services/disciplines.service';
import { profilePrivateTest } from '../../shared/test-data';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('EmptyStateReviewsComponent', () => {
  let component: EmptyStateReviewsComponent;
  let fixture: ComponentFixture<EmptyStateReviewsComponent>;
  const profile = profilePrivateTest();
  let loader: HarnessLoader;

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
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    const disciplinesService = fixture.debugElement.injector.get(DisciplinesService);
    spyOn(disciplinesService, 'getDisciplines').and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh and add a discipline', async () => {
    const newProfile = { ...profile, ...{ disciplines: ['Abnormal psychology'] } };
    component.refreshProfile(newProfile);
    expect(newProfile.disciplines.length).toBe(1);
    const inputDiscipline = fixture.debugElement.query(By.css('#inputDiscipline'));
    const event: MatChipInputEvent = {
      input: inputDiscipline.nativeElement,
      value: 'Acting',
    };
    component.addDiscipline(event);
    fixture.detectChanges();
    console.log(component.profile?.disciplines);
    expect(component.reviewerFormGroup.get('disciplines')?.value).toContain('Acting');
  });

  it('should remove a discipline', () => {
    const newProfile = { ...profile, ...{ disciplines: ['Acoustics'] } };
    component.refreshProfile(newProfile);
    expect(component.profile?.disciplines?.length).toBe(1);
    component.removeDiscipline('Acoustics');
    expect(component.profile?.disciplines?.length).toBe(0);
  });

  it('should be able to become reviewer', async () => {
    const becomeButton = await loader.getHarness(MatButtonHarness.with({ text: 'Become a reviewer' }));
    let initialState = await becomeButton.isDisabled();
    expect(initialState).toBe(true);
    const newProfile = { ...profile, ...{ disciplines: ['Acoustics'] } };
    component.refreshProfile(newProfile);
    const becomeCheckbox = await loader.getHarness(MatCheckboxHarness.with({ selector: '#becomeCheckbox' }));
    await becomeCheckbox.check();
    let finalState = await becomeButton.isDisabled();
    expect(finalState).toBe(false);
  });
});
