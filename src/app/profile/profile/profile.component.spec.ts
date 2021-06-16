import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatInputHarness } from '@angular/material/input/testing';
import { By } from '@angular/platform-browser';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatNativeDateModule } from '@angular/material/core';
import { GravatarModule } from 'ngx-gravatar';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OrviumService } from '../../services/orvium.service';
import { of } from 'rxjs';
import { DisciplinesService } from '../../services/disciplines.service';
import { ProfileService } from '../profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { profilePrivateTest } from '../../shared/test-data';
import { UserPrivateDTO } from '../../model/api';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let loader: HarnessLoader;
  const profile: UserPrivateDTO = { ...profilePrivateTest(), isOnboarded: true };

  const routeSnapshot = { snapshot: { data: { profile } } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatCardModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        GravatarModule,
        MatInputModule,
        NoopAnimationsModule,
        MatIconModule,
        NgCircleProgressModule.forRoot({})
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    spyOn(orviumService, 'getDomain').and.returnValue(of({ emailDomain: 'orvium.io' }));

    const profileService = fixture.debugElement.injector.get(ProfileService);
    spyOn(profileService, 'getProfile').and.returnValue(of(profile));

    const disciplinesService = fixture.debugElement.injector.get(DisciplinesService);
    spyOn(disciplinesService, 'getDisciplines').and.returnValue(of([]));

    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh profile', async () => {
    let input = await loader.getHarness(MatInputHarness.with({ placeholder: 'John' }));
    let value = await input.getValue();
    expect(value).toBe('Willian');
    const newProfile: UserPrivateDTO = { ...profile, firstName: 'Francis' };
    component.refreshProfile(newProfile);
    input = await loader.getHarness(MatInputHarness.with({ placeholder: 'John' }));
    value = await input.getValue();
    expect(value).toBe('Francis');
  });

  it('should remove a discipline', async () => {
    let save = await loader.getHarness(MatButtonHarness.with({ selector: '#save' }));
    let state = await save.isDisabled();
    expect(state).toBe(true);
    const newProfile: UserPrivateDTO = { ...profile, disciplines: ['Acoustics', 'Computing'] };
    component.refreshProfile(newProfile);
    expect(newProfile.disciplines.length).toBe(2);
    component.removeDiscipline('Acoustics');
    expect(newProfile.disciplines.length).toBe(1);
    fixture.detectChanges();
    state = await save.isDisabled();
    console.log('STATE', state);
    expect(component.profileFormGroup.valid).toBe(true);
    expect(component.profileFormGroup.pristine).toBe(false);
    expect(state).toBe(false);
  });

  it('should add a discipline', async () => {
    const save = await loader.getHarness(MatButtonHarness.with({ text: 'save Save' }));
    let state = await save.isDisabled();
    expect(state).toBe(true);
    const newProfile = { ...profile, disciplines: ['Abnormal psychology'] };
    component.refreshProfile(newProfile);
    expect(newProfile.disciplines.length).toBe(1);
    const inputDiscipline = fixture.debugElement.query(By.css('#inputDiscipline'));
    const event: MatChipInputEvent = {
      input: inputDiscipline.nativeElement,
      value: 'Acting',
    };
    component.addDiscipline(event);
    fixture.detectChanges();
    expect(component.profileFormGroup.get('disciplines')?.value).toContain('Acting');
    state = await save.isDisabled();
    expect(state).toBe(false);
  });

  it('should disable and enable the save button', async () => {
    const save = await loader.getHarness(MatButtonHarness.with({ text: 'save Save' }));
    let state = await save.isDisabled();
    expect(state).toBe(true);
    const input = await loader.getHarness(MatInputHarness.with({ selector: '#firstNameInput' }));
    await input.setValue('Jaime');
    state = await save.isDisabled();
    expect(state).toBe(false);
  });

  it('should disabled button save with invalid profile', async () => {
    const save = await loader.getHarness(MatButtonHarness.with({ text: 'save Save' }));
    let state = await save.isDisabled();
    expect(state).toBe(true);
    const input = await loader.getHarness(MatInputHarness.with({ placeholder: 'Doe' }));
    await input.setValue('');
    state = await save.isDisabled();
    expect(state).toBe(true);
  });
});
