import { Component, Input } from '@angular/core';
import { ReviewDTO } from '../../model/api';

@Component({
  selector: 'app-myreviews',
  templateUrl: './myreviews.component.html',
  styleUrls: ['./myreviews.component.scss']
})
export class MyreviewsComponent {

  displayedColumns = ['publication', 'comments', 'decision', 'action'];
  @Input() reviews: ReviewDTO[] = [];

  constructor() {
  }

}
