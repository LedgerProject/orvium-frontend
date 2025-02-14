import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OrviumService } from '../services/orvium.service';
import { DepositDTO } from '../model/api';


@Component({
  selector: 'app-mywork',
  templateUrl: './mywork.component.html',
  styleUrls: ['./mywork.component.scss']
})
export class MyworkComponent implements OnInit {
  deposits: DepositDTO[] = [];
  initialized = false;

  constructor(private titleService: Title,
              private orviumService: OrviumService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('My publications');
    this.orviumService.getMyDeposits().subscribe(deposits => {
      this.deposits = deposits;
      this.initialized = true;
    });
  }
}
