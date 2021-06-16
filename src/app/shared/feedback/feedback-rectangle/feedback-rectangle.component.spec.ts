import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackRectangleComponent } from './feedback-rectangle.component';
import { FeedbackService } from '../feedback.service';

describe('FeedbackRectangleComponent', () => {
  let component: FeedbackRectangleComponent;
  let fixture: ComponentFixture<FeedbackRectangleComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackRectangleComponent],
      imports: [],
      providers: [{ provide: FeedbackService, useValue: {} }]
    })
      .compileComponents();


  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show close tag', () => {
    component.onMouseEnter();
    expect(component.showCloseTag).toBeTrue();
  });

  it('should hide close tag', () => {
    component.onMouseLeave();
    expect(component.showCloseTag).toBeFalse();
  });

  it('should remove rectangle', () => {
    spyOn(component.removeRectangle, 'emit');
    component.onClose();
    expect(component.removeRectangle.emit).toHaveBeenCalled();
  });

});
