import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallForPapersComponent } from './call-for-papers.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CallForPapersComponent', () => {
  let component: CallForPapersComponent;
  let fixture: ComponentFixture<CallForPapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallForPapersComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatExpansionModule,
        NoopAnimationsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallForPapersComponent);
    component = fixture.componentInstance;
    component.callForPapers = {
      title: 'The title',
      description: 'description',
      disciplines: [],
      scope: 'Scope text',
      contact: 'contact field',
      guestEditors: 'the guest editors',
      deadline: new Date('1968-11-16T00:00:00'),
      contactEmail: 'test@test.com',
      visible: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
