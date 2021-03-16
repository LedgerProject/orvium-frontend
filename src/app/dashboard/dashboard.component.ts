import { Component, OnInit } from '@angular/core';
import { OrviumService } from '../services/orvium.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private orviumService: OrviumService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  onSend(event: object): void {
  }

}
