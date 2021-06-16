import { fromEvent, Observable, Subscription } from 'rxjs';
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Feedback, FEEDBACK_TYPE } from '../entity/feedback';
import { FeedbackService } from '../feedback.service';
import { Rectangle } from '../entity/rectangle';
import { Router } from '@angular/router';


@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})

export class FeedbackDialogComponent implements AfterViewInit {
  public showToolbar = false;
  public feedback = new Feedback();
  public includeScreenshot = false;
  public screenshotEle?: HTMLElement;
  public drawCanvas?: HTMLCanvasElement;
  @ViewChild('screenshotParent')
  public screenshotParent?: ElementRef;
  public drawColor: string = this.feedbackService.highlightedColor;
  public rectangles: Rectangle[] = [];
  private scrollWidth = document.documentElement.scrollWidth;
  private scrollHeight = document.documentElement.scrollHeight;
  private elCouldBeHighlighted = ['button', 'a', 'span', 'em', 'i', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'p', 'strong', 'small', 'sub', 'sup', 'b', 'time', 'img',
    'video', 'input', 'label', 'select', 'textarea', 'article', 'summary', 'section'];
  // the flag field 'isManuallyDrawRect' to solve conflict between manually draw and auto draw
  private manuallyDrawRect$?: Subscription;
  private autoDrawRect$?: Subscription;
  public isDrawingRect = false;

  feedbackTypes = [
    { value: FEEDBACK_TYPE.general, viewValue: 'General feedback' },
    { value: FEEDBACK_TYPE.bug, viewValue: 'Bug/Error' },
    { value: FEEDBACK_TYPE.inappropriate, viewValue: 'Inappropriate/Offensive content' },
    { value: FEEDBACK_TYPE.other, viewValue: 'Other' }
  ];
  selected = FEEDBACK_TYPE.general;

  constructor(public dialogRef: MatDialogRef<FeedbackDialogComponent>,
              public feedbackService: FeedbackService,
              private detector: ChangeDetectorRef,
              private el: ElementRef,
              private router: Router) {
    console.log('init', feedbackService.initialVariables);
    this.feedback = new Feedback();
    this.feedback.description = '';
    this.feedback.email = feedbackService.initialVariables.user?.email || '';
    this.feedback.data = {
      user: feedbackService.initialVariables.user,
      url: this.router.url
    };
  }

  public ngAfterViewInit(): void {
    this.feedbackService.screenshotCanvas$.subscribe((canvas) => {
      const image = canvas.toDataURL('image/jpeg', 0.2);
      this.feedback.screenshot = image;
      this.screenshotEle = this.feedbackService.getImgEle(image);
      this.appendScreenshot();
    });

    this.dialogRef.afterClosed().subscribe((sendNow) => {
      if (sendNow === true) {
        if (!this.includeScreenshot) {
          delete this.feedback.screenshot;
        }
        this.feedbackService.setFeedback(this.feedback);
      }
    });

    this.feedbackService.showBackDrop();
  }

