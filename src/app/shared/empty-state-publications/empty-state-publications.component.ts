import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrviumService } from '../../services/orvium.service';
import { Router } from '@angular/router';
import { Profile } from '../../model/orvium';

@Component({
  selector: 'app-empty-state-publications',
  templateUrl: './empty-state-publications.component.html',
  styleUrls: ['./empty-state-publications.component.scss']
})
export class EmptyStatePublicationsComponent implements OnInit {
  newPublicationForm: FormGroup;
  profile: Profile;

  constructor(public ngxSmartModalService: NgxSmartModalService,
              public router: Router,
              private snackBar: MatSnackBar,
              public orviumService: OrviumService,
  ) {
  }

  ngOnInit(): void {
    this.newPublicationForm = new FormGroup({
      title: new FormControl(''),
    });
    this.orviumService.getProfile().subscribe(profile => {
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
      this.snackBar.open('Please, enter a title for your publication', 'Dismiss', { panelClass: ['error-snackbar'] });
      this.newPublicationForm.reset();
    }
    this.close();
  }

  close(): void {
    this.newPublicationForm.reset();
    this.ngxSmartModalService.close('createDeposit');
  }

  create(): void {
    if (!this.profile?.isOnboarded) {
      this.snackBar.open('Complete your profile first to create publications', 'Dismiss', { panelClass: ['info-snackbar'] });
    } else {
      this.ngxSmartModalService.open('createDeposit');
    }
  }

}
