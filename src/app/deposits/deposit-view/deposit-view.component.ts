import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ACCESS_RIGHT_LOV,
  Deposit,
  DEPOSIT_STATUS,
  PeerReview,
  Profile,
  PUBLICATION_TYPE_LOV,
  REVIEW_STATUS,
  REVIEW_TYPE_LOV,
} from 'src/app/model/orvium';
import { EthereumService } from '../../services/ethereum.service';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { ShareService } from '@ngx-share/core';
import { faFacebookF, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { MatStepper } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'app-deposit-view',
  templateUrl: './deposit-view.component.html',
  styleUrls: ['./deposit-view.component.scss']
})
export class DepositViewComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper: MatStepper;
  faTwitter = faTwitter;
  faFacebookF = faFacebookF;
  faLinkedin = faLinkedin;
  faQuestionCircle = faQuestionCircle;

  deposit: Deposit;
  reviews: PeerReview[];
  reviewTypeLOV = REVIEW_TYPE_LOV;
  publicationTypeLOV = PUBLICATION_TYPE_LOV;
  accessRightLOV = ACCESS_RIGHT_LOV;
  environment = environment;
  twitterDescription: string;

  isOwner = false;

  columnsToDisplay = ['filename', 'contentType', 'length', 'edit'];
  reviewColumnsToDisplay = ['author', 'file', 'rewards'];
  balanceTokens: string;
  allowanceTokens: string;

  isStarred = false;
  profile: Profile;
  reviewsNumber = 0;
  private metaElements: HTMLMetaElement[];

  private subscription: Subscription;

  DEPOSIT_STATUS = DEPOSIT_STATUS;
  REVIEW_STATUS = REVIEW_STATUS;
  smallScreen = false;
  tinyScreen = false;

  constructor(public orviumService: OrviumService,
              private route: ActivatedRoute,
              private router: Router,
              public ethereumService: EthereumService,
              private snackBar: MatSnackBar,
              private spinnerService: NgxSpinnerService,
              private titleService: Title,
              private metaService: Meta,
              private logger: NGXLogger,
              public breakpointObserver: BreakpointObserver,
              public share: ShareService
  ) {
  }

  ngOnInit() {
    this.deposit = this.route.snapshot.data.deposit;
    this.orviumService.getProfile().subscribe(profile => {
      this.profile = profile;
      if (this.profile && this.profile.userId === this.deposit.owner) {
        this.isOwner = true;
        this.refreshDeposit(this.deposit);
      }
    });

    if (this.deposit.publicationDate) {
      this.deposit.publicationDate = this.deposit.publicationDate.slice(0, 10);
    }

    this.orviumService.getPeerReviews(this.deposit._id.$oid).subscribe(reviews => {
      this.reviews = reviews;
    });

    this.refreshDeposit(this.deposit);

    this.breakpointObserver.observe(['(min-width: 768px)', '(min-width: 500px)'])
      .subscribe(result => {
        this.smallScreen = !result.breakpoints['(min-width: 768px)'];
        this.tinyScreen = !result.breakpoints['(min-width: 500px)'];
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.deposit.status === DEPOSIT_STATUS.inReview) {
        this.stepper.selectedIndex = 1;
      } else if (this.deposit.status === DEPOSIT_STATUS.published) {
        this.stepper.selectedIndex = 1;
        this.stepper.selectedIndex = 2;
      }
      this.reviewsNumber = this.deposit.peerReviews.length;
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    if (this.metaElements) {
      for (const element of this.metaElements) {
        this.metaService.removeTagElement(element);
      }
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private refreshDeposit(deposit: Deposit): void {
    this.deposit = deposit;
    this.setSEOTags();
    if (this.ethereumService.isInitialized) {
      this.ethereumService.getTokenBalance(deposit).then(result => this.balanceTokens = result);
      this.ethereumService.getTokenAllowance().subscribe(result => this.allowanceTokens = result.toString());
    }

    if (this.profile) {
      if (this.profile.starredDeposits.indexOf(this.deposit._id.$oid) > -1) {
        this.isStarred = true;
      } else {
        this.isStarred = false;
      }
    }
  }

  public setSEOTags() {
    this.titleService.setTitle(this.deposit.title);
    let publicationDate;
    if (this.deposit.publicationDate != null) {
      publicationDate = formatDate(this.deposit.publicationDate, 'y/M/d', 'en-US');
    }
    this.metaElements = this.metaService.addTags([
      { name: 'citation_title', content: this.deposit.title },
      { name: 'description', content: this.deposit.abstract },
      { name: 'citation_publication_date', content: publicationDate },
      { name: 'citation_keywords', content: this.deposit.keywords?.join(', ') },
      { name: 'citation_abstract_html_url', content: window.location.href },
      { name: 'citation_pdf_url', content: this.deposit.pdfUrl }
    ]);

    if (this.deposit.authors) {
      for (const author of this.deposit.authors) {
        const authorElement = this.metaService.addTag({ name: 'citation_author', content: author });
        this.metaElements.push(authorElement);
      }
    }

    if (this.deposit.doi) {
      const doiElement = this.metaService.addTag({ name: 'citation_doi', content: this.deposit.doi });
      this.metaElements.push(doiElement);
    }

    this.twitterDescription = 'Read now "' + this.deposit.title + '" publication in @orvium';
    const socialTags = this.metaService.addTags([
      { name: 'og:title', content: this.deposit.title },
      { name: 'og:description', content: 'Read now "' + this.deposit.title + '" publication in Orvium' },
      { name: 'og:url', content: window.location.href },
      { name: 'og:site_name', content: 'Orvium' }
    ]);

    this.metaElements = this.metaElements.concat(socialTags);
  }

  createReview() {
    const review = new PeerReview();
    review.author = 'The author';
    review.comments = 'Some comments';
    review.status = REVIEW_STATUS.draft;
    review.reward = 0;

    this.spinnerService.show();
    this.orviumService.createReview(this.deposit._id.$oid, review).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe((response) => {
      this.logger.debug(response);
      this.router.navigate(['deposits', this.deposit._id.$oid, 'reviews', response._id.$oid, 'edit']);
    });
  }

  star() {
    if (!this.profile) {
      this.snackBar.open('You need to log in first to use this feature', null, { panelClass: ['error-snackbar'] });
      return;
    }

    this.orviumService.toggleDepositStar(this.deposit._id.$oid)
      .subscribe(profile => {
        this.refreshDeposit(this.deposit);
      });
  }

  redirection(deposit: Deposit) {
    return '/deposits/' + deposit._id.$oid + '/edit/';
  }

  canOpenOverleaf(filename: string) {
    const regex = /\w+\.tex/g;
    return filename.match(regex);
  }
}
