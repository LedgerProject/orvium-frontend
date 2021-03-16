import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  ACCESS_RIGHT_LOV,
  Author, Community,
  CREDIT_LOV,
  Deposit,
  DEPOSIT_STATUS,
  Discipline,
  OrviumFile,
  PeerReview,
  Profile,
  PUBLICATION_TYPE_LOV,
  Reference,
  REVIEW_TYPE
} from 'src/app/model/orvium';
import { EthereumService } from '../../blockchain/ethereum.service';
import { environment } from '../../../environments/environment';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, finalize, map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXLogger } from 'ngx-logger';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CustomValidators } from '../../shared/CustomValidators';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { DisciplinesService } from '../../services/disciplines.service';
import { canOpenOverleaf } from '../../shared/shared-functions';
import { HttpResponse } from '@angular/common/http';
import { DepositsService } from '../deposits.service';

@Component({
  selector: 'app-deposits-create',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.scss'],
})
export class DepositDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('disciplineInput') disciplineInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete: MatAutocomplete;

  deposit: Deposit;
  reviews: PeerReview[];
  communities: Community[];
  publicationTypeLOV = PUBLICATION_TYPE_LOV;
  accessRightLOV = ACCESS_RIGHT_LOV;
  creditTypeLOV = CREDIT_LOV;
  environment = environment;
  canOpenOverleaf = canOpenOverleaf;
  filteredDisciplines: Observable<Discipline[]>;
  disciplinesControl = new FormControl();
  canUpdateDeposit = false;
  canManageDeposit = false;
  referenceUrl: string;
  columnsToDisplay = ['icon', 'filename', 'length', 'actions'];
  balanceTokens: string;
  allowanceTokens: string;
  depositForm: FormGroup;
  authorsForm: FormGroup;
  referencesForm: FormGroup;
  readonly = false;
  profile: Profile;
  files: OrviumFile[];
  PUBLICATIONS_EXTENSIONS_ALLOWED = '.docx,.doc,.rtf,.pdf,.tex';
  OTHER_FILE_EXTENSIONS_ALLOWED = this.PUBLICATIONS_EXTENSIONS_ALLOWED + '.txt,.csv,.md,jpeg,.jpg,.png';
  private subscription: Subscription;

  numberApproveTokensControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  numberDepositTokensControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  selectedReviewer: unknown;

  DEPOSIT_STATUS = DEPOSIT_STATUS;
  REVIEW_TYPE = REVIEW_TYPE;

  constructor(private orviumService: OrviumService,
              public blockchainService: BlockchainService,
              private route: ActivatedRoute,
              private router: Router,
              public ethereumService: EthereumService,
              private snackBar: MatSnackBar,
              private spinnerService: NgxSpinnerService,
              private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private disciplinesService: DisciplinesService,
              public ngxSmartModalService: NgxSmartModalService,
              private depositService: DepositsService
  ) {
  }

  ngOnInit(): void {
    this.deposit = this.route.snapshot.data.deposit;
    this.orviumService.getMyCommunities().subscribe(communities => {
      this.communities = communities;
    });

    this.depositForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      abstract: [],
      authors: [[]],
      references: [[]],
      publicationType: [],
      accessRight: [],
      community: [],
      keywords: [[]],
      doi: [null, Validators.pattern(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i)],
      reviewType: [],
      disciplines: [[]],
    });

    this.filteredDisciplines = this.disciplinesControl.valueChanges.pipe(
      startWith(null),
      map((discipline: string | null) => this.filterDisciplines(discipline)));

    this.authorsForm = this.formBuilder.group({
      name: [null, [Validators.pattern(/.*\S.*/)]],
      surname: [null, [Validators.pattern(/.*\S.*/)]],
      email: [null, CustomValidators.validateEmail],
      orcid: [null, CustomValidators.validateOrcid],
      credit: [[]],
    });

    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.referencesForm = this.formBuilder.group({
      reference: [],
      url: ['', Validators.pattern(urlRegex)],
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.deposit = this.route.snapshot.data.deposit;
      this.refreshDeposit(this.deposit);
    });

    this.orviumService.getPeerReviews(this.deposit._id).subscribe(reviews => {
      this.reviews = reviews;
    });

    const profile = this.orviumService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }

    this.refreshDeposit(this.deposit);

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeDiscipline(discipline: unknown): void {
    const disciplines = this.depositForm.get('disciplines')?.value;
    const index = disciplines.indexOf(discipline);

    if (index >= 0) {
      disciplines.splice(index, 1);
      this.depositForm.patchValue({ disciplines });
      this.depositForm.markAsDirty();
    }
  }

  addDiscipline($event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = $event.input;
      const value = $event.value;
      const disciplines = this.disciplinesControl.value;

      if ((value || '').trim() && disciplines.push) {
        disciplines.push(value.trim());
        this.depositForm.patchValue({ disciplines });
        this.depositForm.markAsDirty();
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  }

  private filterDisciplines(value: string | null): Discipline[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplinesService.getDisciplines().filter(discipline =>
        discipline.name.toLowerCase().includes(filterValue) &&
        !this.depositForm.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    } else {
      return this.disciplinesService.getDisciplines().filter(discipline =>
        !this.depositForm.get('disciplines')?.value.includes(discipline.name))
        .slice(0, 50);
    }
  }

  selected($event: MatAutocompleteSelectedEvent): void {
    const disciplines = this.depositForm.get('disciplines')?.value;
    disciplines.push($event.option.viewValue);
    this.disciplineInput.nativeElement.value = '';
    this.disciplinesControl.setValue(null);
    this.depositForm.markAsDirty();
    this.depositForm.get('disciplines')?.updateValueAndValidity();
  }

  refreshDeposit(deposit: Deposit): void {
    this.deposit = deposit;
    this.files = deposit.publicationFile ? [deposit.publicationFile].concat(deposit.files || []) : deposit.files || [];
    this.depositForm.reset( {...this.deposit, ...{community: deposit.community?._id}});

    this.canUpdateDeposit = this.depositService.canUpdateDeposit(this.profile, this.deposit);
    this.canManageDeposit = this.depositService.canManageDeposit(this.profile, this.deposit);

    if (this.canUpdateDeposit) {
      this.depositForm.enable();
      this.authorsForm.enable();
      this.referencesForm.enable();
      this.readonly = false;
    } else {
      this.depositForm.disable();
      this.authorsForm.disable();
      this.referencesForm.disable();
      this.readonly = true;
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

  proofOwnership(): void {
    if (!this.deposit.keccak256) {
      this.snackBar.open('Upload a file first to publish to blockchain',
        'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }

    this.ethereumService.publicationProofOwnership(this.deposit.keccak256).subscribe(transaction => {
      const spinnerName = 'spinnerProof';
      this.logger.debug('Transaction', transaction);
      this.spinnerService.show(spinnerName);
      if (!this.deposit.transactions) {
        this.deposit.transactions = {};
      }

      if (this.ethereumService.currentNetwork.value) {
        this.deposit.transactions[this.ethereumService.currentNetwork.value.name] = transaction;
      }
      this.save();


      transaction.wait().then(receipt => {
        this.logger.debug('Receipt', receipt);
        this.spinnerService.hide(spinnerName);
        if (!this.deposit.transactions) {
          this.deposit.transactions = {};
        }
        if (this.ethereumService.currentNetwork.value) {
          this.deposit.transactions[this.ethereumService.currentNetwork.value.name] = receipt;
        }
        this.save();
      });
    });
  }

  showDepositTokens(): void {
    if (!this.ethereumService.isReady()) {
      this.snackBar.open('No Ethereum provider detected, check if Metamask is installed in your browser',
        'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }
    this.ngxSmartModalService.open('depositORVtokens');
  }

  depositTokens(value: string): void {
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

  showApproveDepositTokens(): void {
    if (!this.ethereumService.isReady()) {
      this.snackBar.open('No Ethereum provider detected, check if Metamask is installed in your browser',
        'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }
    this.ngxSmartModalService.open('approveORVtokens');
  }

  approveDepositTokens(value: string): void {
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

  save(): void {
    this.logger.debug('Saving deposit');
    this.deposit = Object.assign(this.deposit, this.depositForm.value);
    this.logger.debug(this.deposit);
    this.spinnerService.show();
    this.orviumService.updateDeposit(this.deposit._id, this.depositForm.value).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.refreshDeposit(response);
      this.depositForm.markAsPristine();
      this.snackBar.open('Publication saved', 'Dismiss', { panelClass: ['ok-snackbar'] });
      this.logger.debug('Deposit saved');
    });
  }

  openAcknowledgementModal(): void {
    if (this.canBeSentToReview()) {
      this.ngxSmartModalService.open('acknowledgementModal');
    }
  }

  sendToPendingApproval(): void {
    if (this.canBeSentToReview()) {
      this.orviumService.updateDeposit(this.deposit._id, {
        status: DEPOSIT_STATUS.pendingApproval,
        submissionDate: new Date().toISOString()
      }).subscribe(response => {
        this.refreshDeposit(response);
        this.snackBar.open('Deposit pending approval', 'Dismiss', { panelClass: ['ok-snackbar'] });
      });
    }
    this.ngxSmartModalService.close('acknowledgementModal');
  }

  canBeSentToReview(): boolean {
    if (!this.deposit.publicationFile?.keccak256) {
      this.snackBar.open('Upload your publication files', 'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    if (!this.depositForm.pristine) {
      this.snackBar.open('Save all your changes first', 'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    if (!this.deposit.authors || this.deposit.authors.length === 0) {
      this.snackBar.open('Please add publication authors', 'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    ['abstract', 'authors', 'keywords', 'publicationType', 'accessRight', 'reviewType', 'disciplines']
      .forEach(control => {
        const ctr = this.depositForm.get(control);
        ctr?.setValidators(Validators.required);
        ctr?.updateValueAndValidity();
        ctr?.markAsTouched();
      });
    if (!this.depositForm.valid) {
      this.snackBar.open('Please complete all required information', 'Dismiss', { panelClass: ['error-snackbar'] });
    }
    return this.depositForm.valid;
  }

  delete(): void {
    this.spinnerService.show();
    this.orviumService.deleteDeposit(this.deposit._id).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.snackBar.open('Deposit deleted', 'Dismiss', { panelClass: ['ok-snackbar'] });
      this.router.navigate(['/publications'], { queryParams: { query: '', page: 1, size: 10, drafts: 'yes' } });
      this.ngxSmartModalService.close('deleteModal');
    });
  }

  deleteFilesModal(fileId: string): boolean {
    if (!this.depositForm.pristine) {
      this.snackBar.open('Save all your changes first', 'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    this.ngxSmartModalService.setModalData(fileId, 'deleteFileModal');
    this.ngxSmartModalService.open('deleteFileModal');
    return true;
  }

  deleteFiles(): void {
    const fileId = this.ngxSmartModalService.getModalData('deleteFileModal');
    console.log(fileId);
    this.ngxSmartModalService.close('deleteFileModal');
    this.spinnerService.show();
    this.orviumService.deleteDepositFiles(this.deposit._id, fileId).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.snackBar.open('File deleted', 'Dismiss', { panelClass: ['ok-snackbar'] });
      this.refreshDeposit(response);
      this.ngxSmartModalService.resetModalData('deleteFileModal');
    });
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const keywords = this.depositForm.get('keywords')?.value;


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
    const keywords = this.depositForm.get('keywords')?.value;
    const index = keywords.indexOf(keyword);

    if (index >= 0) {
      keywords.splice(index, 1);
      this.depositForm.patchValue({ keywords });
      this.depositForm.markAsDirty();
    }
  }

  addAuthor(): void {
    if (this.authorsForm.get('name')?.value &&
      this.authorsForm.get('surname')?.value &&
      this.authorsForm.get('email')?.value &&
      this.authorsForm.valid) {
      const newAuthor = new Author();
      newAuthor.name = this.authorsForm.get('name')?.value;
      newAuthor.surname = this.authorsForm.get('surname')?.value;
      newAuthor.email = this.authorsForm.get('email')?.value;
      newAuthor.orcid = this.authorsForm.get('orcid')?.value;
      newAuthor.credit = this.authorsForm.get('credit')?.value;
      this.depositForm.get('authors')?.value.push(newAuthor);
      this.depositForm.markAsDirty();
      this.authorsForm.reset();
    } else {
      this.snackBar.open('Invalid Author. First name, last name and email are required', 'Dismiss', { panelClass: ['error-snackbar'] });
    }
  }

  removeAuthor(author: Author): void {
    const index = this.deposit.authors.indexOf(author);
    if (index >= 0) {
      this.deposit.authors.splice(index, 1);
      this.depositForm.markAsDirty();
    }
  }

  filesUploaded($event: { originalEvent: HttpResponse<unknown>, files: File[] }): void {
    const updatedDeposit = $event.originalEvent.body as Deposit;
    this.refreshDeposit(updatedDeposit);
  }

  onSelectFiles($event: unknown): boolean {
    if (!this.depositForm.pristine) {
      this.snackBar.open('You need to save all your changes before uploading files',
        'Dismiss', { panelClass: ['error-snackbar'] });
      return false;
    }
    return true;
  }

  addReference(): void {
    if (this.referencesForm.get('reference')?.value && this.referencesForm.valid) {
      const newReference = new Reference();
      newReference.reference = this.referencesForm.get('reference')?.value;
      newReference.url = this.referencesForm.get('url')?.value;
      this.depositForm.get('references')?.value.push(newReference);
      this.depositForm.markAsDirty();
      this.referencesForm.reset();
    } else {
      this.snackBar.open('Invalid Reference', 'Dismiss', { panelClass: ['error-snackbar'] });
    }
  }

  removeReference(reference: Reference): void {
    if (!this.deposit.references) {
      this.snackBar.open('No references found', 'Dismiss', { panelClass: ['error-snackbar'] });
      return;
    }
    const index = this.deposit.references.indexOf(reference);
    if (index >= 0) {
      this.deposit.references.splice(index, 1);
      this.depositForm.markAsDirty();
    }
  }

  reviewTypeChange(): void {
    this.deposit.reviewType = this.depositForm.get('reviewType')?.value;
  }
}
