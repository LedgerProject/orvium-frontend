import { Component, OnInit } from '@angular/core';
import { Deposit, OrviumFile, PeerReview, Profile, REVIEW_STATUS, REVIEW_TYPE } from 'src/app/model/orvium';
import { ActivatedRoute, Router } from '@angular/router';
import { OrviumService } from '../../services/orvium.service';
import { environment } from '../../../environments/environment';
import { EthereumService } from '../../services/ethereum.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';

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
  filelink;
  environment = environment;

  isOwner = false;

  reviewForm: FormGroup;

  columnsToDisplay = ['filename', 'contentType', 'length', 'edit'];

  REVIEW_TYPE = REVIEW_TYPE;
  REVIEW_STATUS = REVIEW_STATUS;

  constructor(
    public orviumService: OrviumService,
    private route: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private snackBar: MatSnackBar,
    public ethereumService: EthereumService,
    private router: Router,
    private titleService: Title,
    private logger: NGXLogger) {
  }

  ngOnInit() {
    this.peerReview = this.route.snapshot.data.review;
    this.deposit = this.route.snapshot.data.deposit;
    this.profile = this.route.snapshot.data.profile;

    this.refreshPeerReview(this.peerReview);

    if (this.profile.userId === this.peerReview.owner) {
      this.isOwner = true;
    }

    this.reviewForm = new FormGroup({
      author: new FormControl(this.peerReview.author, Validators.required),
      comments: new FormControl(this.peerReview.comments, Validators.required),
      revealReviewerIdentity: new FormControl(this.peerReview.revealReviewerIdentity, Validators.required)
    });

    if (!this.isOwner ||
      this.peerReview.status === REVIEW_STATUS.published) {
      this.reviewForm.disable();
    }

  }

  save() {
    this.peerReview = Object.assign(this.peerReview, this.reviewForm.value);
    this.spinnerService.show();
    this.orviumService.updatePeerReview(this.deposit._id.$oid, this.peerReview).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    )
      .subscribe(response => {
        this.refreshPeerReview(response);
        this.reviewForm.markAsPristine();
        this.snackBar.open('Peer Review saved', null, { panelClass: ['ok-snackbar'] });
      });
  }

  publish() {
    this.peerReview.status = REVIEW_STATUS.published;
    this.reviewForm.disable();
    this.save();
  }

  delete() {
    this.spinnerService.show();
    this.orviumService.deleteReview(this.deposit._id.$oid, this.peerReview._id.$oid).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    )
      .subscribe(response => {
        this.snackBar.open('Review deleted', null, { panelClass: ['ok-snackbar'] });
        return this.router.navigate(['/deposits/' + this.deposit._id.$oid + '/view']);
      });
  }

  proofOwnership() {
    if (!this.peerReview.file.keccak256) {
      this.snackBar.open('Upload a file first to publish to blockchain', null, { panelClass: ['error-snackbar'] });
      return;
    }

    this.ethereumService.publicationProofOwnership(this.peerReview.file.keccak256).subscribe(transaction => {
      const spinnerName = 'spinnerProof';
      this.logger.debug('Transaction', transaction);
      this.spinnerService.show(spinnerName);

      if (!this.peerReview.transactions) {
        this.peerReview.transactions = {};
      }
      this.peerReview.transactions[this.ethereumService.currentNetwork.value.name] = transaction;
      this.reviewForm.disable();
      this.spinnerService.hide();
      this.save();

      transaction.wait().then(receipt => {
        this.logger.debug('Receipt', receipt);
        this.spinnerService.hide(spinnerName);
        this.peerReview.transactions[this.ethereumService.currentNetwork.value.name] = receipt;
        this.save();
      });
    });
  }

  private refreshPeerReview(peerReview: PeerReview): void {
    this.titleService.setTitle(`Peer Review by ${peerReview.author}`);
    this.peerReview = peerReview;
    if (peerReview.file?.filename) {
      this.files = [];
      this.files.push(peerReview.file);
    }

    this.filelink = `${environment.backend}/deposits/${this.deposit._id.$oid}/reviews/${peerReview._id.$oid}/files`;
  }

  filesUploaded($event: any) {
    const updatedPeerReview: PeerReview = $event.originalEvent.body;
    this.refreshPeerReview(updatedPeerReview);
  }

  canOpenOverleaf(filename: string) {
    const regex = /\w+\.tex/g;
    return filename.match(regex);
  }
}
