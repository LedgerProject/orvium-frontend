import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FileuploadComponent } from './fileupload.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileuploadComponent', () => {

  let fileupload: FileuploadComponent;
  let fixture: ComponentFixture<FileuploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileuploadComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatIconModule
      ],
    });

    fixture = TestBed.createComponent(FileuploadComponent);
    fileupload = fixture.componentInstance;
  });

  it('should display by default (advanced)', () => {
    fixture.detectChanges();

    const fileuploadEl = fixture.debugElement.query(By.css('div'));
    expect(fileuploadEl).toBeTruthy();
    expect(fileuploadEl.children.length).toEqual(2);
  });

  it('should call onFileSelect (advanced)', () => {
    fixture.detectChanges();
    fileupload.url = ' ';
    let blob: Blob;
    blob = new Blob([JSON.stringify([{
      lastModified: 1533276674178,
      name: 'primeng.txt',
      size: 179,
      type: 'text/plain'
    }])], { type: 'application/json' });
    const blobFile = new File([blob], 'primeng.txt');
    const event = {
      target: { files: [blobFile] },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };

    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();
    expect(fileupload.hasFiles()).toEqual(true);
  });

  it('should call upload (advanced)', () => {
    fileupload.url = ' ';
    fixture.detectChanges();

    let event;
    let blob: Blob;
    blob = new Blob([JSON.stringify([{
      lastModified: 1533276674178,
      name: 'primeng.txt',
      size: 179,
      type: 'text/plain'
    }])], { type: 'application/json' });
    const blobFile = new File([blob], 'primeng.txt');
    event = {
      target: { files: [blobFile] },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    const uploadSpy = spyOn(fileupload, 'upload').and.callThrough();
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();

    expect(uploadSpy).toHaveBeenCalled();
  });

  it('should not push same file', () => {
    fileupload.url = ' ';
    fixture.detectChanges();

    let event;
    let blob: Blob;
    blob = new Blob([JSON.stringify([{
      lastModified: 1533276674178,
      name: 'primeng.txt',
      size: 179,
      type: 'text/plain'
    }])], { type: 'application/json' });
    const blobFile = new File([blob], 'primeng.txt');
    event = {
      target: { files: [blobFile] },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();

    expect(fileupload.files.length).toEqual(1);
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();

    expect(fileupload.files.length).toEqual(1);
  });

  it('should not push when exceeded filelimit', () => {
    fileupload.fileLimit = 1;
    fileupload.url = ' ';
    fixture.detectChanges();

    let event;
    let blob: Blob;
    blob = new Blob([JSON.stringify([
      {
        lastModified: 1533276674178,
        name: 'primeng.txt',
        size: 179,
        type: 'text/plain'
      },
      {
        lastModified: 1533276674179,
        name: 'primeng2.txt',
        size: 123,
        type: 'text/plain'
      },
    ])], { type: 'application/json' });
    const blobFile = new File([blob], 'primeng.txt');
    const blobFile2 = new File([blob], 'primeng2.txt');
    event = {
      target: { files: [blobFile, blobFile2] },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    const uploadSpy = spyOn(fileupload, 'upload').and.callThrough();
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();

    expect(fileupload.isFileLimitExceeded).toBeTruthy();
  });

  it('should call upload with customUpload (advanced)', () => {
    fileupload.customUpload = true;
    fileupload.url = ' ';
    let data: { files?: File[] } = {};
    fileupload.uploadHandler.subscribe((value: { files: File[] }) => data = value);
    fixture.detectChanges();

    let event;
    event = {
      target: {
        files: [{
          lastModified: 1533276674178,
          name: 'primeng.txt',
          size: 179,
          type: 'text/plain'
        }]
      }
    };
    const uploadSpy = spyOn(fileupload, 'upload').and.callThrough();
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();
    expect(uploadSpy).toHaveBeenCalled();
    expect(data.files).toEqual(event.target.files as File[]);
  });

  it('should accept all of multiple given MIME types', () => {
    const mockFile1 = { type: 'application/pdf', name: 'test.pdf' };
    const mockFile2 = { type: 'image/png', name: 'test.png' };

    fileupload.accept = 'application/pdf, image/png';
    expect(fileupload.isFileTypeValid(mockFile1 as File)).toBe(true);
    expect(fileupload.isFileTypeValid(mockFile2 as File)).toBe(true);
  });

  it('should handle wildcards in MIME subtypes', () => {
    const mockFile1 = { type: 'application/pdf', name: 'test.pdf' };
    const mockFile2 = { type: 'image/png', name: 'test.png' };

    fileupload.accept = 'image/*';
    expect(fileupload.isFileTypeValid(mockFile1 as File)).toBe(false);
    expect(fileupload.isFileTypeValid(mockFile2 as File)).toBe(true);
  });
});
