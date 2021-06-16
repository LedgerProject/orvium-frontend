import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplinesService } from '../../services/disciplines.service';
import { MatSliderChange } from '@angular/material/slider';
import { ProfileService } from '../../profile/profile.service';
import { DisciplineDTO, UserPrivateDTO } from '../../model/api';

@Component({
  selector: 'app-empty-state-reviews',
  templateUrl: './empty-state-reviews.component.html',
  styleUrls: ['./empty-state-reviews.component.scss']
})
export class EmptyStateReviewsComponent implements OnInit {
  @ViewChild('disciplineInput') disciplineInput?: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete?: MatAutocomplete;
  reviewerFormGroup: FormGroup;
  filteredDisciplines?: Observable<DisciplineDTO[]>;
  disciplinesControl = new FormControl();
  numberSimultaneousReviews = 1;
  profile?: UserPrivateDTO;
  private disciplines: DisciplineDTO[] = [];

  constructor(private formBuilder: FormBuilder,
              private profileService: ProfileService,
              private disciplinesService: DisciplinesService,
              private router: Router,
              private route: ActivatedRoute) {
    this.reviewerFormGroup = this.formBuilder.group({
      disciplines: [[]],
      reviewersCode: [null, Validators.required]
    });
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
    const disciplines = this.reviewerFormGroup.get('disciplines')?.value;
    const index = disciplines.indexOf(discipline);

    if (index >= 0) {
      disciplines.splice(index, 1);
      this.reviewerFormGroup.patchValue({ disciplines });
    }
    this.reviewerFormGroup.markAsDirty();
  }

  addDiscipline($event: MatChipInputEvent): void {
    if (this.matAutocomplete && !this.matAutocomplete.isOpen) {
      const input = $event.input;
      const value = $event.value;
      const disciplines = this.disciplinesControl.value;

      if ((value || '').trim() && disciplines.push) {
        disciplines.push(value.trim());
        this.reviewerFormGroup.patchValue({ disciplines });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
    this.reviewerFormGroup.markAsDirty();
  }

  selected($event: MatAutocompleteSelectedEvent): void {
    const disciplines = this.reviewerFormGroup.controls.disciplines?.value;
    if (disciplines) {
      disciplines.push($event.option.viewValue);
    }
    if (this.disciplineInput) {
      this.disciplineInput.nativeElement.value = '';
    }
    this.disciplinesControl.setValue(null);
  }

  updateValueSlider(event: MatSliderChange): void {
    this.numberSimultaneousReviews = event.value || 0;
  }

  formatLabel(value: number): number {
    return value;
  }

  becomeReviewer(): void {
    this.profileService.updateProfile({
      simultaneousReviews: this.numberSimultaneousReviews,
      disciplines: this.reviewerFormGroup.get('disciplines')?.value
    })
      .subscribe(profile => {
        this.router.navigateByUrl('/reviews/paperstoreview');
      });
  }

  refreshProfile(profile: UserPrivateDTO): void {
    this.profile = profile;
    this.reviewerFormGroup.patchValue(this.profile);
    this.reviewerFormGroup.markAsPristine();
  }

  private filterDisciplines(value: string): DisciplineDTO[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplines.filter(discipline =>
        discipline.name.toLowerCase().includes(filterValue) &&
        !this.reviewerFormGroup.controls.disciplines?.value?.includes(discipline.name))
        .slice(0, 50);
    } else {
      return this.disciplines.filter(discipline =>
        !this.reviewerFormGroup.controls.disciplines?.value?.includes(discipline.name))
        .slice(0, 50);
    }
  }

}
