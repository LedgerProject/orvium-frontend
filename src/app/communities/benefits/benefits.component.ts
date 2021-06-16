import { Component, Input } from '@angular/core';
import { COMMUNITY_TYPE } from 'src/app/model/api';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent {

  @Input() communityType = COMMUNITY_TYPE.university;
  COMMUNITY_TYPE = COMMUNITY_TYPE;

  constructor() {
  }

}
