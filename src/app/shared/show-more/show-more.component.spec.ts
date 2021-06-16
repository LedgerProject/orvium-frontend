import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShowMoreComponent } from './show-more.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ShowMoreComponent', () => {
  let component: ShowMoreComponent;
  let fixture: ComponentFixture<ShowMoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserAnimationsModule],
      declarations: [ShowMoreComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMoreComponent);
    component = fixture.componentInstance;
    component.truncateLength = 2;
    component.text = 'Sample text here!';
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('state to be closed', () => {
    //component.text = 'Sample text here!';
    component.ngOnInit();
    expect(component.state).toContain('closed');
    expect(component.showButtons).toBeTrue();
  });

  it('state to be open', () => {
    component.text = 'Sample';
    component.ngOnInit();
    expect(component.state).toContain('open');
    expect(component.showButtons).toBeFalse();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
