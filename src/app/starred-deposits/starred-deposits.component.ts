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
  displayedColumns: string[] = ['avatar', 'title', 'authors', 'publicationType', 'accessRight'];
  starredDeposits: MatTableDataSource<Deposit>;

  constructor(private orviumService: OrviumService) {
  }

  ngOnInit() {
    this.orviumService.getDeposits(undefined, undefined, undefined, undefined, 'yes')
      .subscribe(response => {
        if (response.deposits !== null && response.deposits.length > 0) {
          response.deposits.map(deposit => {
            deposit.url = `deposits/${deposit._id.$oid}`;
            return deposit;
          });
          this.starredDeposits = new MatTableDataSource(response.deposits);
        }
      });
  }

  applyFilter(filterValue: string) {
    this.starredDeposits.filter = filterValue.trim().toLowerCase();
  }

}
