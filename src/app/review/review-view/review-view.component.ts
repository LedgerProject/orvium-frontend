import { Component, OnDestroy, OnInit } from '@angular/core';
import { REVIEW_DECISION_LOV, ReviewDecisionLov } from '../../model/orvium';
import { OrviumService } from '../../services/orvium.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { EthereumService } from '../../blockchain/ethereum.service';
import { FormControl, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NGXLogger } from 'ngx-logger';
import { canOpenOverleaf } from '../../shared/shared-functions';
import { ProfileService } from '../../profile/profile.service';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { DepositDTO, FileMetadata, REVIEW_STATUS, ReviewDTO, UserPrivateDTO } from 'src/app/model/api';
import { OrvSpinnerService } from '@orvium/ux-components';

@Component({
  selector: 'app-review-view',
  templateUrl: './review-view.component.html',
  styleUrls: ['./review-view.component.scss']
})
export class ReviewViewComponent implements OnInit, OnDestroy {
  peerReview: ReviewDTO;
  deposit: DepositDTO;
  environment = environment;
  files: FileMetadata[] = [];
  isOwner = false;
  columnsToDisplay = ['icon', 'filename', 'length', 'edit'];
  profile?: UserPrivateDTO;
  REVIEW_STATUS = REVIEW_STATUS;
  balanceTokens = '0';
  reviewerAddress = '0';
  decisionSelected: ReviewDecisionLov | undefined;
  canOpenOverleaf = canOpenOverleaf;
  numberPayReviewerControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);
  private metaElements: HTMLMetaElement[] = [];

  constructor(public orviumService: OrviumService,
              private route: ActivatedRoute,
              private titleService: Title,
              private metaService: Meta,
              private snackBar: AppSnackBarService,
              public ethereumService: EthereumService,
              private profileService: ProfileService,
              private spinnerService: OrvSpinnerService,
              private logger: NGXLogger,
              public ngxSmartModalService: NgxSmartModalService,
              private router: Router) {
    this.peerReview = this.route.snapshot.data.review;
    this.deposit = this.peerReview.deposit;
  }

  ngOnInit(): void {
    if (this.peerReview.decision) {
      this.decisionSelected = REVIEW_DECISION_LOV.find(x => x.value === this.peerReview.decision);
    }
    if (this.peerReview.file?.filename) {
      this.files = [];
      this.files.push(this.peerReview.file);
    }
    this.profileService.getProfile().subscribe(profile => {
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
        const transaction = this.peerReview.transactions[this.ethereumService.currentNetwork.value.name];
        // @ts-ignore
        if (transaction && transaction.from) {
          // @ts-ignore
          this.reviewerAddress = transaction.from;
        }
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
    if (this.ethereumService.isInitialized && this.ethereumService.account) {
      this.ethereumService.getUserTokenBalance(this.ethereumService.account, this.deposit)
        .subscribe(result => {
          this.balanceTokens = result.toString();
        });
    }
  }

  showPayReviewer(): void {
    if (!this.ethereumService.isReady()) {
      this.snackBar.error('No Ethereum provider detected, check if Metamask is installed in your browser');
      return;
    }
    console.log(this.balanceTokens);
    if (!this.balanceTokens || this.balanceTokens === '0') {
      this.snackBar.info('Please, deposit first some ORV tokens to make the reward');
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
