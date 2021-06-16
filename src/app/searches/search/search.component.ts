import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { DepositDTO } from '../../model/api';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  deposits: DepositDTO[] = [];
  totalDeposits = 0;
  query?: string | null;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Search Publications');
    this.deposits = this.route.snapshot.data.depositsQuery.deposits;
    this.totalDeposits = this.route.snapshot.data.depositsQuery.count;
    this.query = this.route.snapshot.queryParamMap.get('query');

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.deposits = this.route.snapshot.data.depositsQuery.deposits;
      this.totalDeposits = this.route.snapshot.data.depositsQuery.count;
    });
  }

  paginate($event: PageEvent): void {
    let params: Params = {};
    params.query = this.route.snapshot.queryParamMap.get('query');
    params.doi = this.route.snapshot.queryParamMap.get('doi');
    params.orcid = this.route.snapshot.queryParamMap.get('orcid');
    params.from = this.route.snapshot.queryParamMap.get('from');
    params.until = this.route.snapshot.queryParamMap.get('until');
    params.status = this.route.snapshot.queryParamMap.get('status');
    params.discipline = this.route.snapshot.queryParamMap.get('discipline');
    params.page = $event.pageIndex + 1;
    params.size = $event.pageSize;
    const queryParams = {
      relativeTo: this.route,
      queryParams: params
    };
    this.router.navigate([], queryParams);
  }
}
