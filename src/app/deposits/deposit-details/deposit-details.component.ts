import { AfterViewInit, Component, ElementRef, IterableDiffer, IterableDiffers, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  ACCESS_RIGHT_LOV,
  Deposit,
  DEPOSIT_STATUS,
  PeerReview,
  Profile,
  PUBLICATION_TYPE_LOV,
  REVIEW_TYPE_LOV
} from 'src/app/model/orvium';
import { EthereumService } from '../../services/ethereum.service';
import { environment } from '../../../environments/environment';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, finalize, map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { MatStepper } from '@angular/material/stepper';
import disciplinesJSON from 'src/assets/disciplines.json';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-deposits-create',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.scss'],
})
export class DepositDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('disciplineInput') disciplineInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete: MatAutocomplete;
  faQuestionCircle = faQuestionCircle;

  deposit: Deposit;
  reviews: PeerReview[];
  publicationTypeLOV = PUBLICATION_TYPE_LOV;
  accessRightLOV = ACCESS_RIGHT_LOV;
  reviewTypeLOV = REVIEW_TYPE_LOV;
  environment = environment;
  disciplines = disciplinesJSON;
  filteredDisciplines: Observable<string[]>;
  disciplinesControl = new FormControl();
  private iterableDiffer: IterableDiffer<string> | null;
  isOwner = false;


  columnsToDisplay = ['filename', 'contentType', 'length', 'actions'];
  reviewColumnsToDisplay = ['author', 'file', 'rewards'];
  balanceTokens: string;
  allowanceTokens: string;

  depositForm: FormGroup;
  readonly = false;
  private profile: Profile;

  private subscription: Subscription;

  numberApproveTokensControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  numberDepositTokensControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  numberPayReviewerControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  selectedReviewer: any;

  DEPOSIT_STATUS = DEPOSIT_STATUS;

  constructor(public orviumService: OrviumService,
              private route: ActivatedRoute,
              private router: Router,
              public ethereumService: EthereumService,
              private snackBar: MatSnackBar,
              private spinnerService: NgxSpinnerService,
              private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private iterable: IterableDiffers,
              public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.iterableDiffer = this.iterable.find([]).create();
  }

  ngOnInit() {
    this.depositForm = this.formBuilder.group({
      title: [null, Validators.required],
      abstract: [],
      authors: [[]],
      publicationType: [],
      accessRight: [],
      publicationDate: [],
      keywords: [[]],
      doi: [null, Validators.pattern(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i)],
      reviewType: [],
      disciplines: [[]],
    });

    this.deposit = this.route.snapshot.data.deposit;
    this.refreshDeposit(this.deposit);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.deposit = this.route.snapshot.data.deposit;
      this.refreshDeposit(this.deposit);
    });

    this.orviumService.getPeerReviews(this.deposit._id.$oid).subscribe(reviews => {
      this.reviews = reviews;
    });

    this.filteredDisciplines = this.disciplinesControl.valueChanges.pipe(
      // tslint:disable-next-line:deprecation
      startWith(null),
      map((discipline: string | null) => this._filter(discipline)));

    this.orviumService.getProfile().subscribe(profile => {
      this.profile = profile;
      if (this.profile && this.profile.userId === this.deposit.owner) {
        this.isOwner = true;
        this.refreshDeposit(this.deposit);
      }
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
    });
  }

  ngOnDestroy(): void {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeDiscipline(discipline: any) {
    const disciplines = this.depositForm.get('disciplines').value;
    const index = disciplines.indexOf(discipline);

    if (index >= 0) {
      disciplines.splice(index, 1);
      this.depositForm.patchValue({ disciplines });
    }
  }

  addDiscipline($event: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = $event.input;
      const value = $event.value;
      const disciplines = this.disciplinesControl.value;

      if ((value || '').trim() && disciplines.push) {
        disciplines.push(value.trim());
        this.depositForm.patchValue({ disciplines });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplines.filter(discipline =>
        discipline.toLowerCase().includes(filterValue) &&
        !this.depositForm.get('disciplines').value.includes(discipline))
        .slice(0, 50);
    } else {
      return this.disciplines.filter(discipline =>
        !this.depositForm.get('disciplines').value.includes(discipline))
        .slice(0, 50);
    }
  }

  selected($event: MatAutocompleteSelectedEvent) {
    const disciplines = this.depositForm.get('disciplines').value;
    disciplines.push($event.option.viewValue);
    this.disciplineInput.nativeElement.value = '';
    this.disciplinesControl.setValue(null);
  }

  refreshDeposit(deposit: Deposit): void {
    this.deposit = deposit;
    this.depositForm.reset(this.deposit);

    if (!this.isOwner || this.deposit.status !== DEPOSIT_STATUS.draft) {
      this.depositForm.disable();
      this.readonly = true;
    } else {
      this.depositForm.enable();
      this.readonly = false;
    }

    if (this.ethereumService.isInitialized) {
      this.ethereumService.getUserTokenBalance(this.ethereumService.account, this.deposit)
        .subscribe(result => {
          this.balanceTokens = result.toString();
        });
      this.ethereumService.getUserTokenAllowance(this.ethereumService.account)
        .subscribe(result => this.allowanceTokens = result.toString());
    }
  }

  proofOwnership() {
    if (!this.deposit.keccak256) {
      this.snackBar.open('Upload a file first to publish to blockchain', null, { panelClass: ['error-snackbar'] });
      return;
    }

    this.ethereumService.publicationProofOwnership(this.deposit.keccak256).subscribe(transaction => {
      const spinnerName = 'spinnerProof';
      this.logger.debug('Transaction', transaction);
      this.spinnerService.show(spinnerName);
      if (!this.deposit.transactions) {
        this.deposit.transactions = {};
      }
      this.deposit.transactions[this.ethereumService.currentNetwork.value.name] = transaction;
      this.save();

      transaction.wait().then(receipt => {
        this.logger.debug('Receipt', receipt);
        this.spinnerService.hide(spinnerName);
        this.deposit.transactions[this.ethereumService.currentNetwork.value.name] = receipt;
        this.save();
      });
    });
  }

  showDepositTokens() {
    if (!this.ethereumService.isReady()) {
      this.snackBar.open('No Ethereum provider detected, check if Metamask is installed in your browser',
        null, { panelClass: ['error-snackbar'] });
      return;
    }
    this.ngxSmartModalService.open('depositORVtokens');
  }

  depositTokens(value) {
    this.ngxSmartModalService.close('depositORVtokens');

    this.ethereumService.depositTokens(value, this.deposit).subscribe(transaction => {
      const spinnerName = 'spinnerDepositTokens';
      this.logger.debug('Transaction', transaction);
      this.spinnerService.show(spinnerName);
      transaction.wait().then(receipt => {
        this.logger.debug('Receipt', receipt);
        this.spinnerService.hide(spinnerName);
        this.refreshDeposit(this.deposit);
      });
    });
  }

  showApproveDepositTokens() {
    if (!this.ethereumService.isReady()) {
      this.snackBar.open('No Ethereum provider detected, check if Metamask is installed in your browser',
        null, { panelClass: ['error-snackbar'] });
      return;
    }
    this.ngxSmartModalService.open('approveORVtokens');
  }

  approveDepositTokens(value) {
    this.ngxSmartModalService.close('approveORVtokens');

    this.ethereumService.approveDepositTokens(value).subscribe(
      transaction => {
        const spinnerName = 'spinnerApproveTokens';
        this.logger.debug('Transaction', transaction);
        this.spinnerService.show(spinnerName);
        transaction.wait().then(receipt => {
          this.logger.debug('Receipt', receipt);
          this.spinnerService.hide(spinnerName);
          this.refreshDeposit(this.deposit);
        });
      });
  }

  showPayReviewer(address: string, reviewId: string) {
    if (!this.ethereumService.isReady()) {
      this.snackBar.open('No Ethereum provider detected, check if Metamask is installed in your browser',
        null, { panelClass: ['error-snackbar'] });
      return;
    }
    this.ngxSmartModalService.open('displayPayReviewer');
    this.selectedReviewer = { address, reviewId };
  }

  payReviewer(value) {
    const tokens = Number(value);
    this.ethereumService.payReviewer(value, this.deposit, this.selectedReviewer.address).subscribe(
      transaction => {
        const spinnerName = 'spinnerPayReviewer';
        this.logger.debug('Transaction', transaction);
        this.spinnerService.show(spinnerName);

        transaction.wait().then(receipt => {
          this.logger.debug('Receipt', receipt);
          this.spinnerService.hide(spinnerName);

          this.refreshDeposit(this.deposit);
          this.ngxSmartModalService.close('displayPayReviewer');
        });
      }
    );
  }

  save() {
    this.logger.debug('Saving deposit');
    this.deposit = Object.assign(this.deposit, this.depositForm.value);
    this.logger.debug(this.deposit);
    this.spinnerService.show();
    this.orviumService.updateDeposit(this.deposit).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.refreshDeposit(response);
      this.depositForm.markAsPristine();
      this.snackBar.open('Publication saved', null, { panelClass: ['ok-snackbar'] });
      this.logger.debug('Deposit saved');
    });
  }

  sendToReview() {
    if (this.canBeSentToReview()) {
      this.deposit.status = DEPOSIT_STATUS.inReview;
      this.depositForm.disable();
      this.readonly = true;
      this.save();
      this.stepper.selectedIndex = 1;
    }
  }

  canBeSentToReview() {
    if (!this.deposit.keccak256) {
      this.snackBar.open('Upload your publication files', null, { panelClass: ['error-snackbar'] });
      return false;
    }
    if (!this.depositForm.pristine) {
      this.snackBar.open('Save all your changes first', null, { panelClass: ['error-snackbar'] });
      return false;
    }

    ['abstract', 'authors', 'keywords', 'publicationType', 'accessRight', 'publicationDate', 'reviewType', 'disciplines']
      .forEach(control => {
        const ctr = this.depositForm.get(control);
        ctr.setValidators(Validators.required);
        ctr.updateValueAndValidity();
        ctr.markAsTouched();
      });

    return this.depositForm.valid ? true : false;
  }

  publish() {
    this.deposit.status = DEPOSIT_STATUS.published;
    this.save();
    this.depositForm.disable();
    this.stepper.selectedIndex = 2;
  }

  delete() {
    this.spinnerService.show();
    this.orviumService.deleteDeposit(this.deposit._id.$oid).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.snackBar.open('Deposit deleted', null, { panelClass: ['ok-snackbar'] });
      this.router.navigate(['/publications'], { queryParams: { query: '', page: 1, size: 10, drafts: 'yes' } });
      this.ngxSmartModalService.close('deleteModal');
    });
  }

  deleteFilesModal(fileId: string) {
    if (!this.depositForm.pristine) {
      this.snackBar.open('Save all your changes first', null, { panelClass: ['error-snackbar'] });
      return false;
    }
    this.ngxSmartModalService.setModalData(fileId, 'deleteFileModal');
    this.ngxSmartModalService.open('deleteFileModal');
  }

  deleteFiles() {
    const fileId = this.ngxSmartModalService.getModalData('deleteFileModal');
    console.log(fileId);
    this.ngxSmartModalService.close('deleteFileModal');
    this.spinnerService.show();
    this.orviumService.deleteDepositFiles(this.deposit._id.$oid, fileId).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.snackBar.open('File deleted', null, { panelClass: ['ok-snackbar'] });
      this.refreshDeposit(response);
      this.ngxSmartModalService.resetModalData('deleteFileModal');
    });
  }

  addKeyword(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    const keywords = this.depositForm.get('keywords').value;


    if ((value || '').trim()) {
      keywords.push(value.trim());
      this.depositForm.patchValue({ keywords });
      this.depositForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

  removeKeyword(keyword: string): void {
    const keywords = this.depositForm.get('keywords').value;
    const index = keywords.indexOf(keyword);

    if (index >= 0) {
      keywords.splice(index, 1);
      this.depositForm.patchValue({ keywords });
      this.depositForm.markAsDirty();
    }
  }

  addAuthor(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    const authors = this.depositForm.get('authors').value;


    if ((value || '').trim()) {
      authors.push(value.trim());
      this.depositForm.patchValue({ authors });
      this.depositForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

  removeAuthor(author: string): void {
    const authors = this.depositForm.get('authors').value;
    const index = authors.indexOf(author);

    if (index >= 0) {
      authors.splice(index, 1);
      this.depositForm.patchValue({ authors });
      this.depositForm.markAsDirty();
    }
  }

  filesUploaded($event: any) {
    const updatedDeposit: Deposit = $event.originalEvent.body;
    this.refreshDeposit(updatedDeposit);
  }

  onSelectFiles($event: any) {
    if (!this.depositForm.pristine) {
      this.snackBar.open('You need to save all your changes before uploading files',
        null, { panelClass: ['error-snackbar'] });
      return false;
    }
  }

  canOpenOverleaf(filename: string) {
    const regex = /\w+\.tex/g;
    return filename.match(regex);
  }
}
