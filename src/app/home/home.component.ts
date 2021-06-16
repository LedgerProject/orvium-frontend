import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { OrviumService } from '../services/orvium.service';
import { environment } from '../../environments/environment';
import { TopDisciplinesQuery } from '../model/orvium';
import { InviteComponent } from '../invite/invite.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '../profile/profile.service';
import { AppSnackBarService } from '../services/app-snack-bar.service';
import { CommunityDTO, DepositDTO, UserPrivateDTO } from '../model/api';


@Component({
  selector: 'app-papers-search',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  deposits: DepositDTO[] = [];
  profile?: UserPrivateDTO;
  environment = environment;
  communities: CommunityDTO[] = [];
  topDisciplines: TopDisciplinesQuery[] = [];
  chipClass: string[] = ['chip-aquamarine', 'chip-yellow', 'chip-pink', 'chip-blue'];
  private metaElements: HTMLMetaElement[] = [];

  constructor(private router: Router,
              private titleService: Title,
              public orviumService: OrviumService,
              private profileService: ProfileService,
              private route: ActivatedRoute,
              private metaService: Meta,
              private dialog: MatDialog,
              private snackBar: AppSnackBarService) {
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

    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });

    this.orviumService.getCommunities().subscribe(communities => {
      this.communities = communities;
    });

    this.orviumService.getTopDisciplines().subscribe(topDisciplines => {
      this.topDisciplines = topDisciplines;
      console.log(topDisciplines);
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
      this.snackBar.info('You need to log in before invite your colleages');
      return;
    }
    if (!this.profile.isOnboarded) {
      this.snackBar.info('You need to complete your profile first');
      return;
    }

    const dialogRef = this.dialog.open(InviteComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The invite dialog was closed');
    });
  }

  searchByDiscipline(discipline: string): void {
    this.router.navigate(['/search'],
      { queryParams: { discipline: discipline, page: 1, size: 10 }, queryParamsHandling: 'merge' });
  }

}
