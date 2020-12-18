import { Component, Input, OnInit } from '@angular/core';
import { Deposit, DEPOSIT_STATUS } from '../../model/orvium';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-deposits-list',
  templateUrl: './deposits-list.component.html',
  styleUrls: ['./deposits-list.component.scss'],
})
export class DepositsListComponent implements OnInit {
  @Input() pagination = true;

  deposits: Deposit[] = [];
  pageSize = 10;
  totalDeposits: number;
  query: string;
  title: string;
  DEPOSIT_STATUS = DEPOSIT_STATUS;
  smallScreen = false;
  tinyScreen = false;
  isMyWork = false;

  constructor(private orviumService: OrviumService,
              private route: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              private router: Router) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe(['(min-width: 768px)', '(min-width: 500px)'])
      .subscribe(result => {
        this.smallScreen = !result.breakpoints['(min-width: 768px)'];
        this.tinyScreen = !result.breakpoints['(min-width: 500px)'];
      });
    this.deposits = this.route.snapshot.data.depositsQuery.deposits;
    this.totalDeposits = this.route.snapshot.data.depositsQuery.count;
    this.title = this.setTitle(this.route.snapshot.queryParamMap);
    this.query = this.route.snapshot.queryParamMap.get('query');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.deposits = this.route.snapshot.data.depositsQuery.deposits;
      this.totalDeposits = this.route.snapshot.data.depositsQuery.count;
      this.title = this.setTitle(this.route.snapshot.queryParamMap);
    });
  }

  paginate(event): void {
    const queryParams = {
      relativeTo: this.route,
      queryParams: { query: this.query, page: event.page, size: this.pageSize }
    };
    this.router.navigate([], queryParams);
  }

  setTitle(params: ParamMap): string {
    if (params.get('inReview') === 'yes') {
      return 'In Review';
    } else if (params.get('drafts') === 'yes') {
      this.isMyWork = true;
      return 'My Publications';
    } else {
      return 'Publications';
    }
  }
}
