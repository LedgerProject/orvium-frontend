import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';

import { InvitationsPanelComponent } from './invitations-panel.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { Component, Input } from '@angular/core';
import { InviteDTO, ReviewDTO } from '../../model/api';

@Component({ selector: 'app-invitations-list', template: '' })
class InvitationsListStubComponent {
  @Input() invites: InviteDTO[] = [];
}

@Component({ selector: 'app-myreviews', template: '' })
class MyreviewsStubComponent {
  @Input() reviews: ReviewDTO[] = [];
}

describe('InvitationsPanelComponent', () => {
  let component: InvitationsPanelComponent;
  let fixture: ComponentFixture<InvitationsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InvitationsPanelComponent,
        InvitationsListStubComponent,
        MyreviewsStubComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatTabsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatDividerModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
