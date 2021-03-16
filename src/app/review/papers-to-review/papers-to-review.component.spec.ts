import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PapersToReviewComponent } from './papers-to-review.component';
import { OrviumService } from '../../services/orvium.service';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PapersToReviewComponent', () => {
  let component: PapersToReviewComponent;
  let fixture: ComponentFixture<PapersToReviewComponent>;

  beforeEach(waitForAsync(() => {
    const orviumServiceSpy = jasmine.createSpyObj('OrviumService', ['getPreprintDeposits']);
    orviumServiceSpy.getPreprintDeposits.and.returnValue(of([]));
    TestBed.configureTestingModule({
      declarations: [
        PapersToReviewComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        { provide: OrviumService, useValue: orviumServiceSpy },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PapersToReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
