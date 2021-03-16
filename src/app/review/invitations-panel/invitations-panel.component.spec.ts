import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { InvitationsListComponent } from 'src/app/shared/invitations-list/invitations-list.component';

import { InvitationsPanelComponent } from './invitations-panel.component';
import { MyreviewsComponent } from '../myreviews/myreviews.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';

describe('InvitationsPanelComponent', () => {
  let component: InvitationsPanelComponent;
  let fixture: ComponentFixture<InvitationsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationsPanelComponent, InvitationsListComponent, MyreviewsComponent],
      imports: [HttpClientTestingModule, MatTabsModule, RouterTestingModule, BrowserAnimationsModule, MatTableModule, MatDividerModule]
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
