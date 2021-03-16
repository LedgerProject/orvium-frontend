import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Community, Deposit, Profile } from '../../model/orvium';
import { OrviumService } from '../../services/orvium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormControl, FormGroup } from '@angular/forms';
import { ShareService } from 'ngx-sharebuttons';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {
  community: Community;
  profile: Profile;
  isContributor = false;
  deposits: Deposit[];
  newPublicationForm: FormGroup;
  public isModerator = false;

  constructor(
    public share: ShareService,
    private titleService: Title,
    private metaService: Meta,
    private orviumService: OrviumService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    @Inject(DOCUMENT) private dom: Document
  ) {
  }

  ngOnInit(): void {
    this.route.data.pipe().subscribe(async data => {
      this.community = data.community;
    });
    this.orviumService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
        this.isModerator = this.profile.roles.includes('moderator:' + this.community._id);
      }
    });
    this.orviumService.getCommunityDeposits(this.community._id).subscribe(deposits => {
      this.deposits = deposits;
    });
    this.newPublicationForm = new FormGroup({
      title: new FormControl(''),
    });
    this.setIsContributor();
    this.setSEOTags();
  }

  public setSEOTags(): void {
    this.titleService.setTitle(this.community.name + ' | Orvium');
    this.metaService.addTags([
      {
        name: 'description',
        content: this.community.description
      },
      { name: 'og:title', content: this.community.name + ' | Orvium' },
      {
        name: 'og:description',
        content: this.community.description,
      },
      { name: 'og:url', content: this.dom.URL },
      { name: 'og:site_name', content: this.community.name }
    ]);
  }

  public joinCommunity(): void {
    if (!this.profile) {
      this.snackBar.open('You need to login first',
        'Dismiss', { panelClass: ['info-snackbar'] });
      return;
    }

    this.orviumService.joinCommunity(this.community._id).subscribe(community => {
      this.snackBar.open('Congratulations, you have joined ' + this.community.name + ' community',
        'Dismiss', { panelClass: ['ok-snackbar'] });
      this.orviumService.getProfileFromApi().subscribe(profile => {
        this.setIsContributor();
      });
      this.community = community;
    });

  }

  public setIsContributor(): void {
    if (this.profile && this.profile.communities?.includes(this.community._id)) {
      this.isContributor = true;
    }
  }

  public uploadDeposit(): void {
    if (!this.profile) {
      this.snackBar.open('You need to login first',
        'Dismiss', { panelClass: ['info-snackbar'] });
      return;
    }

    if (!this.profile?.isOnboarded) {
      this.snackBar.open('Complete your profile first to upload a publication',
        'Dismiss', { panelClass: ['info-snackbar'] });
    } else {
      this.ngxSmartModalService.open('uploadDepositModal');
    }
  }

  public createDeposit(): void {
    if (this.newPublicationForm.get('title')?.value !== '' && this.newPublicationForm.get('title')?.value !== null) {
      const deposit = new Deposit();
      deposit.title = this.newPublicationForm.get('title')?.value;
      deposit.community = this.community;
      this.orviumService.createDeposit(deposit).subscribe(response => {
        this.newPublicationForm.reset();
        this.router.navigate(['deposits', response._id, 'edit']);
      });
    } else {
      this.newPublicationForm.reset();
      this.snackBar.open('Please, enter a title for your publication', 'Dismiss', { panelClass: ['error-snackbar'] });
    }
    this.close();
  }

  close(): void {
    this.newPublicationForm.reset();
    this.ngxSmartModalService.close('uploadDepositModal');
  }
}
