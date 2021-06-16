import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { depositsQueryTest } from '../../shared/test-data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  const depositsQuery = depositsQueryTest;

  const routeSnapshot = {
    snapshot: {
      data: { depositsQuery },
      queryParamMap: convertToParamMap({ query: '/publications' })
    },
    queryParamMap: of(convertToParamMap({ query: 'publications' }))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        NoopAnimationsModule,
        MatPaginatorModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
