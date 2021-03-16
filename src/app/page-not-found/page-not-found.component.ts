import { Component, OnInit } from '@angular/core';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private orviumService: OrviumService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  onSend(event: object): void {
  }

}
