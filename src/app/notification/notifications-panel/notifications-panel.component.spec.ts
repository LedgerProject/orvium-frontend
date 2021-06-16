import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPanelComponent } from './notifications-panel.component';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';


describe('NotificationsPanelComponent', () => {
  let component: NotificationsPanelComponent;
  let fixture: ComponentFixture<NotificationsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsPanelComponent],
      imports: [
        MatIconModule,
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatListModule,
        MatDividerModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
