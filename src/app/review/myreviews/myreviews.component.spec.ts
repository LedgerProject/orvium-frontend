import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MyreviewsComponent } from './myreviews.component';
import { of } from 'rxjs';
import { OrviumService } from '../../services/orvium.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';

describe('MyreviewsComponent', () => {
  let component: MyreviewsComponent;
  let fixture: ComponentFixture<MyreviewsComponent>;

  beforeEach(waitForAsync(() => {
    const orviumServiceSpy = jasmine.createSpyObj('OrviumService', ['getMyReviews']);
    orviumServiceSpy.getMyReviews.and.returnValue(of(Promise.resolve({})));

    TestBed.configureTestingModule({
      declarations: [MyreviewsComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, MatTableModule],
      providers: [
        { provide: OrviumService, useValue: orviumServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
