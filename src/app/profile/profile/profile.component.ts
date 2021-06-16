import { Component, ElementRef, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppCustomValidators } from '../../shared/AppCustomValidators';
import { ActivatedRoute } from '@angular/router';
import errorMessagesJSON from 'src/assets/messages.json';
import { DisciplinesService } from '../../services/disciplines.service';
import { ProfileService } from '../profile.service';
import { DisciplineDTO, USER_TYPE, UserPrivateDTO } from 'src/app/model/api';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('disciplineInput') disciplineInput?: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete?: MatAutocomplete;

  profile: UserPrivateDTO;
  errorMessages = errorMessagesJSON;
  filteredDisciplines?: Observable<DisciplineDTO[]>;
  profileFormGroup: FormGroup;
  disciplinesControl = new FormControl();
  USER_TYPE = USER_TYPE;
  focusFirstName?: boolean;
  focusLastName?: boolean;
  private disciplines: DisciplineDTO[] = [];

  constructor(private formBuilder: FormBuilder,
              private iterable: IterableDiffers,
              private snackBar: MatSnackBar,
              private profileService: ProfileService,
              private disciplinesService: DisciplinesService,
              private route: ActivatedRoute) {
    this.profileFormGroup = this.formBuilder.group({
      firstName: [null, [Validators.required, AppCustomValidators.validateIsNotBlank]],
      lastName: [null, [Validators.required, AppCustomValidators.validateIsNotBlank]],
      orcid: [null, AppCustomValidators.validateOrcid],
      linkedin: [null, AppCustomValidators.validateLinkedin],
      blog: [],
      role: [],
      aboutMe: [],
      email: [null, [AppCustomValidators.validateEmail, Validators.required]],
      userType: [null, Validators.required],
      disciplines: [[]],
    });

    this.profile = this.route.snapshot.data.profile;
  }

  ngOnInit(): void {
    this.disciplinesService.getDisciplines().subscribe(
      disciplines => this.disciplines = disciplines
    );
    this.disciplinesControl.setValue([]); // Init control value
    this.filteredDisciplines = this.disciplinesControl.valueChanges.pipe(
      startWith(null),
      map((discipline: string | null) => this.filterDisciplines(discipline || '')));

    this.refreshProfile(this.route.snapshot.data.profile);
  }

  removeDiscipline(discipline: unknown): void {
    const disciplines = this.profileFormGroup.get('disciplines')?.value;
    const index = disciplines.indexOf(discipline);

    if (index >= 0) {
      disciplines.splice(index, 1);
      this.profileFormGroup.patchValue({ disciplines });
    }
    this.profileFormGroup.markAsDirty();
  }

  addDiscipline($event: MatChipInputEvent): void {
    if (this.matAutocomplete && !this.matAutocomplete.isOpen) {
      const input = $event.input;
      const value = $event.value;
      const disciplines = this.disciplinesControl.value;

      if ((value || '').trim() && disciplines.push) {
        disciplines.push(value.trim());
        this.profileFormGroup.patchValue({ disciplines });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
    this.profileFormGroup.markAsDirty();
  }

  selected($event: MatAutocompleteSelectedEvent): void {
    const disciplines = this.profileFormGroup.get('disciplines')?.value;
    disciplines.push($event.option.viewValue);
    if (this.disciplineInput) {
      this.disciplineInput.nativeElement.value = '';
    }
    this.disciplinesControl.setValue(null);
  }

  save(): void {
    this.profileService.updateProfile(this.profileFormGroup.value)
      .subscribe(profile => {
        this.refreshProfile(profile);
        this.snackBar.open('Profile saved', 'Dismiss', { panelClass: ['ok-snackbar'] });
      });
  }

  refreshProfile(profile: UserPrivateDTO): void {
    this.profile = profile;
    this.profileFormGroup.patchValue(this.profile);
    this.profileFormGroup.markAsPristine();
  }

  sendConfirmationEmail(): void {
    this.profileService.sendConfirmationEmail().subscribe(
      response => {
        this.snackBar.open('Confirmation email sent', 'Dismiss',
          { panelClass: ['ok-snackbar'] });
      }
    );
  }

  private filterDisciplines(value: string): DisciplineDTO[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplines.filter(discipline =>
        discipline.name.toLowerCase().includes(filterValue) &&
        !this.profileFormGroup.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    } else {
      return this.disciplines.filter(discipline =>
        !this.profileFormGroup.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    }
  }
}
