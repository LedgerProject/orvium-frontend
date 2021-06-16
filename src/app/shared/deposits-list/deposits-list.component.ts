import { Component, Input } from '@angular/core';
import { DEPOSIT_STATUS, DepositDTO } from 'src/app/model/api';

@Component({
  selector: 'app-deposits-list',
  templateUrl: './deposits-list.component.html',
  styleUrls: ['./deposits-list.component.scss'],
})
export class DepositsListComponent {
  @Input() deposits: DepositDTO[] = [];

  DEPOSIT_STATUS = DEPOSIT_STATUS;

  constructor() {
  }
}
