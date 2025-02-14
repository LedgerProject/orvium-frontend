import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InviteComponent } from './invite.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareModule } from 'ngx-sharebuttons';
import { BehaviorSubject, of } from 'rxjs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { SharedModule } from '../shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../profile/profile.service';
import { UserPrivateDTO } from '../model/api';
import { profilePrivateTest } from '../shared/test-data';

// Noop component is only a workaround to trigger change detection
@Component({
  template: ''
})
class NoopComponent {
}

const TEST_DIRECTIVES = [
  InviteComponent, NoopComponent
];

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule,
    MatTabsModule, MatCardModule, MatFormFieldModule, MatChipsModule, MatInputModule,
    MatIconModule,
    ShareModule,
    ClipboardModule,
    FontAwesomeModule,
    SharedModule,
    MatSnackBarModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    InviteComponent
  ],
})
class DialogTestModule {
}


describe('InviteComponent', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<InviteComponent>;
  let component: InviteComponent;
  let profileBehaviour: BehaviorSubject<UserPrivateDTO | undefined>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogTestModule,
        MatDialogModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeTestingModule,
        SharedModule,
        ShareModule,
        ClipboardModule
      ],
      providers: [
        {
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: (): HTMLElement => overlayContainerElement };
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            open: (): void => {
            },
            close: (): void => {
            }
          }
        }
      ],
    })
      .compileComponents();

    const profile = profilePrivateTest();
    profileBehaviour = new BehaviorSubject<UserPrivateDTO | undefined>(profile);
    dialog = TestBed.inject(MatDialog);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    const profileService = fixture.debugElement.injector.get(ProfileService);
    profileService.profile = profileBehaviour;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an email', async () => {
    expect(component.emails.length).toBe(0);
    const inputDiscipline = fixture.debugElement.query(By.css('#inputEmails'));
    const event: MatChipInputEvent = {
      input: inputDiscipline.nativeElement,
      value: 'johndoe@gmail.com',
    };
    component.add(event);
    expect(component.emails.length).toBe(1);
  });

  it('should not add empty', async () => {
    expect(component.emails.length).toBe(0);
    const inputDiscipline = fixture.debugElement.query(By.css('#inputEmails'));
    const event: MatChipInputEvent = {
      input: inputDiscipline.nativeElement,
      value: '',
    };
    component.add(event);
    expect(component.emails.length).toBe(0);
  });

  it('should not add invalid email', async () => {
    expect(component.emails.length).toBe(0);
    const inputDiscipline = fixture.debugElement.query(By.css('#inputEmails'));
    const event: MatChipInputEvent = {
      input: inputDiscipline.nativeElement,
      value: 'notvalid',
    };
    component.add(event);
    expect(component.emails.length).toBe(0);
  });

  it('should remove an email', async () => {
    const inputDiscipline = fixture.debugElement.query(By.css('#inputEmails'));
    const event: MatChipInputEvent = {
      input: inputDiscipline.nativeElement,
      value: 'johndoe@gmail.com',
    };
    component.add(event);
    expect(component.emails.length).toBe(1);
    component.remove('johndoe@gmail.com');
    expect(component.emails.length).toBe(0);
  });

  it('should not remove not existing emails', async () => {
    expect(component.emails.length).toBe(0);
    component.remove('hello@test.com');
    expect(component.emails.length).toBe(0);
  });

  it('should send invites ', () => {
    const profileService = fixture.debugElement.injector.get(ProfileService);
    const spy = spyOn(profileService, 'sendInvite').and.returnValue(of({}));
    spyOn(component.dialogRef, 'close');
    fixture.detectChanges();
    component.emails = ['test@test.com'];
    component.send();
    expect(component.emails.length).toBe(1);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialogRef', () => {
    spyOn(component.dialogRef, 'close');
    component.onNoClick();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

});

