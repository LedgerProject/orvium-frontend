import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedbackService } from '../feedback.service';
import { FeedbackDialogComponent } from './feedback-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, Subject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedbackToolbarComponent } from '../feedback-toolbar/feedback-toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { Rectangle } from '../entity/rectangle';
import { profilePrivateTest } from '../../test-data';
import { UserPrivateDTO } from '../../../model/api';

describe('FeedbackDialogComponent', () => {
  let component: FeedbackDialogComponent;
  let fixture: ComponentFixture<FeedbackDialogComponent>;
  let evt: KeyboardEvent;
  const profile: UserPrivateDTO = { ...profilePrivateTest(), ...{ isOnboarded: true } };
  const screenshotCanvasSource = new Subject<HTMLCanvasElement>();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackDialogComponent, FeedbackToolbarComponent],
      imports: [MatDialogModule,
        RouterTestingModule.withRoutes([]),
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule

      ],
      providers: [
        {
          provide: FeedbackService, useValue: {
            initialVariables: profile, screenshotCanvas$: screenshotCanvasSource.asObservable(),
            showBackDrop: (): void => {
            },
            setFeedback: (): void => {
            },
            hideBackDrop: (): void => {
            },
            initScreenshotCanvas: (): void => {
            }
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            open: (): void => {
            },
            close: (): void => {
            },
            afterClosed: (): Observable<boolean> => of(true)
          }
        },
      ],
    })
      .compileComponents();

    evt = new KeyboardEvent('document:keydown.escape');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO fix this test
  // it('should expand drawing board DA FALLO', () => {
  //   component.expandDrawingBoard();
  //   expect(component.showToolbar).toBeTrue();
  // });

  it('should close dialog', () => {
    let spy = spyOn(component.dialogRef, 'close');
    component.onEscapeKeyDownHandler(evt);
    expect(component.showToolbar).toBeFalse();
    expect(component.includeScreenshot).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });

  it('should manipulate', () => {
    component.showToolbar = true;
    component.manipulate('done');
    expect(component.showToolbar).toBeFalse();
  });

  it('should not manipulate', () => {
    component.showToolbar = true;
    component.manipulate('not done');
    expect(component.showToolbar).toBeTrue();
  });

  it('should start drawing', () => {
    component.startDraw('yellow');
    expect(component.drawColor).toBe('yellow');
  });

  it('should close rectangle', () => {
    component.rectangles.push(new Rectangle());
    component.rectangles.push(new Rectangle());
    expect(component.rectangles.length).toBe(2);
    // @ts-ignore
    component.initBackgroundCanvas();
    component.closeRect(1);
    expect(component.rectangles.length).toBe(1);
  });
});
