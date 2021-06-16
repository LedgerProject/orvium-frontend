import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { OrviumService } from '../../services/orvium.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../profile/profile.service';
import { AppSnackBarService } from '../../services/app-snack-bar.service';
import { UserPrivateDTO } from '../../model/api';

@Component({
  selector: 'app-empty-state-publications',
  templateUrl: './empty-state-publications.component.html',
  styleUrls: ['./empty-state-publications.component.scss']
})
export class EmptyStatePublicationsComponent implements OnInit {
  newPublicationForm: FormGroup;
  profile?: UserPrivateDTO;

  constructor(public ngxSmartModalService: NgxSmartModalService,
              public router: Router,
              private snackBar: AppSnackBarService,
              public orviumService: OrviumService,
              private profileService: ProfileService
  ) {
    this.newPublicationForm = new FormGroup({
      title: new FormControl(''),
    });
  }

  ngOnInit(): void {

    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });
  }

  save(): void {
    if (this.newPublicationForm.get('title')?.value !== '' && this.newPublicationForm.get('title')?.value !== null) {
      this.orviumService.createDeposit({ title: this.newPublicationForm.get('title')?.value }).subscribe(response => {
        this.newPublicationForm.reset();
        this.router.navigate(['deposits', response._id, 'edit']);
      });
    } else {
      this.snackBar.error('Please, enter a title for your publication');
      this.newPublicationForm.reset();
    }
    this.close();
  }

  close(): void {
    this.newPublicationForm.reset();
    this.ngxSmartModalService.close('createDeposit');
  }

  create(): void {
    if (!this.profile?.isOnboarded || !this.profile?.emailConfirmed) {
      this.snackBar.info('Complete your profile & confirm your email first');
    } else {
      this.ngxSmartModalService.open('createDeposit');
    }
  }

}
