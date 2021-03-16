import { Component, Input, OnInit } from '@angular/core';
import { Deposit } from '../../model/orvium';

@Component({
  selector: 'app-deposit-versions',
  templateUrl: './deposit-versions.component.html',
  styleUrls: ['./deposit-versions.component.scss']
})
export class DepositVersionsComponent implements OnInit {
  @Input() deposits: Deposit[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
