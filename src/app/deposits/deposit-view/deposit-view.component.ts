import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Citation, Deposit, DEPOSIT_STATUS, DEPOSIT_STATUS_LOV, OrviumFile, Profile, REVIEW_STATUS } from 'src/app/model/orvium';
import { EthereumService } from '../../blockchain/ethereum.service';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { formatDate, TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { ShareService } from 'ngx-sharebuttons';
import { MatStepper } from '@angular/material/stepper';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { DepositsService } from '../deposits.service';
import { ReviewService } from '../../review/review.service';

@Component({
  selector: 'app-deposit-view',
  templateUrl: './deposit-view.component.html',
  styleUrls: ['./deposit-view.component.scss']
})
export class DepositViewComponent implements OnInit, OnDestroy {

  @ViewChild('stepper') stepper: MatStepper;

  deposit: Deposit;
  files: OrviumFile[];
  environment = environment;
  twitterDescription: string;

  canManageDeposit = false;
  canModerateDeposit = false;
  canInviteReviewers = false;
  canCreateReview = false;
  canCreateVersion = false;

  balanceTokens: string;
  allowanceTokens: string;
  isStarred = false;
  profile: Profile;
  private metaElements: HTMLMetaElement[];

  private subscription: Subscription;

  DEPOSIT_STATUS = DEPOSIT_STATUS;
  REVIEW_STATUS = REVIEW_STATUS;
  depositVersions: Deposit[];
  citation: Citation;
  DEPOSIT_STATUS_LOV = DEPOSIT_STATUS_LOV;

  constructor(private orviumService: OrviumService,
              public blockchainService: BlockchainService,
              private route: ActivatedRoute,
              private router: Router,
              public ethereumService: EthereumService,
              private snackBar: MatSnackBar,
              private spinnerService: NgxSpinnerService,
              private titleService: Title,
              private metaService: Meta,
              private logger: NGXLogger,
              public share: ShareService,
              public ngxSmartModalService: NgxSmartModalService,
              private titleCasePipe: TitleCasePipe,
              private depositService: DepositsService,
              private reviewService: ReviewService
  ) {
  }

  ngOnInit(): void {

    this.route.data.pipe().subscribe(async data => {
      this.refreshDeposit(data.deposit);
    });

    const profile = this.orviumService.profile.getValue();
    if (profile) {
      this.profile = profile;
      this.refreshDeposit(this.deposit);
      this.titleService.setTitle(this.deposit.title + ' | Orvium');
    }
  }

  updateStepper(): void {
    setTimeout(() => {
      this.stepper.reset();
      const stepperIndexMap = new Map<DEPOSIT_STATUS, number>([
        [DEPOSIT_STATUS.draft, 0],
        [DEPOSIT_STATUS.pendingApproval, 1],
        [DEPOSIT_STATUS.inReview, 2],
        [DEPOSIT_STATUS.preprint, 2],
        [DEPOSIT_STATUS.published, 3],
      ]);
      const stepperIndex = stepperIndexMap.get(this.deposit.status) || 0;
      for (let index = 0; index <= stepperIndex; index++) {
        this.stepper.selectedIndex = index;
      }
    });
  }

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

  createReview(): void {
    for (const x of this.deposit.peerReviews || []) {
      if (x.owner === this.profile.userId) {
        this.snackBar.open('You already created a review for this publication',
          'Dismiss', { panelClass: ['info-snackbar'] });
        return;
      }
    }

    this.spinnerService.show();
    this.orviumService.createReview({
      revealReviewerIdentity: true,
      // @ts-ignore
      deposit: this.deposit._id
    }).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe((response) => {
      this.logger.debug(response);
      this.router.navigate(['reviews', response._id, 'edit']);
    });
  }

  refreshDeposit(deposit: Deposit): void {
    console.log('Refreshing deposit');
    this.deposit = deposit;
    this.canManageDeposit = this.depositService.canManageDeposit(this.profile, this.deposit);
    this.canModerateDeposit = this.depositService.canModerateDeposit(this.profile, this.deposit);
    this.canInviteReviewers = this.depositService.canInviteReviewers(this.profile, this.deposit);
    this.canCreateReview = this.reviewService.canCreateReview(this.profile, this.deposit);
    this.canCreateVersion = this.depositService.canCreateVersion(this.profile, this.deposit);
    this.updateStepper();

    // Refresh versions
    this.orviumService.getDepositVersions(this.deposit._id).subscribe((deposits) => {
      this.depositVersions = deposits;
    });

    this.files = deposit.publicationFile ? [deposit.publicationFile].concat(deposit.files || []) : deposit.files || [];
    if (this.deposit.status === DEPOSIT_STATUS.published) {
      this.setSEOTags();
    }
    if (this.ethereumService.isInitialized) {
      this.ethereumService.getTokenBalance(deposit).then(result => this.balanceTokens = result);
      this.ethereumService.getTokenAllowance().then(result => this.allowanceTokens = result.toString());
    }

    // Set star
    if (this.profile) {
      this.isStarred = (this.getStarIndex(this.profile) > -1);
    }
  }

  public setSEOTags(): void {
    // Generate publication date and pdf url meta tag content
    let citationPublicationDate;
    if (this.deposit.publicationDate) {
      citationPublicationDate = formatDate(this.deposit.publicationDate, 'y/M/d', 'en-US');
    }

    this.metaElements = this.metaService.addTags([
      { name: 'citation_title', content: this.deposit.title },
      { name: 'description', content: this.deposit.abstract },
      { name: 'citation_publication_date', content: citationPublicationDate || '' },
      { name: 'citation_keywords', content: this.deposit.keywords.join(', ') || '' },
      { name: 'citation_abstract_html_url', content: environment.publicUrl + this.router.url },
    ]);

    if (this.deposit.pdfUrl) {
      const citationPdfUrl = `${environment.apiEndpoint}/deposits/${this.deposit._id}/files/${this.deposit.pdfUrl}`;
      const pdfElement = this.metaService.addTag({ name: 'citation_pdf_url', content: citationPdfUrl });
      if (pdfElement) {
        this.metaElements.push(pdfElement);
      }
    } else if (this.deposit.publicationFile) {
      const citationPdfUrl = `${environment.apiEndpoint}/deposits/${this.deposit._id}/files/${this.deposit.publicationFile.filename}`;
      const pdfElement = this.metaService.addTag({ name: 'citation_pdf_url', content: citationPdfUrl });
      if (pdfElement) {
        this.metaElements.push(pdfElement);
      }
    }

    if (this.deposit.authors) {
      for (const author of this.deposit.authors) {
        const authorElement = this.metaService.addTag({ name: 'citation_author', content: `${author.name} ${author.surname}` });
        if (authorElement) {
          this.metaElements.push(authorElement);
        }
      }
    }

    if (this.deposit.doi) {
      const doiElement = this.metaService.addTag({ name: 'citation_doi', content: this.deposit.doi });
      if (doiElement) {
        this.metaElements.push(doiElement);
      }
    }

    this.twitterDescription = 'Read now "' + this.deposit.title + '" publication in @orvium';
    const socialTags = this.metaService.addTags([
      { name: 'og:title', content: this.deposit.title },
      { name: 'og:description', content: 'Read now "' + this.deposit.title + '" publication in Orvium' },
      { name: 'og:url', content: environment.publicUrl + this.router.url },
      { name: 'og:site_name', content: 'Orvium' }
    ]);

    this.metaElements = this.metaElements.concat(socialTags);
  }

  star(): void {
    if (!this.profile) {
      this.snackBar.open('You need to log in first to use this feature', 'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }

    const index = this.getStarIndex(this.profile);
    if (index !== -1) {
      this.profile.starredDeposits?.splice(index, 1);
    } else {
      this.profile.starredDeposits?.push(this.deposit._id);
    }
    this.orviumService.updateProfile({ starredDeposits: this.profile.starredDeposits })
      .subscribe(profile => {
        this.refreshDeposit(this.deposit);
      });
  }

  getStarIndex(profile: Profile): number {
    if (profile.starredDeposits && profile.starredDeposits.indexOf(this.deposit._id) > -1) {
      return profile.starredDeposits.indexOf(this.deposit._id);
    }
    return -1;
  }

  getCitations(): void {
    this.orviumService.getCitation(this.deposit._id).subscribe((response) => {
      this.citation = response;
    });

    this.ngxSmartModalService.getModal('citationModal').open();
  }

  setStatus(status: DEPOSIT_STATUS): void {
    this.orviumService.updateDeposit(this.deposit._id, {
      status
    }).subscribe(response => {
      this.refreshDeposit(response);
      this.snackBar.open('Status changed to ' + status, 'Dismiss',
        { panelClass: ['ok-snackbar'] });
    });
  }

  createRevision(): void {
    this.orviumService.createDepositRevision(this.deposit._id).subscribe(response => {
      this.snackBar.open('New version created', 'Dismiss', { panelClass: ['ok-snackbar'] });
      this.router.navigate(['deposits', response._id, 'edit']);
    });
  }
}
