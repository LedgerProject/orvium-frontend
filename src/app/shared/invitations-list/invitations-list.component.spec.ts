import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { InvitationsListComponent } from './invitations-list.component';
import { OrviumService } from '../../services/orvium.service';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { INVITE_STATUS, INVITE_TYPE, InviteDTO, UserSummaryDTO } from '../../model/api';


const userSummary: UserSummaryDTO = {
  firstName: 'Jhon',
  lastName: 'Doe',
  nickname: 'jhondoe',
  communities: [],
  userId: '',
  gravatar: ''
};


describe('InvitationsListComponent', () => {
  let component: InvitationsListComponent;
  let fixture: ComponentFixture<InvitationsListComponent>;
  let invite: InviteDTO;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationsListComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatTableModule,
        MatSnackBarModule,
        LoggerTestingModule,
        NoopAnimationsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationsListComponent);
    component = fixture.componentInstance;
    invite = {
      _id: '1',
      addressee: 'test@test.com',
      sender: userSummary,
      data: {},
      inviteType: INVITE_TYPE.review,
      status: INVITE_STATUS.pending,
      deadline: new Date,
      createdOn: new Date,
      actions: []
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept invite', () => {
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    spyOn(orviumService, 'updateInvite').and.returnValue(of({
      _id: '1',
      addressee: 'test@test.com',
      sender: userSummary,
      data: {},
      inviteType: INVITE_TYPE.review,
      status: INVITE_STATUS.accepted,
      deadline: new Date,
      createdOn: new Date,
      actions: []
    }));
    fixture.detectChanges();
    component.acceptInvite(invite);
    expect(invite.status).toBe(INVITE_STATUS.accepted);
  });

  it('should reject invite', () => {
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    spyOn(orviumService, 'updateInvite').and.returnValue(of({
      _id: '1',
      addressee: 'test@test.com',
      sender: userSummary,
      data: {},
      inviteType: INVITE_TYPE.review,
      status: INVITE_STATUS.rejected,
      deadline: new Date,
      createdOn: new Date,
      actions: []
    }));
    fixture.detectChanges();
    component.rejectInvite(invite);
    expect(invite.status).toBe(INVITE_STATUS.rejected);
  });

});
