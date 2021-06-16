import { Component } from '@angular/core';
import { Feedback } from '../shared/feedback/entity/feedback';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(
    private orviumService: OrviumService,
    private snackBar: MatSnackBar
  ) {
  }

  onSend(event: object): void {
    const feedback = event as Feedback;
    this.orviumService.createFeedback(feedback).subscribe(data => {
      this.snackBar.open('Thank you for your feedback!', 'Dismiss', { panelClass: ['ok-snackbar'] });
    });
  }

}
