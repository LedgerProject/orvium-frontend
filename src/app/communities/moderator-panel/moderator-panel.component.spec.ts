import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorPanelComponent } from './moderator-panel.component';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { communityTest } from '../../shared/test-data';
import { CommunityDTO } from '../../model/api';
import { OrvAccessDeniedComponent } from '@orvium/ux-components';

describe('ModeratorPanelComponent', () => {
  let component: ModeratorPanelComponent;
  let fixture: ComponentFixture<ModeratorPanelComponent>;

  const community: CommunityDTO = communityTest();
  const routeSnapshot = { data: of({ community }) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorPanelComponent, OrvAccessDeniedComponent],
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
