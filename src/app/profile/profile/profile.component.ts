import { Discipline, Profile, USER_TYPE } from 'src/app/model/orvium';
import { Component, ElementRef, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OrviumService } from '../../services/orvium.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from '../../shared/CustomValidators';
import { ActivatedRoute } from '@angular/router';
import errorMessagesJSON from 'src/assets/messages.json';
import { DisciplinesService } from '../../services/disciplines.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('disciplineInput') disciplineInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete: MatAutocomplete;

  profile: Profile;
  errorMessages = errorMessagesJSON;
  filteredDisciplines: Observable<Discipline[]>;
  profileFormGroup: FormGroup;
  disciplinesControl = new FormControl();
  USER_TYPE = USER_TYPE;

  constructor(private formBuilder: FormBuilder,
              private iterable: IterableDiffers,
              private snackBar: MatSnackBar,
              private orviumService: OrviumService,
              private disciplinesService: DisciplinesService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.profileFormGroup = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      lastName: [null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      orcid: [null, CustomValidators.validateOrcid],
      linkedin: [null, CustomValidators.validateLinkedin],
      blog: [],
      role: [],
      aboutMe: [],
      email: [null, [CustomValidators.validateEmail, Validators.required]],
      userType: [null, Validators.required],
      disciplines: [[]],
    });

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
    if (!this.matAutocomplete.isOpen) {
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

  private filterDisciplines(value: string): Discipline[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplinesService.getDisciplines().filter(discipline =>
        discipline.name.toLowerCase().includes(filterValue) &&
        !this.profileFormGroup.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    } else {
      return this.disciplinesService.getDisciplines().filter(discipline =>
        !this.profileFormGroup.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    }
  }

  selected($event: MatAutocompleteSelectedEvent): void {
    const disciplines = this.profileFormGroup.get('disciplines')?.value;
    disciplines.push($event.option.viewValue);
    this.disciplineInput.nativeElement.value = '';
    this.disciplinesControl.setValue(null);
  }

  save(): void {
    this.orviumService.updateProfile(this.profileFormGroup.value)
      .subscribe(profile => {
        this.refreshProfile(profile);
        this.snackBar.open('Profile saved', 'Dismiss', { panelClass: ['ok-snackbar'] });
      });
  }

  refreshProfile(profile: Profile): void {
    this.profile = profile;
    this.profileFormGroup.patchValue(this.profile);
    this.profileFormGroup.markAsPristine();
  }

  sendConfirmationEmail(): void {
    this.orviumService.sendConfirmationEmail().
    subscribe(response => {
      this.snackBar.open('Confirmation email sent', 'Dismiss',
        { panelClass: ['ok-snackbar'] });
      }
    );
  }
}
