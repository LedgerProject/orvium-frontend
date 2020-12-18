import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OrviumService } from '../services/orvium.service';

@Component({
  selector: 'app-papers-search',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router,
              private titleService: Title,
              public orviumService: OrviumService,
              private injector: Injector) {
  }

  ngOnInit() {
    this.titleService.setTitle('Orvium Home');
  }
}
