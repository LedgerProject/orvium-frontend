import { Component, Input, OnInit } from '@angular/core';
import { Deposit, DEPOSIT_STATUS } from '../../model/orvium';

@Component({
  selector: 'app-deposits-list',
  templateUrl: './deposits-list.component.html',
  styleUrls: ['./deposits-list.component.scss'],
})
export class DepositsListComponent implements OnInit {
  @Input() deposits: Deposit[] = [];

  DEPOSIT_STATUS = DEPOSIT_STATUS;

  constructor() {
  }

  ngOnInit(): void {
  }
}
