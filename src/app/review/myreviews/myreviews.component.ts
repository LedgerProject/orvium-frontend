import { Component, OnInit } from '@angular/core';
import { OrviumService } from 'src/app/services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { PeerReview, REVIEW_STATUS } from '../../model/orvium';

@Component({
  selector: 'app-myreviews',
  templateUrl: './myreviews.component.html',
  styleUrls: ['./myreviews.component.scss']
})
export class MyreviewsComponent implements OnInit {

  reviews: PeerReview[] = [];
  REVIEW_STATUS = REVIEW_STATUS;

  constructor(private orviumService: OrviumService,
              private route: ActivatedRoute,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.route.queryParamMap.subscribe(params => {
        this.spinnerService.show();
        this.orviumService.getReviews()
          .pipe(
            finalize(() => {
              this.spinnerService.hide();
            })
          )
          .subscribe(result => {
            this.reviews = result;
          });
      });
    });
  }
}
