import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { OrviumService } from './services/orvium.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { BlockchainService } from './blockchain/blockchain.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons/faFileCsv';
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileCode } from '@fortawesome/free-solid-svg-icons/faFileCode';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faLeaf } from '@fortawesome/free-solid-svg-icons/faLeaf';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faCreativeCommons } from '@fortawesome/free-brands-svg-icons/faCreativeCommons';
import { faCreativeCommonsZero } from '@fortawesome/free-brands-svg-icons/faCreativeCommonsZero';
import { faCreativeCommonsBy } from '@fortawesome/free-brands-svg-icons/faCreativeCommonsBy';
import { faCreativeCommonsNd } from '@fortawesome/free-brands-svg-icons/faCreativeCommonsNd';
import { faOrcid } from '@fortawesome/free-brands-svg-icons/faOrcid';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { ThemeService } from './theme/theme.service';
import { faEthereum } from '@fortawesome/free-brands-svg-icons/faEthereum';
import { ProfileService } from './profile/profile.service';
import { UserPrivateDTO } from './model/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public profile?: UserPrivateDTO;
  public theme = 'light-theme';

  constructor(private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private orviumService: OrviumService,
              private profileService: ProfileService,
              private blockchainService: BlockchainService,
              private router: Router,
              private metaService: Meta,
              private faIconLibrary: FaIconLibrary,
              private themeService: ThemeService,
              @Inject(PLATFORM_ID) private platformId: string,
              @Inject(DOCUMENT) private document: Document
  ) {
    this.iconRegistry.addSvgIcon('orvium',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://assets.orvium.io/logo/logo.svg'));
    this.iconRegistry.addSvgIcon('orviumIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://assets.orvium.io/logo/orviumIcon.svg'));
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.metaService.addTag({ name: 'robots', content: 'noindex' });
    }

    const profile = this.profileService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }

    this.blockchainService.initNetworks();

    // Add an icon to the library for convenient access in other components
    this.faIconLibrary.addIcons(
      faFileWord,
      faFilePdf,
      faFileCsv,
      faFileImage,
      faFile,
      faFileCode,
      faFileAlt,
      faLeaf,
      faTwitter,
      faFacebookF,
      faLinkedin,
      faOrcid,
      faEthereum,
      faCreativeCommons,
      faCreativeCommonsZero,
      faCreativeCommonsBy,
      faCreativeCommonsNd,
      faGithub
    );

    this.themeService.getTheme().subscribe(theme => this.theme = theme);
  }

  resetPosition(): void {
    const content = this.document.getElementById('main-content');
    if (content) {
      content.scrollTop = 0;
    }
  }
}
