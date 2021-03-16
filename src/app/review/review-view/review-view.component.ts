import { Component, OnDestroy, OnInit } from '@angular/core';
import { Deposit, OrviumFile, PeerReview, Profile, REVIEW_DECISION_LOV, REVIEW_STATUS, ReviewDecisionLov } from '../../model/orvium';
import { OrviumService } from '../../services/orvium.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { EthereumService } from '../../blockchain/ethereum.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NGXLogger } from 'ngx-logger';
import { NgxSpinnerService } from 'ngx-spinner';
import { canOpenOverleaf } from '../../shared/shared-functions';

@Component({
  selector: 'app-review-view',
  templateUrl: './review-view.component.html',
  styleUrls: ['./review-view.component.scss']
})
export class ReviewViewComponent implements OnInit, OnDestroy {
  private metaElements: HTMLMetaElement[];
  peerReview: PeerReview;
  deposit: Deposit;
  environment = environment;
  filelink: string;
  files: OrviumFile[] = [];
  isOwner: boolean;
  columnsToDisplay = ['icon', 'filename', 'length', 'edit'];
  profile: Profile;
  REVIEW_STATUS = REVIEW_STATUS;
  balanceTokens: string;
  reviewerAddress: string;
  decisionSelected: ReviewDecisionLov | undefined;
  canOpenOverleaf = canOpenOverleaf;

  numberPayReviewerControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  constructor(public orviumService: OrviumService,
              private route: ActivatedRoute,
              private titleService: Title,
              private metaService: Meta,
              private snackBar: MatSnackBar,
              public ethereumService: EthereumService,
              private spinnerService: NgxSpinnerService,
              private logger: NGXLogger,
              public ngxSmartModalService: NgxSmartModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.peerReview = this.route.snapshot.data.review;
    this.deposit = this.peerReview.deposit;
    if (this.peerReview.decision) {
      this.decisionSelected = REVIEW_DECISION_LOV.find(x => x.value === this.peerReview.decision);
    }
    if (this.peerReview.file?.filename) {
      this.files = [];
      this.files.push(this.peerReview.file);
    }
    this.filelink = `${environment.apiEndpoint}/reviews/${this.peerReview._id}/file`;
    this.orviumService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
        if (this.profile.userId === this.peerReview.owner) {
          this.isOwner = true;
        }
      }
    });
    if (this.peerReview.status === REVIEW_STATUS.published) {
      this.setSEOTags();
    }

    if (this.ethereumService.isInitialized) {
      if (this.peerReview.transactions && this.ethereumService.currentNetwork.value) {
        this.reviewerAddress = this.peerReview.transactions[this.ethereumService.currentNetwork.value.name].from;
      }
    }
    this.refreshBalance();
  }

  ngOnDestroy(): void {
    if (this.metaElements) {
      for (const element of this.metaElements) {
        this.metaService.removeTagElement(element);
      }
    }
  }

  public setSEOTags(): void {
    this.titleService.setTitle(this.deposit.title + ' review | Orvium');
    this.metaElements = this.metaService.addTags([
      { name: 'description', content: `${this.deposit.title} review by ${this.peerReview.author}` },
      { name: 'og:title', content: this.deposit.title },
      { name: 'og:description', content: `Read now "${this.deposit.title}" review by ${this.peerReview.author} in Orvium` },
      { name: 'og:url', content: environment.publicUrl + this.router.url },
      { name: 'og:site_name', content: 'Orvium' }
    ]);
  }

  refreshBalance(): void {
    if (this.ethereumService.isInitialized) {
      this.ethereumService.getUserTokenBalance(this.ethereumService.account, this.deposit)
        .subscribe(result => {
          this.balanceTokens = result.toString();
        });
    }
  }

  showPayReviewer(): void {
    if (!this.ethereumService.isReady()) {
      this.snackBar.open('No Ethereum provider detected, check if Metamask is installed in your browser',
        'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }
    console.log(this.balanceTokens);
    if (!this.balanceTokens || this.balanceTokens === '0') {
      this.snackBar.open('Please, deposit first some ORV tokens to make the reward',
        'Dismiss', { panelClass: ['info-snackbar'] });
      return;
    }
    this.ngxSmartModalService.open('displayPayReviewer');
  }

  payReviewer(value: string): void {
    const tokens = Number(value);
    this.ethereumService.payReviewer(value, this.deposit, this.reviewerAddress).subscribe(
      transaction => {
        const spinnerName = 'spinnerPayReviewer';
        this.logger.debug('Transaction', transaction);
        this.spinnerService.show(spinnerName);

        transaction.wait().then(receipt => {
          this.logger.debug('Receipt', receipt);
          this.spinnerService.hide(spinnerName);

          this.orviumService.updatePeerReview(
            this.peerReview._id, {
              reward: (this.peerReview.reward || 0) + tokens
            }).subscribe(result => {
            this.peerReview.reward = result.reward;
            this.refreshBalance();
          });

          this.ngxSmartModalService.close('displayPayReviewer');
        });
      }
    );
  }

}
