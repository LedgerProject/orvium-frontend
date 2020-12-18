import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { OrviumService } from './services/orvium.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private orviumService: OrviumService) {
    const domain = '';
    this.iconRegistry.addSvgIcon('orvium',
      this.domSanitizer.bypassSecurityTrustResourceUrl(domain + 'assets/logo.svg'));
    this.iconRegistry.addSvgIcon('orviumIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(domain + 'assets/orviumIcon.svg'));
    this.iconRegistry.addSvgIcon('scientist',
      this.domSanitizer.bypassSecurityTrustResourceUrl(domain + 'assets/scientist.svg'));
    this.iconRegistry.addSvgIcon('ethereum',
      this.domSanitizer.bypassSecurityTrustResourceUrl(domain + 'assets/ethereum-logo.svg'));
  }

  ngOnInit() {
    this.orviumService.initNetworks();
  }
}
