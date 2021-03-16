import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Deposit } from '../model/orvium';
import { filter } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  deposits: Deposit[];
  totalDeposits: number;
  query: string;

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
    this.query = this.route.snapshot.queryParamMap.get('query') || '';

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.deposits = this.route.snapshot.data.depositsQuery.deposits;
      this.totalDeposits = this.route.snapshot.data.depositsQuery.count;
    });
  }

  paginate($event: PageEvent): void {
    const queryParams = {
      relativeTo: this.route,
      queryParams: { query: this.query, page: $event.pageIndex + 1, size: $event.pageSize }
    };
    this.router.navigate([], queryParams);
  }
}
