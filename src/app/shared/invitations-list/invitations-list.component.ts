import { Component, Input, OnInit } from '@angular/core';
import { Invite, INVITE_STATUS } from 'src/app/model/orvium';
import { OrviumService } from 'src/app/services/orvium.service';

@Component({
  selector: 'app-invitations-list',
  templateUrl: './invitations-list.component.html',
  styleUrls: ['./invitations-list.component.scss']
})
export class InvitationsListComponent implements OnInit {
  displayedColumns = ['publication', 'author', 'deadline', 'action'];
  @Input() invites: Invite[];

  constructor(private orviumService: OrviumService) {
  }

  ngOnInit(): void {
  }

  acceptInvite(invite: Invite): void {
    const newInvite = new Invite();
    newInvite.status = INVITE_STATUS.accepted;
    this.orviumService.updateInvite(invite._id, newInvite).subscribe(response => {
      invite.status = INVITE_STATUS.accepted;
    });
  }

  rejectInvite(invite: Invite): void {
    const newInvite = new Invite();
    newInvite.status = INVITE_STATUS.rejected;
    this.orviumService.updateInvite(invite._id, newInvite).subscribe(response => {
      invite.status = INVITE_STATUS.rejected;
    });
  }
}
