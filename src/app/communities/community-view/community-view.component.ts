import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormControl, FormGroup } from '@angular/forms';
import { ShareService } from 'ngx-sharebuttons';
import { ProfileService } from '../../profile/profile.service';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { CommunityDTO, CreateDepositDTO, DepositDTO, UserPrivateDTO, UserSummaryDTO } from '../../model/api';
import { CommunityService } from '../community.service';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {
  community!: CommunityDTO;
  profile?: UserPrivateDTO;
  isContributor = false;
  deposits: DepositDTO[] = [];
  moderators: UserSummaryDTO[] = [];
  newPublicationForm = new FormGroup({
    title: new FormControl(''),
  });
  public isModerator = false;

  constructor(
    public share: ShareService,
    private titleService: Title,
    private metaService: Meta,
    private orviumService: OrviumService,
    private profileService: ProfileService,
    private communityService: CommunityService,
    private route: ActivatedRoute,
    private snackBar: AppSnackBarService,
    public router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    @Inject(DOCUMENT) private dom: Document
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(async data => {
      this.community = data.community;
      if (!this.community) {
        throw new Error('Community not found');
      }
      this.init();
    });
  }

  public setSEOTags(): void {
    this.titleService.setTitle(this.community.name + ' | Orvium');
    this.metaService.addTags([
      {
        name: 'description',
        content: this.community.description || this.community.name
      },
      { name: 'og:title', content: this.community.name + ' | Orvium' },
      {
        name: 'og:description',
        content: this.community.description || this.community.name
      },
      { name: 'og:url', content: this.dom.URL },
      { name: 'og:site_name', content: this.community.name }
    ]);
  }

  public joinCommunity(): void {
    this.orviumService.joinCommunity(this.community._id).subscribe(community => {
      this.snackBar.info('Congratulations, you have joined ' + this.community.name + ' community');
      this.profileService.getProfileFromApi().subscribe(profile => {
        this.setIsContributor();
      });
      this.community = community;
    });

  }

  public setIsContributor(): void {
    if (this.profile) {
      for (const community of this.profile.communities) {
        if (community._id === this.community._id) {
          this.isContributor = true;
        }
      }
    }
  }

  public uploadDeposit(): void {
    if (!this.profile) {
      this.snackBar.info('You need to login first');
      return;
    }

    if (!this.profile?.isOnboarded) {
      this.snackBar.info('Complete your profile first to upload a publication');
    } else {
      this.ngxSmartModalService.open('uploadDepositModal');
    }
  }

  public createDeposit(): void {
    if (this.newPublicationForm.get('title')?.value !== '' && this.newPublicationForm.get('title')?.value !== null) {
      const deposit = new CreateDepositDTO();
      deposit.title = this.newPublicationForm.get('title')?.value;
      deposit.community = this.community._id;
      this.orviumService.createDeposit(deposit).subscribe(response => {
        this.newPublicationForm.reset();
        this.router.navigate(['deposits', response._id, 'edit']);
      });
    } else {
      this.newPublicationForm.reset();
      this.snackBar.error('Please, enter a title for your publication');
    }
    this.newPublicationForm.reset();
    this.ngxSmartModalService.close('uploadDepositModal');
  }

  public callForPapers(): void {
    this.ngxSmartModalService.open('callForPapersModal');
  }

  private init(): void {

    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
        this.isModerator = this.communityService.canModerateCommunity(this.community);

      }
    });
    this.orviumService.getCommunityDeposits(this.community._id).subscribe(deposits => {
      this.deposits = deposits;
    });
    if (this.community.moderators) {
      this.moderators = this.community.moderators;
    }

    this.setIsContributor();
    this.setSEOTags();
  }
}
