import { Component, Input, OnInit } from '@angular/core';
import { OrviumService } from 'src/app/services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PeerReview } from '../../model/orvium';

@Component({
  selector: 'app-myreviews',
  templateUrl: './myreviews.component.html',
  styleUrls: ['./myreviews.component.scss']
})
export class MyreviewsComponent implements OnInit {

  displayedColumns = ['publication', 'comments', 'decision', 'action'];
  @Input() reviews: PeerReview[];

  constructor(private orviumService: OrviumService,
              private route: ActivatedRoute,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {

  }
}
