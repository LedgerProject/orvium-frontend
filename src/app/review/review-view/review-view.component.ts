import { Component, OnInit } from '@angular/core';
import { Deposit, OrviumFile, PeerReview, Profile, REVIEW_STATUS } from '../../model/orvium';
import { OrviumService } from '../../services/orvium.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-review-view',
  templateUrl: './review-view.component.html',
  styleUrls: ['./review-view.component.scss']
})
export class ReviewViewComponent implements OnInit {
  peerReview: PeerReview;
  deposit: Deposit;
  environment = environment;
  filelink;
  files: OrviumFile[] = [];
  isOwner: boolean;
  columnsToDisplay = ['filename', 'contentType', 'length', 'edit'];
  profile: Profile;
  REVIEW_STATUS = REVIEW_STATUS;
  smallScreen = false;
  tinyScreen = false;

  constructor(public orviumService: OrviumService,
              public breakpointObserver: BreakpointObserver,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.peerReview = this.route.snapshot.data.review;
    this.deposit = this.route.snapshot.data.deposit;
    if (this.peerReview.file?.filename) {
      this.files = [];
      this.files.push(this.peerReview.file);
    }
    this.filelink = `${environment.backend}/deposits/${this.deposit._id.$oid}/reviews/${this.peerReview._id.$oid}/files`;
    this.orviumService.getProfile().subscribe(profile => {
      this.profile = profile;
      if (this.profile && this.profile.userId === this.peerReview.owner) {
        this.isOwner = true;
      }
    });
    this.breakpointObserver.observe(['(min-width: 768px)', '(min-width: 500px)'])
      .subscribe(result => {
        this.smallScreen = !result.breakpoints['(min-width: 768px)'];
        this.tinyScreen = !result.breakpoints['(min-width: 500px)'];
      });
  }

  canOpenOverleaf(filename: string) {
    const regex = /\w+\.tex/g;
    return filename.match(regex);
  }
}
