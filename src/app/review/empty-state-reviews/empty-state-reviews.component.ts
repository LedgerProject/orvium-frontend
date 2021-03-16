import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Discipline, Profile } from '../../model/orvium';
import { DisciplinesService } from '../../services/disciplines.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-empty-state-reviews',
  templateUrl: './empty-state-reviews.component.html',
  styleUrls: ['./empty-state-reviews.component.scss']
})
export class EmptyStateReviewsComponent implements OnInit {
  @ViewChild('disciplineInput') disciplineInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete: MatAutocomplete;
  reviewerFormGroup: FormGroup;
  filteredDisciplines: Observable<Discipline[]>;
  disciplinesControl = new FormControl();
  numberSimultaneousReviews = 1;
  profile: Profile;

  constructor(private formBuilder: FormBuilder,
              private orviumService: OrviumService,
              private disciplinesService: DisciplinesService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.reviewerFormGroup = this.formBuilder.group({
      disciplines: [[]],
      reviewersCode: [null, Validators.required]
    });

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
    if (!this.matAutocomplete.isOpen) {
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

  private filterDisciplines(value: string): Discipline[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplinesService.getDisciplines().filter(discipline =>
        discipline.name.toLowerCase().includes(filterValue) &&
        !this.reviewerFormGroup.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    } else {
      return this.disciplinesService.getDisciplines().filter(discipline =>
        !this.reviewerFormGroup.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    }
  }

  selected($event: MatAutocompleteSelectedEvent): void {
    const disciplines = this.reviewerFormGroup.get('disciplines')?.value;
    disciplines.push($event.option.viewValue);
    this.disciplineInput.nativeElement.value = '';
    this.disciplinesControl.setValue(null);
  }

  updateValueSlider(event: MatSliderChange): void {
    this.numberSimultaneousReviews = event.value || 0;
  }

  formatLabel(value: number): number {
    return value;
  }

  becomeReviewer(): void {
    this.orviumService.updateProfile({
      simultaneousReviews: this.numberSimultaneousReviews,
      disciplines: this.reviewerFormGroup.get('disciplines')?.value
    })
      .subscribe(profile => {
        this.router.navigateByUrl('/reviews/paperstoreview');
      });
  }

  refreshProfile(profile: Profile): void {
    this.profile = profile;
    this.reviewerFormGroup.patchValue(this.profile);
    this.reviewerFormGroup.markAsPristine();
  }

}
