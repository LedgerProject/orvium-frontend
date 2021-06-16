import { Component, OnInit } from '@angular/core';
import { OrviumService } from '../../services/orvium.service';
import { Router } from '@angular/router';
import { DepositsService } from '../deposits.service';
import { ProfileService } from '../../profile/profile.service';
import { DEPOSIT_STATUS, DepositDTO, UserPrivateDTO } from 'src/app/model/api';

@Component({
  selector: 'app-after-submit-view',
  templateUrl: './after-submit-view.component.html',
  styleUrls: ['./after-submit-view.component.scss']
})
export class AfterSubmitViewComponent implements OnInit {
  deposit: DepositDTO;
  profile?: UserPrivateDTO;
  canManageDeposit = false;

  DEPOSIT_STATUS = DEPOSIT_STATUS;

  constructor(private orviumService: OrviumService,
              private router: Router,
              private profileService: ProfileService,
              private depositService: DepositsService
  ) {
    this.deposit = this.router.getCurrentNavigation()?.extras.state?.deposit;
  }

  ngOnInit(): void {
    const profile = this.profileService.profile.getValue();
    if (profile) {
      this.profile = profile;
    }
    this.canManageDeposit = this.depositService.canManageDeposit(this.profile, this.deposit);
  }
}
