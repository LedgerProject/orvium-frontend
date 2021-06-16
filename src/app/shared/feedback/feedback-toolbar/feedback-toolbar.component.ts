import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FeedbackService } from '../feedback.service';


@Component({
  selector: 'app-feedback-toolbar',
  templateUrl: './feedback-toolbar.component.html',
  styleUrls: ['./feedback-toolbar.component.scss']
})

export class FeedbackToolbarComponent implements OnChanges {
  @Input()
  public drawColor = '';
  @Output()
  public manipulate = new EventEmitter<string>();
  public isSwitch = false;

  constructor(private feedbackService: FeedbackService) {
  }

  public ngOnChanges(): void {
    this.isSwitch = this.drawColor !== this.feedbackService.highlightedColor;
  }

  public done(): void {
    this.manipulate.emit('done');
  }

  public toggleHighlight(): void {
    this.isSwitch = false;
    this.manipulate.emit(this.feedbackService.highlightedColor);
  }

  public toggleHide(): void {
    this.isSwitch = true;
    this.manipulate.emit(this.feedbackService.hiddenColor);
  }
}
