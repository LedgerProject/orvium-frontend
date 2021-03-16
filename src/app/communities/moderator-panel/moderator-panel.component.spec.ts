import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorPanelComponent } from './moderator-panel.component';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Community } from '../../model/orvium';
import { of } from 'rxjs';

describe('ModeratorPanelComponent', () => {
  let component: ModeratorPanelComponent;
  let fixture: ComponentFixture<ModeratorPanelComponent>;

  const community: Community = {
    _id: '123412341234',
    name: 'Delft University of Technology (TU Delft)',
    description: 'Top education and research are at the heart of the oldest and largest technical university in the Netherlands. ' +
      'Our 8 faculties offer 16 bachelors and more than 30 masters programmes. ' +
      'Our more than 25,000 students and 6,000 employees share a fascination for science, design and technology. ' +
      'Our common mission: impact for a better society.',
    country: 'Delft, Netherlands',
    twitterURL: 'https://twitter.com/tudelft',
    facebookURL: 'https://www.facebook.com/TUDelft/',
    websiteURL: 'https://www.tudelft.nl/',
    users: [],
    logoURL: '',
    acknowledgement: 'Follow the community guidelines',
    guidelinesURL: '',
  };
  const routeSnapshot = { data: of({ community }) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorPanelComponent],
      imports: [
        MatCardModule,
        RouterTestingModule,
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeratorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
