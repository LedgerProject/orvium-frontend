import { TestBed } from '@angular/core/testing';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entity/feedback';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let feedback: Feedback;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackService
      ],
    });
    service = TestBed.inject(FeedbackService);
    feedback = new Feedback();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO testing fails with initScreenshotCanvas due to Karma dom document object
  // it('should initialize screenshot canvas', () => {
  //   service.initScreenshotCanvas();
  //   expect(service.screenshotCanvas$).toBeTruthy();
  // });

  it('should set feedback', () => {
    service.setFeedback(feedback);
    expect(service.feedback$).toBeTruthy();
  });

  it('should get image', () => {
    let image = service.getImgEle('img');
    expect(image).toBeInstanceOf(HTMLElement);
  });

});
