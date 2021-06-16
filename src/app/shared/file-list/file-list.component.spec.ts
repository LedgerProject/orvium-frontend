import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListComponent } from './file-list.component';
import { MatTableModule } from '@angular/material/table';

describe('FileListComponent', () => {
  let component: FileListComponent;
  let fixture: ComponentFixture<FileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileListComponent],
      imports: [
        MatTableModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
