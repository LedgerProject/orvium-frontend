import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ACCESS_RIGHT_LOV, CREDIT_LOV, PUBLICATION_TYPE_LOV } from 'src/app/model/orvium';
import { EthereumService } from '../../blockchain/ethereum.service';
import { environment } from '../../../environments/environment';
import { MatChipInputEvent } from '@angular/material/chips';
import { filter, finalize, map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AppCustomValidators } from '../../shared/AppCustomValidators';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { DisciplinesService } from '../../services/disciplines.service';
import { canOpenOverleaf } from '../../shared/shared-functions';
import { HttpResponse } from '@angular/common/http';
import { DepositsService } from '../deposits.service';
import { ProfileService } from '../../profile/profile.service';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import {
  AuthorDTO,
  CommunityDTO,
  DEPOSIT_STATUS,
  DepositDTO,
  DisciplineDTO,
  FileMetadata,
  Reference,
  REVIEW_TYPE,
  UserPrivateDTO
} from 'src/app/model/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OrvSpinnerService } from '@orvium/ux-components';

@Component({
  selector: 'app-deposits-create',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.scss'],
})
export class DepositDetailsComponent implements OnInit {
  @ViewChild('disciplineInput') disciplineInput?: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteDisciplines') matAutocomplete?: MatAutocomplete;

  deposit!: DepositDTO;
  communities: CommunityDTO[] = [];
  publicationTypeLOV = PUBLICATION_TYPE_LOV;
  accessRightLOV = ACCESS_RIGHT_LOV;
  creditTypeLOV = CREDIT_LOV;
  environment = environment;
  canOpenOverleaf = canOpenOverleaf;
  filteredDisciplines?: Observable<DisciplineDTO[]>;
  disciplinesControl = new FormControl();
  canUpdateDeposit = false;
  canManageDeposit = false;
  columnsToDisplay = ['icon', 'filename', 'length', 'actions'];
  balanceTokens = '0';
  allowanceTokens = '0';
  depositForm: FormGroup;
  authorsForm: FormGroup;
  referencesForm: FormGroup;
  readonly = false;
  profile?: UserPrivateDTO;
  files: FileMetadata[] = [];
  extraFilesCount = 0;
  PUBLICATIONS_EXTENSIONS_ALLOWED = '.docx,.doc,.rtf,.pdf,.tex';
  OTHER_FILE_EXTENSIONS_ALLOWED = this.PUBLICATIONS_EXTENSIONS_ALLOWED + ',.txt,.csv,.md,jpeg,.jpg,.png';

  numberApproveTokensControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  numberDepositTokensControl = new FormControl('', [
    Validators.required, Validators.min(1), Validators.max(100)
  ]);

  DEPOSIT_STATUS = DEPOSIT_STATUS;
  REVIEW_TYPE = REVIEW_TYPE;
  private disciplines: DisciplineDTO[] = [];

  constructor(private orviumService: OrviumService,
              private profileService: ProfileService,
              public blockchainService: BlockchainService,
              private route: ActivatedRoute,
              private router: Router,
              public ethereumService: EthereumService,
              private snackBar: AppSnackBarService,
              private spinnerService: OrvSpinnerService,
              private logger: NGXLogger,
              private formBuilder: FormBuilder,
              private disciplinesService: DisciplinesService,
              public ngxSmartModalService: NgxSmartModalService,
              private depositService: DepositsService,
  ) {

    this.depositForm = this.formBuilder.group({
      title: [null, [Validators.required, AppCustomValidators.validateIsNotBlank]],
      abstract: [],
      authors: [[]],
      references: [[]],
      publicationType: [],
      accessRight: [],
      community: [],
      keywords: [[]],
      doi: [null, AppCustomValidators.validateDOI],
      reviewType: [],
      disciplines: [[]],
      canBeReviewed: [true],
      gitRepository: [null, AppCustomValidators.gitHubURL],
    });

    this.authorsForm = this.formBuilder.group({
      name: [null, [AppCustomValidators.validateIsNotBlank]],
      surname: [null, [AppCustomValidators.validateIsNotBlank]],
      email: [null, AppCustomValidators.validateEmail],
      orcid: [null, AppCustomValidators.validateOrcid],
      credit: [[]],
    });

    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.referencesForm = this.formBuilder.group({
      reference: [],
      url: ['', Validators.pattern(urlRegex)],
    });
  }

