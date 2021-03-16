import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { OrviumService } from '../services/orvium.service';
import { environment } from '../../environments/environment';
import { Community, Deposit, Profile } from '../model/orvium';
import { InviteComponent } from '../invite/invite.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-papers-search',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private metaElements: HTMLMetaElement[];
  deposits: Deposit[];
  profile: Profile;

  environment = environment;
  communities: Community[] = [];

  constructor(private router: Router,
              private titleService: Title,
              public orviumService: OrviumService,
              private route: ActivatedRoute,
              private metaService: Meta,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.deposits = this.route.snapshot.data.depositsQuery.deposits;
    const description =
      'Orvium is a web platform that accelerates science by improving the scientific validation process and reducing publication time.';

    this.titleService.setTitle('Orvium Home');
    this.metaElements = this.metaService.addTags([
      {
        name: 'description',
        content: description
      },
      { name: 'og:title', content: 'Orvium Home' },
      {
        name: 'og:description',
        content: description
      },
      { name: 'og:url', content: environment.publicUrl },
      { name: 'og:site_name', content: 'Orvium' }
    ]);

    this.orviumService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });

    this.orviumService.getCommunities().subscribe(communities => {
      this.communities = communities;
    });
  }

  ngOnDestroy(): void {
    if (this.metaElements) {
      for (const element of this.metaElements) {
        this.metaService.removeTagElement(element);
      }
    }
  }

  openInviteDialog(): void {
    if (!this.profile) {
      this.snackBar.open('You need to log in before invite your colleages',
        'Dismiss',
        { panelClass: ['info-snackbar'] });
      return;
    }
    if (!this.profile.isOnboarded) {
      this.snackBar.open('You need to complete your profile first',
        'Dismiss',
        { panelClass: ['info-snackbar'] });
      return;
    }

    const dialogRef = this.dialog.open(InviteComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The invite dialog was closed');
    });
  }
}
