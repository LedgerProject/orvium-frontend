import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { FeedbackService } from './feedback.service';
import { Overlay } from '@angular/cdk/overlay';
import { UserPrivateDTO } from '../../model/api';

@Directive({ selector: '[appFeedback]' })
export class FeedbackDirective {
  private overlay: Overlay;
  @Input() public user: UserPrivateDTO | undefined;
  @Output() public send = new EventEmitter<object>();

  public constructor(private dialogRef: MatDialog,
                     private feedbackService: FeedbackService,
                     overlay: Overlay) {
    this.feedbackService.feedback$.subscribe(
      (feedback) => {
        this.send.emit(feedback);
      }
    );
    this.overlay = overlay;
  }

  @HostListener('click')
  public onClick(): void {
    this.openFeedbackDialog();
  }

  public openFeedbackDialog(): void {
    this.feedbackService.initScreenshotCanvas();
    this.feedbackService.initialVariables = {
      user: this.user
    };
    const dialogRef = this.dialogRef.open(FeedbackDialogComponent, {
      panelClass: 'feedbackDialog',
      backdropClass: 'dialogBackDrop',
      disableClose: true,
      height: 'auto',
      width: 'auto',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

}
