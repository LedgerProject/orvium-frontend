import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicProfileComponent } from './public-profile.component';
import { ActivatedRoute } from '@angular/router';
import { depositDraft, profilePrivateTest } from '../../shared/test-data';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { GravatarModule } from 'ngx-gravatar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { OrviumService } from '../../services/orvium.service';
import { of } from 'rxjs';
import { UserPrivateDTO } from '../../model/api';

describe('PublicProfileComponent', () => {
  let component: PublicProfileComponent;
  let fixture: ComponentFixture<PublicProfileComponent>;
  const deposits = [depositDraft()];
  const profile: UserPrivateDTO = { ...profilePrivateTest(), ...{ isOnboarded: true } };
  const routeSnapshot = { snapshot: { data: { profile } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicProfileComponent],
      imports: [RouterTestingModule, HttpClientModule, MatAutocompleteModule,
        MatCardModule,
        GravatarModule,
        MatInputModule,
        MatIconModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeSnapshot },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileComponent);
    component = fixture.componentInstance;
    const orviumService = fixture.debugElement.injector.get(OrviumService);
    spyOn(orviumService, 'getProfileDeposits').and.returnValue(of(deposits));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
