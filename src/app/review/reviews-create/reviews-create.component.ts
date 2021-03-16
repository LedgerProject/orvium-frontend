import { Component, OnInit } from '@angular/core';
import { Deposit, OrviumFile, PeerReview, Profile, REVIEW_DECISION_LOV, REVIEW_STATUS, REVIEW_TYPE, } from 'src/app/model/orvium';
import { ActivatedRoute, Router } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { environment } from '../../../environments/environment';
import { EthereumService } from '../../blockchain/ethereum.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { canOpenOverleaf } from '../../shared/shared-functions';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-reviews-create',
  templateUrl: './reviews-create.component.html',
  styleUrls: ['./reviews-create.component.scss']
})
export class ReviewsCreateComponent implements OnInit {

  peerReview: PeerReview;
  deposit: Deposit;
  profile: Profile;
  files: OrviumFile[] = [];
  filelink: string;
  environment = environment;
  isOwner = false;
  reviewForm: FormGroup;
  columnsToDisplay = ['icon', 'filename', 'length', 'edit'];
  reviewDecisionLov = REVIEW_DECISION_LOV;
  REVIEW_TYPE = REVIEW_TYPE;
  REVIEW_STATUS = REVIEW_STATUS;
  canOpenOverleaf = canOpenOverleaf;

  constructor(
    private orviumService: OrviumService,
    public blockchainService: BlockchainService,
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    public ethereumService: EthereumService,
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.peerReview = this.route.snapshot.data.review;
    this.deposit = this.peerReview.deposit;
    const profile = this.orviumService.profile.getValue();

    if (!profile) {
      throw new Error('Profile is undefined');
    }

    this.profile = profile;

    this.reviewForm = this.formBuilder.group({
      author: [null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      comments: [],
      decision: [],
      revealReviewerIdentity: [],
    });

    this.refreshPeerReview(this.peerReview);

    if (this.profile.userId === this.peerReview.owner) {
      this.isOwner = true;
    }

    if (!this.isOwner ||
      this.peerReview.status === REVIEW_STATUS.published) {
      this.reviewForm.disable();
    }

  }

  save(): void {
    this.peerReview = Object.assign(this.peerReview, this.reviewForm.value);
    this.spinnerService.show();
    this.orviumService.updatePeerReview(this.peerReview._id, this.reviewForm.value).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    )
      .subscribe(response => {
        this.refreshPeerReview(response);
        this.reviewForm.markAsPristine();
        this.snackBar.open('Peer Review saved', 'Dismiss', { panelClass: ['ok-snackbar'] });
      });
  }

  canPublish(): boolean {
    if (!this.peerReview.file) {
      this.snackBar.open('Review report file is missing', 'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    if (!this.reviewForm.pristine) {
      this.snackBar.open('Save all your changes first', 'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    ['author', 'comments', 'decision']
      .forEach(control => {
        const ctr = this.reviewForm.get(control);
        ctr?.setValidators(Validators.required);
        ctr?.updateValueAndValidity();
        ctr?.markAsTouched();
      });
    return this.reviewForm.valid;
  }

  publish(): void {
    if (this.canPublish()) {
      this.orviumService.updatePeerReview(this.peerReview._id, {
        status: REVIEW_STATUS.published
      }).subscribe(response => {
        this.refreshPeerReview(response);
        this.snackBar.open('Peer Review Published', 'Dismiss', { panelClass: ['ok-snackbar'] });
      });
    }
  }

  delete(): void {
    this.spinnerService.show();
    this.orviumService.deleteReview(this.peerReview._id).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    )
      .subscribe(response => {
        this.snackBar.open('Review deleted', 'Dismiss', { panelClass: ['ok-snackbar'] });
        return this.router.navigate(['/deposits/' + this.deposit._id + '/view']);
      });
  }

  proofOwnership(): void {
    if (!this.peerReview.file?.keccak256) {
      this.snackBar.open('Upload a file first to publish to blockchain', 'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }

    this.ethereumService.publicationProofOwnership(this.peerReview.file.keccak256).subscribe(transaction => {
      const spinnerName = 'spinnerProof';
      this.logger.debug('Transaction', transaction);
      this.spinnerService.show(spinnerName);

      if (!this.peerReview.transactions) {
        this.peerReview.transactions = {};
      }

      if (this.ethereumService.currentNetwork.value) {
        this.peerReview.transactions[this.ethereumService.currentNetwork.value.name] = transaction;
      }
      this.reviewForm.disable();
      this.spinnerService.hide();
      this.save();

      transaction.wait().then(receipt => {
        this.logger.debug('Receipt', receipt);
        this.spinnerService.hide(spinnerName);
        if (!this.peerReview.transactions) {
          this.peerReview.transactions = {};
        }
        if (this.ethereumService.currentNetwork.value) {
          this.peerReview.transactions[this.ethereumService.currentNetwork.value.name] = receipt;
        }
        this.save();
      });
    });
  }

  private refreshPeerReview(peerReview: PeerReview): void {
    this.titleService.setTitle(`Peer Review by ${peerReview.author}`);
    this.peerReview = peerReview;
    this.reviewForm.reset(this.peerReview);
    if (peerReview.file?.filename) {
      this.files = [];
      this.files.push(peerReview.file);
    }

    this.filelink = `${environment.apiEndpoint}/reviews/${peerReview._id}/file`;

    if (this.peerReview.status === REVIEW_STATUS.published) {
      this.reviewForm?.disable();
    }
  }

  filesUploaded($event: { originalEvent: HttpResponse<unknown>, files: File[] }): void {
    const updatedPeerReview = $event.originalEvent.body as PeerReview;
    this.refreshPeerReview(updatedPeerReview);
  }

  onSelectFiles($event: unknown): boolean {
    if (!this.reviewForm.pristine) {
      this.snackBar.open('You need to save all your changes before uploading files',
        'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    return true;
  }
}
