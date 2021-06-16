import { Component, OnInit } from '@angular/core';
import { REVIEW_DECISION_LOV } from 'src/app/model/orvium';
import { ActivatedRoute, Router } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { environment } from '../../../environments/environment';
import { EthereumService } from '../../blockchain/ethereum.service';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { canOpenOverleaf } from '../../shared/shared-functions';
import { HttpResponse } from '@angular/common/http';
import { ProfileService } from '../../profile/profile.service';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { DepositDTO, FileMetadata, REVIEW_STATUS, REVIEW_TYPE, ReviewDTO, UserPrivateDTO } from 'src/app/model/api';
import { OrvSpinnerService } from '@orvium/ux-components';

@Component({
  selector: 'app-reviews-create',
  templateUrl: './reviews-create.component.html',
  styleUrls: ['./reviews-create.component.scss']
})
export class ReviewsCreateComponent implements OnInit {

  peerReview: ReviewDTO;
  deposit: DepositDTO;
  profile?: UserPrivateDTO;
  files: FileMetadata[] = [];
  filelink = '';
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
    private profileService: ProfileService,
    public blockchainService: BlockchainService,
    private route: ActivatedRoute,
    private spinnerService: OrvSpinnerService,
    private snackBar: AppSnackBarService,
    public ethereumService: EthereumService,
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private logger: NGXLogger
  ) {
    this.reviewForm = this.formBuilder.group({
      author: [null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      comments: [],
      decision: [],
      revealReviewerIdentity: [],
    });

    this.peerReview = this.route.snapshot.data.review;
    this.deposit = this.peerReview.deposit;
  }

  ngOnInit(): void {
    const profile = this.profileService.profile.getValue();

    if (!profile) {
      throw new Error('Profile is undefined');
    }
    this.profile = profile;

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
        this.snackBar.info('Peer Review saved');
      });
  }

  canPublish(): boolean {
    if (!this.peerReview.file) {
      this.snackBar.error('Review report file is missing');
      return false;
    }
    if (!this.reviewForm.pristine) {
      this.snackBar.error('Save all your changes first');
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
        this.snackBar.info('Peer Review Published');
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
        this.snackBar.info('Review deleted');
        return this.router.navigate(['/deposits/' + this.deposit._id + '/view']);
      });
  }

  async proofOwnership(): Promise<void> {
    if (!this.peerReview.file) {
      this.snackBar.error('Upload a file first');
      return;
    }

    // Calculate hash
    const fileUrl = `${environment.apiEndpoint}/reviews/${this.peerReview._id}/file`;
    let responseFile = await fetch(fileUrl);
    let arrayBuffer = await responseFile.arrayBuffer();
    const fileHash = this.ethereumService.hashFile(arrayBuffer);

    if (!fileHash) {
      this.snackBar.error('Incorrect peer review hash');
      return;
    }

    this.ethereumService.publicationProofOwnership(fileHash).subscribe(transaction => {
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
          this.peerReview.keccak256 = fileHash;
        }
        this.save();
      });
    });
  }

  async filesUploaded($event: { originalEvent: HttpResponse<unknown>, files: File[] }): Promise<void> {
    const updatedPeerReview = await this.orviumService.getPeerReview(this.peerReview._id).toPromise();
    this.refreshPeerReview(updatedPeerReview);
  }

  beforeUpload($event: unknown): boolean {
    if (!this.reviewForm.pristine) {
      if (this.reviewForm.valid) {
        this.save();
      } else {
        this.snackBar.error('Some data is invalid, please review');
        return false;
      }
    }
    return true;
  }

  private refreshPeerReview(peerReview: ReviewDTO): void {
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
}
