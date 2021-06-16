import { Component, Input } from '@angular/core';
import { DepositDTO } from '../../model/api';

@Component({
  selector: 'app-deposit-versions',
  templateUrl: './deposit-versions.component.html',
  styleUrls: ['./deposit-versions.component.scss']
})
export class DepositVersionsComponent {
  @Input() deposits: DepositDTO[] = [];

  constructor() {
  }
}
