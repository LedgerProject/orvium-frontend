import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FeedbackService } from './feedback.service';
import { FeedbackDirective } from './feedback.directive';
import { MatDialog } from '@angular/material/dialog';

@Component({
  template: `
    <button [appFeedback]="'test'"></button>`
})
class TestFeedbackDirectiveComponent {
}


describe('Directive: FeedbackDirective', () => {

  let component: TestFeedbackDirectiveComponent;
  let fixture: ComponentFixture<TestFeedbackDirectiveComponent>;
  let buttonEl: DebugElement;
  let directive: FeedbackDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule],
      declarations: [TestFeedbackDirectiveComponent, FeedbackDirective],
      providers: [{ provide: FeedbackService, useValue: {} },
        {
          provide: MatDialog,
          useValue: {
            open: (): void => {
            },
            close: (): void => {
            }
          }
        },
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(TestFeedbackDirectiveComponent);
    component = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('button'));
    const feedbackService = fixture.debugElement.injector.get(FeedbackService);
  });

});
