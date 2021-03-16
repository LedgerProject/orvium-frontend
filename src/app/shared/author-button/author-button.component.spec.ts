import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorButtonComponent } from './author-button.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Author } from '../../model/orvium';
import { MatIconModule } from '@angular/material/icon';

describe('AuthorButtonComponent', () => {
  let component: AuthorButtonComponent;
  let fixture: ComponentFixture<AuthorButtonComponent>;

  const author: Author = {
    name: 'Joe',
    surname: 'Doe',
    email: 'joe@example.com'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorButtonComponent],
      imports: [
        MatMenuModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorButtonComponent);
    component = fixture.componentInstance;
    component.author = author;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
