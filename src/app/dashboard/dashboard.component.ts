import { Component } from '@angular/core';
import { Feedback } from '../shared/feedback/entity/feedback';
import { OrviumService } from '../services/orvium.service';
import { AppSnackBarService } from '../services/app-snack-bar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private orviumService: OrviumService,
              private snackBar: AppSnackBarService) {
  }

  onSend(event: object): void {
    const feedback = event as Feedback;
    this.orviumService.createFeedback(feedback).subscribe(data => {
      this.snackBar.info('Thank you for your feedback!');
    });
  }

}
