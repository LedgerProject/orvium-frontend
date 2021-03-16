import { Component, OnInit } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { Title } from '@angular/platform-browser';
import { Deposit } from '../../model/orvium';

@Component({
  selector: 'app-papers-to-review',
  templateUrl: './papers-to-review.component.html',
  styleUrls: ['./papers-to-review.component.scss']
})
export class PapersToReviewComponent implements OnInit {
  deposits: Deposit[];

  constructor(private orviumService: OrviumService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Papers to review');
    this.orviumService.getPreprintDeposits().subscribe(deposits => {
      this.deposits = deposits;
    });
  }

}