  public expandDrawingBoard(): void {
    this.showToolbar = true;
    if (!this.drawCanvas) {
      this.detector.detectChanges();
      this.initBackgroundCanvas();
      this.feedbackService.hideBackDrop();
    }
    this.addCanvasListeners();
    this.el.nativeElement.appendChild(this.drawCanvas);
    this.feedbackService.hideBackDrop();
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onEscapeKeyDownHandler(evt: KeyboardEvent): void {
    this.showToolbar = false;
    this.includeScreenshot = true;
    this.detector.detectChanges();
    this.dialogRef.close('key down esc to close');
  }

  public manipulate(manipulation: string): void {
    if (manipulation === 'done') {
      this.destroyCanvasListeners();
      this.showToolbar = false;
      this.detector.detectChanges();
      this.feedbackService.initScreenshotCanvas();
    } else {
      this.startDraw(manipulation);
    }
  }

  public startDraw(color: string): void {
    this.drawColor = color;
  }

  public isIncludeScreenshot(): void {
    if (this.includeScreenshot) {
      this.detector.detectChanges();
      this.appendScreenshot();
      this.feedback.screenshot = this.screenshotEle?.getAttribute('src') || '';
    } else {
      delete this.feedback.screenshot;
    }
  }

  private appendScreenshot(): void {
    if (this.screenshotParent) {
      this.screenshotParent.nativeElement.appendChild(this.screenshotEle);
    }
  }

  private initBackgroundCanvas(): void {
    this.drawCanvas = document.getElementById('draw-canvas') as HTMLCanvasElement;
    // The canvas to draw, must use this way to initial the height and width
    this.drawCanvas.style.height = this.scrollHeight + '';
    this.drawCanvas.style.width = this.scrollWidth + '';
    this.drawCanvas.height = this.scrollHeight;
    this.drawCanvas.width = this.scrollWidth;
    this.drawContainerRect();
  }

  private drawContainerRect(): void {
    if (!this.drawCanvas) {
      throw new Error('Cannot find drawCanvas');
    }
    const drawContext = this.drawCanvas.getContext('2d');
    if (!drawContext) {
      throw new Error('Cannot drawContainerRect');
    }
    const width = this.scrollWidth;
    const height = this.scrollHeight;
    drawContext.beginPath();
    drawContext.fillStyle = 'rgba(0,0,0,0.3)';
    drawContext.clearRect(0, 0, width, height);
    drawContext.fillRect(0, 0, width, height); // draw the rectangle
  }

  private drawRectangle(rect: Rectangle): void {
    if (!this.drawCanvas) {
      throw new Error('Cannot find drawCanvas');
    }
    const context = this.drawCanvas.getContext('2d');
    if (!context) {
      throw new Error('Cannot drawRectangle');
    }
    context.lineJoin = 'round';
    context.beginPath();
    if (rect.color === this.feedbackService.hiddenColor) {
      context.fillStyle = 'rgba(31, 31, 31, 0.75)';
      context.fillRect(rect.startX, rect.startY, rect.width, rect.height);
      context.rect(rect.startX, rect.startY, rect.width, rect.height);
    } else {
      context.clearRect(rect.startX, rect.startY, rect.width, rect.height);
      context.lineWidth = 5;
      context.strokeStyle = rect.color;
      context.rect(rect.startX, rect.startY, rect.width, rect.height);
      context.stroke();
      context.clearRect(rect.startX, rect.startY, rect.width, rect.height);
      this.rectangles.forEach(tmpRect => {
        if (tmpRect.color === this.feedbackService.highlightedColor) {
          context.clearRect(tmpRect.startX, tmpRect.startY, tmpRect.width, tmpRect.height);
        }
      });
    }
  }

  private addCanvasListeners(): void {
    const mouseUp = fromEvent<MouseEvent>(document.documentElement, 'mouseup');
    const mouseMove = fromEvent<MouseEvent>(document.documentElement, 'mousemove');
    const mouseDown = fromEvent<MouseEvent>(document.documentElement, 'mousedown');
    const scroll = fromEvent(window, 'scroll');

    this.manuallyDrawRect(mouseDown, mouseMove, mouseUp);
    this.autoDrawRect(mouseMove);
    this.changeRectPosition(scroll);
  }

  private changeRectPosition(scroll: Observable<Event>): void {
    scroll.subscribe(
      event => {
        const currentWindowScrollX = window.scrollX;
        const currentWindowScrollY = window.scrollY;
        this.rectangles.forEach(rect => {
          rect.startY = rect.startY - (currentWindowScrollY - rect.windowScrollY);
          rect.startX = rect.startX - (currentWindowScrollX - rect.windowScrollX);
          rect.windowScrollY = currentWindowScrollY;
          rect.windowScrollX = currentWindowScrollX;
        });
        this.drawPersistCanvasRectangles();
      },
      error => console.error(error)
    );
  }

  private destroyCanvasListeners(): void {
    if (this.manuallyDrawRect$) {
      this.manuallyDrawRect$.unsubscribe();
    }
    if (this.autoDrawRect$) {
      this.autoDrawRect$.unsubscribe();
    }
  }

  private manuallyDrawRect(mouseDown: Observable<MouseEvent>, mouseMove: Observable<MouseEvent>, mouseUp: Observable<MouseEvent>): void {
    const mouseDrag = mouseDown.pipe(mergeMap((mouseDownEvent: MouseEvent) => {
      this.autoDrawRect$?.unsubscribe();
      this.isDrawingRect = true;

      const newRectangle = new Rectangle();
      newRectangle.startX = mouseDownEvent.clientX;
      newRectangle.startY = mouseDownEvent.clientY;
      newRectangle.color = this.drawColor;

      return mouseMove.pipe(
        map((mouseMoveEvent: MouseEvent) => {
          newRectangle.width = mouseMoveEvent.clientX - mouseDownEvent.clientX;
          newRectangle.height = mouseMoveEvent.clientY - mouseDownEvent.clientY;
          return newRectangle;
        }),
        finalize(() => {
          // click to draw rectangle
          if (newRectangle.width === undefined || newRectangle.height === undefined ||
            newRectangle.width === 0 || newRectangle.height === 0) {
            const rect = this.drawTempCanvasRectangle(mouseDownEvent);
            if (rect) {
              this.rectangles.push(rect);
            }
          } else {
            // drag to draw rectangle
            if (newRectangle.height < 0) {
              newRectangle.startY = newRectangle.startY + newRectangle.height;
              newRectangle.height = Math.abs(newRectangle.height);
            }
            if (newRectangle.width < 0) {
              newRectangle.startX = newRectangle.startX + newRectangle.width;
              newRectangle.width = Math.abs(newRectangle.width);
            }
            this.rectangles.push(newRectangle);
          }
          this.drawPersistCanvasRectangles();
          this.autoDrawRect(mouseMove);
          this.isDrawingRect = false;
        }),
        takeUntil(mouseUp));
    }));

    this.manuallyDrawRect$ = mouseDrag.subscribe(
      (rec) => {
        this.drawPersistCanvasRectangles();
        this.drawRectangle(rec);
      }
    );
  }

  private autoDrawRect(mouseMove: Observable<MouseEvent>): void {
    this.autoDrawRect$ = mouseMove.subscribe({
      next: (mouseMoveEvent: MouseEvent) => {
        this.drawPersistCanvasRectangles();
        this.drawTempCanvasRectangle(mouseMoveEvent);
      },
      error: err => console.error('something wrong occurred: ' + err),
    });
  }

  private drawPersistCanvasRectangles(): void {
    this.drawContainerRect();
    this.rectangles.forEach(tmpRect => {
      this.drawRectangle(tmpRect);
    });
  }

  private drawTempCanvasRectangle(event: MouseEvent): Rectangle | undefined {
    let rectangle: Rectangle | undefined;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const els = document.elementsFromPoint(clientX, clientY);
    const el = els[2];
    if (this.isExcludeRect(els)) {
      return undefined;
    }
    if (!this.drawCanvas) {
      throw new Error('Cannot find drawCanvas');
    }
    if (el && this.elCouldBeHighlighted.indexOf(el.nodeName.toLowerCase()) > -1) {
      rectangle = new Rectangle();
      const rect = el.getBoundingClientRect();
      this.drawCanvas.style.cursor = 'pointer';

      Object.assign(rectangle, {
        startX: rect.left,
        startY: rect.top,
        width: rect.width,
        height: rect.height,
        color: this.drawColor
      });
      this.drawRectangle(rectangle);
    } else {
      this.drawCanvas.style.cursor = 'crosshair';
    }
    return rectangle;
  }

  public closeRect(index: number): void {
    console.log('removeRectangle', index);
    console.log(this.rectangles);
    this.rectangles.splice(index, 1);
    this.drawPersistCanvasRectangles();
  }

  private isExcludeRect(elements: Element[]): boolean {
    console.log('isExcludeRect', elements);
    const result = elements.some(el => {
      return el.getAttribute('exclude-rect') === 'true';
    });
    return result;
  }
}
