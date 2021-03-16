import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Deposit } from '../model/orvium';
import { OrviumService } from '../services/orvium.service';

@Component({
  selector: 'app-starred-deposits',
  templateUrl: './starred-deposits.component.html',
  styleUrls: ['./starred-deposits.component.scss']
})
export class StarredDepositsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'publicationType', 'status'];
  starredDeposits: MatTableDataSource<Deposit>;

  constructor(private orviumService: OrviumService) {
  }

  ngOnInit(): void {
    this.orviumService.getMyStarredDeposits().subscribe(deposits => {
      this.starredDeposits = new MatTableDataSource(deposits);
    });
  }

  applyFilter(filterValue: string): void {
    this.starredDeposits.filter = filterValue.trim().toLowerCase();
  }

}
