import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Feedback } from './entity/feedback';
import { UserPrivateDTO } from '../../model/api'; // import Observable to solve build issue

@Injectable()
export class FeedbackService {
  public initialVariables: { user?: UserPrivateDTO } = {};
  public highlightedColor = 'yellow';
  public hiddenColor = 'black';
  private screenshotCanvasSource = new Subject<HTMLCanvasElement>();
  public screenshotCanvas$: Observable<HTMLCanvasElement> = this.screenshotCanvasSource.asObservable();

  private feedbackSource = new Subject<Feedback>();
  public feedback$: Observable<Feedback> = this.feedbackSource.asObservable();


  public initScreenshotCanvas(): void {
    import('html2canvas').then((module) => {
      const body = document.body;
      module.default(body, {
        logging: false,
        // allowTaint: true,
        useCORS: true,
      }).then(canvas => {
        this.screenshotCanvasSource.next(canvas);
      });
    });
  }


  public setFeedback(feedback: Feedback): void {
    this.feedbackSource.next(feedback);
  }

  public getImgEle(image: string): HTMLElement {
    const img = image;
    const imageEle = document.createElement('img');
    imageEle.setAttribute('src', img);
    Object.assign(imageEle.style, {
      position: 'absolute',
      top: '50%',
      right: '0',
      left: '0',
      margin: '0 auto',
      maxHeight: '100%',
      maxWidth: '100%',
      transform: 'translateY(-50%)'
    });
    return imageEle;
  }

  public hideBackDrop(): void {
    const dialogBackDrop = document.getElementsByClassName('dialogBackDrop')[0] as HTMLElement;
    dialogBackDrop.style.backgroundColor = 'initial';
  }

  public showBackDrop(): void {
    const dialogBackDrop = document.getElementsByClassName('dialogBackDrop')[0] as HTMLElement;
    if (!dialogBackDrop.getAttribute('data-html2canvas-ignore')) {
      dialogBackDrop.setAttribute('data-html2canvas-ignore', 'true');
    }
    dialogBackDrop.style.backgroundColor = 'rgba(0, 0, 0, .288)';
  }
}