  ngOnInit(): void {
    this.deposit = this.route.snapshot.data.deposit;
    const profile = this.profileService.profile.getValue();
    this.disciplinesService.getDisciplines().subscribe(
      disciplines => this.disciplines = disciplines
    );

    if (!profile) {
      throw new Error('Profile is undefined');
    }

    this.communities = profile.communities;

    this.filteredDisciplines = this.disciplinesControl.valueChanges.pipe(
      startWith(null),
      map((discipline: string | null) => this.filterDisciplines(discipline)));


    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.deposit = this.route.snapshot.data.deposit;
      this.refreshDeposit(this.deposit);
    });

    this.refreshDeposit(this.deposit);

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
    if (this.matAutocomplete && !this.matAutocomplete.isOpen) {
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

  selected($event: MatAutocompleteSelectedEvent): void {
    const disciplines = this.depositForm.get('disciplines')?.value;
    disciplines.push($event.option.viewValue);
    if (this.disciplineInput) {
      this.disciplineInput.nativeElement.value = '';
    }
    this.disciplinesControl.setValue(null);
    this.depositForm.markAsDirty();
    this.depositForm.get('disciplines')?.updateValueAndValidity();
  }

  refreshDeposit(deposit: DepositDTO): void {
    this.deposit = deposit;
    this.files = deposit.publicationFile ? [deposit.publicationFile].concat(deposit.files || []) : deposit.files || [];
    this.depositForm.reset({ ...this.deposit, ...{ community: deposit.community?._id } });
    this.extraFilesCount = deposit.files.length;

    this.canUpdateDeposit = this.depositService.canUpdateDeposit(this.deposit);
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

    if (this.ethereumService.isInitialized && this.ethereumService.account) {
      this.ethereumService.getUserTokenBalance(this.ethereumService.account, this.deposit)
        .subscribe(result => {
          this.balanceTokens = result.toString();
        });
      this.ethereumService.getUserTokenAllowance(this.ethereumService.account)
        .subscribe(result => this.allowanceTokens = result.toString());
    }
  }

  async proofOwnership(): Promise<void> {
    if (!this.ethereumService.isReady()) {
      this.snackBar.error('No Ethereum provider detected, check if blockchain is activated');
      return;
    }

    if (!this.deposit.publicationFile) {
      this.snackBar.error('Upload a file first to publish to blockchain');
      return;
    }

    // Calculate hash
    const fileUrl = `${environment.apiEndpoint}/deposits/${this.deposit._id}/files/${this.deposit.publicationFile.filename}`;
    let responseFile = await fetch(fileUrl);
    let arrayBuffer = await responseFile.arrayBuffer();
    const fileHash = this.ethereumService.hashFile(arrayBuffer);

    if (!fileHash) {
      this.snackBar.error('Incorrect publication hash');
      return;
    }

    this.ethereumService.publicationProofOwnership(fileHash).subscribe(transaction => {
      const spinnerName = 'spinnerProof';
      this.logger.debug('Transaction', transaction);
      this.spinnerService.show(spinnerName);
      if (!this.deposit.transactions) {
        this.deposit.transactions = {};
      }

      if (this.ethereumService.currentNetwork.value) {
        const blockchainNetwork = this.ethereumService.currentNetwork.value.name;
        const update: Partial<DepositDTO> = {};
        update.transactions = {};
        update.transactions[blockchainNetwork] = transaction;
        update.keccak256 = fileHash;
        this.orviumService.updateDeposit(this.deposit._id, update)
          .subscribe(response => {
            this.refreshDeposit(response);
            this.depositForm.markAsPristine();
            this.snackBar.info('Publication saved');
            this.logger.debug('Deposit saved');
          });
      }


      transaction.wait().then(receipt => {
        this.logger.debug('Receipt', receipt);
        const update: Partial<DepositDTO> = {};
        update.transactions = {};

        this.spinnerService.hide(spinnerName);
        if (!this.deposit.transactions) {
          update.transactions = {};
        }
        if (this.ethereumService.currentNetwork.value) {
          const blockchainNetwork = this.ethereumService.currentNetwork.value.name;
          update.transactions[blockchainNetwork] = receipt;
        }
        this.orviumService.updateDeposit(this.deposit._id, update)
          .subscribe(response => {
            this.refreshDeposit(response);
            this.depositForm.markAsPristine();
            this.snackBar.info('Publication saved');
            this.logger.debug('Deposit saved');
          });
      });
    });
  }

  showDepositTokens(): void {
    if (!this.ethereumService.isReady()) {
      this.snackBar.error('No Ethereum provider detected, check if blockchain is activated');
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
      this.snackBar.error('No Ethereum provider detected, check if blockchain is activated');
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
      this.snackBar.info('Publication saved');
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
        this.snackBar.info('Deposit pending approval');
        this.router.navigateByUrl('deposits/submitted', { state: { deposit: this.deposit } });
      });
    }
    this.ngxSmartModalService.close('acknowledgementModal');

  }

  canBeSentToReview(): boolean {
    if (!this.deposit.publicationFile) {
      this.snackBar.error('Upload your publication files');
      return false;
    }
    if (!this.depositForm.pristine) {
      this.snackBar.error('Save all your changes first');
      return false;
    }
    if (!this.deposit.authors || this.deposit.authors.length === 0) {
      this.snackBar.error('Please add publication authors');
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
      this.snackBar.error('Please complete all required information');
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
      this.snackBar.info('Deposit deleted');
      this.router.navigate(['/publications'], { queryParams: { query: '', page: 1, size: 10, drafts: 'yes' } });
      this.ngxSmartModalService.close('deleteModal');
    });
  }

  deleteFilesModal(fileId: string): boolean {
    if (!this.depositForm.pristine) {
      this.snackBar.error('Save all your changes first');
      return false;
    }
    this.ngxSmartModalService.setModalData(fileId, 'deleteFileModal', true);
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
      this.snackBar.info('File deleted');
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
      const newAuthor = new AuthorDTO();
      newAuthor.name = this.authorsForm.get('name')?.value;
      newAuthor.surname = this.authorsForm.get('surname')?.value;
      newAuthor.email = this.authorsForm.get('email')?.value;
      newAuthor.orcid = this.authorsForm.get('orcid')?.value;
      newAuthor.credit = this.authorsForm.get('credit')?.value;
      this.depositForm.get('authors')?.value.push(newAuthor);
      this.depositForm.markAsDirty();
      this.authorsForm.reset();
    } else {
      this.snackBar.error('Invalid author. First name, last name and email are required');
    }
  }

  removeAuthor(author: AuthorDTO): void {
    const index = this.deposit.authors.indexOf(author);
    if (index >= 0) {
      this.deposit.authors.splice(index, 1);
      this.depositForm.markAsDirty();
    }
  }

  async filesUploaded($event: { originalEvent: HttpResponse<unknown>, files: File[] }): Promise<void> {
    const updatedDeposit = await this.orviumService.getDeposit(this.deposit._id).toPromise();
    this.refreshDeposit(updatedDeposit);
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
      this.snackBar.error('Invalid reference');
    }
  }

  removeReference(reference: Reference): void {
    if (!this.deposit.references) {
      this.snackBar.error('No references found');
      return;
    }
    const index = this.deposit.references.indexOf(reference);
    if (index >= 0) {
      this.deposit.references.splice(index, 1);
      this.depositForm.markAsDirty();
    }
  }

  beforeUpload($event: unknown): boolean {
    if (!this.depositForm.pristine) {
      if (this.depositForm.valid) {
        this.save();
      } else {
        this.snackBar.error('Some data is invalid, please review');
        return false;
      }
    }
    return true;
  }

  drop(event: CdkDragDrop<AuthorDTO[]>): void {
    moveItemInArray(this.deposit.authors, event.previousIndex, event.currentIndex);
    this.depositForm.markAsDirty();
  }

  private filterDisciplines(value: string | null): DisciplineDTO[] {
    if (value) {
      const filterValue = value.toLowerCase();

      return this.disciplines.filter(discipline =>
        discipline.name.toLowerCase().includes(filterValue) &&
        !this.depositForm.controls.disciplines?.value?.includes(discipline.name))
        .slice(0, 50);
    } else {
      return this.disciplines.filter(discipline =>
        !this.depositForm.controls.disciplines?.value?.includes(discipline.name))
        .slice(0, 50);
    }
  }
}
