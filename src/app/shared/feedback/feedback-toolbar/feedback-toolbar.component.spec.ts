import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackService } from '../feedback.service';
import { FeedbackToolbarComponent } from './feedback-toolbar.component';
import { MatIconModule } from '@angular/material/icon';

describe('FeedbackToolbarComponent', () => {
  let component: FeedbackToolbarComponent;
  let fixture: ComponentFixture<FeedbackToolbarComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackToolbarComponent],
      imports: [MatIconModule
      ],
      providers: [{ provide: FeedbackService, useValue: {} }]
    })
      .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    const feedbackService = fixture.debugElement.injector.get(FeedbackService);
    component.drawColor = 'yellow';
    feedbackService.highlightedColor = 'blue';
    component.ngOnChanges();
    expect(component.isSwitch).toBeTrue();
  });

  it('should emit manipulate', () => {
    spyOn(component.manipulate, 'emit');
    component.done();
    expect(component.manipulate.emit).toHaveBeenCalled();
  });

  it('should toggle highlight', () => {
    const feedbackService = fixture.debugElement.injector.get(FeedbackService);
    spyOn(component.manipulate, 'emit');
    feedbackService.highlightedColor = 'blue';
    component.toggleHighlight();
    expect(component.isSwitch).toBeFalse();
    expect(component.manipulate.emit).toHaveBeenCalledWith('blue');
  });

  it('should hide toggle', () => {
    const feedbackService = fixture.debugElement.injector.get(FeedbackService);
    spyOn(component.manipulate, 'emit');
    feedbackService.hiddenColor = 'white';
    component.toggleHide();
    expect(component.isSwitch).toBeTrue();
    expect(component.manipulate.emit).toHaveBeenCalledWith('white');
  });
});
