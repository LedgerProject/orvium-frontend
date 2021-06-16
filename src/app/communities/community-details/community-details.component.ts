import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { COMMUNITY_TYPE_LOV } from '../../model/orvium';
import { ProfileService } from '../../profile/profile.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, finalize } from 'rxjs/operators';
import { OrviumService } from '../../services/orvium.service';
import { NGXLogger } from 'ngx-logger';
import { CommunityService } from '../community.service';
import { AppCustomValidators } from '../../shared/AppCustomValidators';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { CallForPapers, CommunityPrivateDTO, DisciplineDTO, UserPrivateDTO } from '../../model/api';
import { OrvSpinnerService } from '@orvium/ux-components';


@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.component.html',
  styleUrls: ['./community-details.component.scss']
})
export class CommunityDetailsComponent implements OnInit {

  @ViewChild('disciplineInput') disciplineInput?: ElementRef<HTMLInputElement>;

  community: CommunityPrivateDTO;
  profile?: UserPrivateDTO;
  callForPapers?: CallForPapers;
  isModerator = false;
  canUpdateCommunity = false;

  communityForm: FormGroup;
  callForPapersForm: FormGroup;
  filteredDisciplines?: Observable<DisciplineDTO[]>;
  disciplinesControl = new FormControl();

  communityTypeLOV = COMMUNITY_TYPE_LOV;

  constructor(private route: ActivatedRoute,
              private orviumService: OrviumService,
              private profileService: ProfileService,
              private formBuilder: FormBuilder,
              private spinnerService: OrvSpinnerService,
              private logger: NGXLogger,
              private snackBar: AppSnackBarService,
              private communityService: CommunityService,
              private router: Router) {

    this.community = this.route.snapshot.data.community;

    this.communityForm = this.formBuilder.group({
      name: [null, [Validators.required, AppCustomValidators.validateIsNotBlank]],
      description: [],
      country: [],
      type: [null, [Validators.required]],
      acknowledgement: [],
      twitterURL: [null, [AppCustomValidators.validateTwitter]],
      facebookURL: [null, [AppCustomValidators.validateFacebook]],
      websiteURL: [null, AppCustomValidators.url],
      logoURL: [null, AppCustomValidators.url],
      guidelinesURL: [null, AppCustomValidators.url],
      callForPapers: [[]],
      dataciteAccountID: [],
      datacitePassword: [],
      datacitePrefix: []
    });

    this.callForPapersForm = this.formBuilder.group({
      title: [null, [Validators.required, AppCustomValidators.validateIsNotBlank]],
      deadline: [],
      description: [null, Validators.required],
      scope: [null, Validators.required],
      disciplines: [[]],
      contact: [null, Validators.required],
      contactEmail: [null, [Validators.required, Validators.email]],
      visible: [true, Validators.required]
    });

  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.community = this.route.snapshot.data.community;
      this.refreshCommunity(this.community);
    });

    this.refreshCommunity(this.community);

  }

  refreshCommunity(community: CommunityPrivateDTO): void {
    this.community = community;
    this.communityForm.reset({ ...this.community });
    this.callForPapersForm.reset({ ...this.community.callForPapers });

    this.canUpdateCommunity = this.communityService.canUpdateCommunity(this.community);
    this.isModerator = this.communityService.canModerateCommunity(community);

    if (this.canUpdateCommunity) {
      this.communityForm.enable();
      this.callForPapersForm.enable();
    } else {
      this.communityForm.disable();
      this.callForPapersForm.disable();
    }
  }

  createCallForPapers(): void {
    this.community.callForPapers = new CallForPapers();
    this.refreshCommunity(this.community);
  }

  saveCallForPapers(): void {
    if (this.callForPapersForm.valid) {
      let newCallForPapers = this.communityForm.get('callForPapers')?.value;
      newCallForPapers.title = this.callForPapersForm.get('title')?.value;
      newCallForPapers.deadline = this.callForPapersForm.get('deadline')?.value;
      newCallForPapers.description = this.callForPapersForm.get('description')?.value;
      newCallForPapers.scope = this.callForPapersForm.get('scope')?.value;
      newCallForPapers.disciplines = this.callForPapersForm.get('disciplines')?.value;
      newCallForPapers.contact = this.callForPapersForm.get('contact')?.value;
      newCallForPapers.contactEmail = this.callForPapersForm.get('contactEmail')?.value;
      newCallForPapers.visible = this.callForPapersForm.get('visible')?.value;
      this.communityForm.markAsDirty();
    } else {
      this.snackBar.error('Invalid title');
    }
  }

  save(): void {
    if (this.callForPapersForm.invalid) {
      this.callForPapersForm.markAllAsTouched();
      this.snackBar.error('Check call for papers details');
      return;
    }
    this.saveCallForPapers();
    this.logger.debug('Saving community');
    this.community = Object.assign(this.community, this.communityForm.value);
    this.logger.debug(this.community);
    const spinnerName = 'spinnerProof';
    this.spinnerService.show(spinnerName);
    this.orviumService.updateCommunity(this.community._id, this.communityForm.value).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    ).subscribe(response => {
      this.refreshCommunity(response);
      this.communityForm.markAsPristine();
      this.snackBar.info('Community saved');
      this.logger.debug('Community saved');
    });
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const disciplines = this.callForPapersForm.get('disciplines')?.value;

    if ((value || '').trim()) {
      disciplines.push(value.trim());
      this.callForPapersForm.patchValue({ disciplines });
      this.callForPapersForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

  }

  removeKeyword(keyword: string): void {
    const keywords = this.callForPapersForm.get('disciplines')?.value;
    const index = keywords.indexOf(keyword);

    if (index >= 0) {
      keywords.splice(index, 1);
      this.callForPapersForm.patchValue({ keywords });
      this.callForPapersForm.markAsDirty();
    }
  }

}
