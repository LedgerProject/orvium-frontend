import { Profile } from 'src/app/model/orvium';
import { Component, ElementRef, IterableDiffer, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OrviumService } from '../services/orvium.service';
import disciplinesJSON from 'src/assets/disciplines.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidators } from '../shared/CustomValidators';
import { ActivatedRoute } from '@angular/router';
import errorMessagesJSON from 'src/assets/messages.json';


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
  disciplines = disciplinesJSON;
  filteredDisciplines: Observable<string[]>;
  profileFormGroup: FormGroup;
  disciplinesControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
              private iterable: IterableDiffers,
              private snackBar: MatSnackBar,
              private orviumService: OrviumService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.disciplinesControl.setValue([]);
    this.profileFormGroup = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthdate: [],
      orcid: [null, CustomValidators.validateOrcid],
      linkedin: [null, CustomValidators.validateLinkedin],
      blog: [],
      role: [],
      aboutMe: [],
      email: [null, [CustomValidators.validateEmail, Validators.required]],
      userType: [null, Validators.required],
      disciplines: [[]],
    });
    this.filteredDisciplines = this.disciplinesControl.valueChanges.pipe(
      // tslint:disable-next-line:deprecation
      startWith(null),
      map((discipline: string | null) => this._filter(discipline)));

    this.refreshProfile(this.route.snapshot.data.profile);
  }

  removeDiscipline(discipline: any) {
    const disciplines = this.profileFormGroup.get('disciplines').value;
    const index = disciplines.indexOf(discipline);

    if (index >= 0) {
      disciplines.splice(index, 1);
      this.profileFormGroup.patchValue({ disciplines });
    }
    this.profileFormGroup.markAsDirty();
  }

  addDiscipline($event: MatChipInputEvent) {
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

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplines.filter(discipline =>
        discipline.toLowerCase().includes(filterValue) &&
        !this.profileFormGroup.get('disciplines').value.includes(discipline))
        .slice(0, 50);
    } else {
      return this.disciplines.filter(discipline =>
        !this.profileFormGroup.get('disciplines').value.includes(discipline))
        .slice(0, 50);
    }
  }

  selected($event: MatAutocompleteSelectedEvent) {
    const disciplines = this.profileFormGroup.get('disciplines').value;
    disciplines.push($event.option.viewValue);
    this.disciplineInput.nativeElement.value = '';
    this.disciplinesControl.setValue(null);
  }

  save() {
    let updatedProfile = this.profileFormGroup.value;
    console.log(updatedProfile);
    this.orviumService.updateProfile(updatedProfile)
      .subscribe(profile => {
        this.refreshProfile(profile);
        this.snackBar.open('Profile saved', null, { panelClass: ['ok-snackbar'] });
      });
  }

  refreshProfile(profile: Profile) {
    this.profile = profile;
    this.profileFormGroup.patchValue(this.profile);
    this.profileFormGroup.markAsPristine();
  }
}
