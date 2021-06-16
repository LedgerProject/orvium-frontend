import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  template: `
    <button [appCopyToClipboard]="'test'"></button>`
})
class TestCopyToClipboardComponent {
}


describe('Directive: CopyToClipboardDirective', () => {

  let component: TestCopyToClipboardComponent;
  let fixture: ComponentFixture<TestCopyToClipboardComponent>;
  let buttonEl: DebugElement;
  let directive: CopyToClipboardDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule],
      declarations: [TestCopyToClipboardComponent, CopyToClipboardDirective]
    })
      .compileComponents();
    fixture = TestBed.createComponent(TestCopyToClipboardComponent);
    component = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('button'));
  });

  it('should verify copy', () => {
    directive = fixture.debugElement.query(By.directive(CopyToClipboardDirective)).injector
      .get(CopyToClipboardDirective) as CopyToClipboardDirective;
    let spy = spyOn(directive, 'copyToClipboard');
    buttonEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
