import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Rectangle } from '../entity/rectangle';
import { FeedbackService } from '../feedback.service';

@Component({
  selector: 'app-feedback-rectangle',
  templateUrl: './feedback-rectangle.component.html',
  styleUrls: ['./feedback-rectangle.component.scss']
})

export class FeedbackRectangleComponent {
  @Input()
  public rectangle: Rectangle = new Rectangle();
  @Output()
  public removeRectangle = new EventEmitter<boolean>();
  public showCloseTag = false;

  constructor(public feedbackService: FeedbackService) {
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.showCloseTag = true;
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.showCloseTag = false;
  }

  public onClose(): void {
    this.removeRectangle.emit();
  }


}
