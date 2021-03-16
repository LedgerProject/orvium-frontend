import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { InvitationsListComponent } from './invitations-list.component';

describe('InvitationsListComponent', () => {
  let component: InvitationsListComponent;
  let fixture: ComponentFixture<InvitationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationsListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatTableModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
