import { Component, OnInit } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { Title } from '@angular/platform-browser';
import { DepositDTO } from '../../model/api';

@Component({
  selector: 'app-papers-to-review',
  templateUrl: './papers-to-review.component.html',
  styleUrls: ['./papers-to-review.component.scss']
})
export class PapersToReviewComponent implements OnInit {
  deposits: DepositDTO[] = [];

  constructor(private orviumService: OrviumService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Papers to review');
    this.orviumService.getPapersToReview().subscribe(deposits => {
      this.deposits = deposits;
      console.log(this.deposits);
    });
  }

}
