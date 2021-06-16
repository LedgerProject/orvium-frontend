import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrviumService } from '../../services/orvium.service';
import { Router } from '@angular/router';
import { AppCustomValidators } from '../../shared/AppCustomValidators';
import { DEPOSIT_STATUS_PUBLIC_LOV } from '../../model/orvium';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  searchFormGroup: FormGroup;
  DEPOSIT_STATUS_PUBLIC_LOV = DEPOSIT_STATUS_PUBLIC_LOV;

  constructor(private formBuilder: FormBuilder,
              private orviumService: OrviumService,
              private router: Router) {
    this.searchFormGroup = this.formBuilder.group({
      query: [],
      doi: [null, AppCustomValidators.validateDOI],
      orcid: [null, AppCustomValidators.validateOrcid],
      term: [],
      from: [],
      until: [],
      status: [],
    });
  }

  ngOnInit(): void {

    this.searchFormGroup.get('term')?.setValue('query');
  }

  searchPapers(): void {
    const statusParam = this.searchFormGroup.get('status')?.value?.length == DEPOSIT_STATUS_PUBLIC_LOV.length ?
      null : this.searchFormGroup.get('status')?.value;
    this.router.navigate(['/search'],
      {
        queryParams: {
          query: this.searchFormGroup.get('query')?.value,
          doi: this.searchFormGroup.get('doi')?.value,
          orcid: this.searchFormGroup.get('orcid')?.value,
          from: this.searchFormGroup.get('from')?.value,
          until: this.searchFormGroup.get('until')?.value,
          status: statusParam,
          page: 1,
          size: 10
        }, queryParamsHandling: 'merge'
      });
  }
}
