import { DepositsListComponent } from './deposits-list.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { ShowMoreComponent } from '../show-more/show-more.component';
import { MatBadgeModule } from '@angular/material/badge';
import { GravatarModule } from 'ngx-gravatar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { depositsQueryTest } from '../test-data';
import { SharedModule } from '../shared.module';

describe('DepositsListComponent', () => {
  let component: DepositsListComponent;
  let fixture: ComponentFixture<DepositsListComponent>;
  let httpTestingController: HttpTestingController;
  let loader: HarnessLoader;

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
      declarations: [DepositsListComponent, ShowMoreComponent],
      imports: [HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        SharedModule,
        GravatarModule,
        MatBadgeModule,
        MatCardModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DepositsListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.deposits = depositsQuery.deposits;
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show authors correctly', async () => {
    const hidden = fixture.debugElement.query(By.css('#hiddenAuthors')).nativeElement.innerText;
    const visible = fixture.debugElement.query(By.css('#authors')).nativeElement.innerText;
    expect(hidden).toBe('Hidden authors');
    expect(visible).toBe('| By John Doe\nWilliam Wallace');
  });
});
