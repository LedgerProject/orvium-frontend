import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FileuploadComponent } from './fileupload.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

// ts-ignore
describe('FileuploadComponent', () => {

  let fileupload: FileuploadComponent;
  let fixture: ComponentFixture<FileuploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileuploadComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientModule,
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

  it('should change style, styleClass, chooseLabel, uploadLabel, cancelLabel, showUploadButton and showCancelButton (advanced)', () => {
    fileupload.chooseLabel = 'chooseLabel';
    fileupload.uploadLabel = 'uploadLabel';
    fileupload.cancelLabel = 'cancelLabel';
    fixture.detectChanges();

    const fileuploadEl = fixture.debugElement.query(By.css('div'));
    const chooseButton = fixture.debugElement.queryAll(By.css('button'))[0];
    const uploadButton = fixture.debugElement.queryAll(By.css('button'))[1];
    const cancelButton = fixture.debugElement.queryAll(By.css('button'))[2];
    expect(fileuploadEl).toBeTruthy();
    expect(uploadButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
    expect(uploadButton.nativeElement.textContent).toEqual('uploadLabel');
    expect(cancelButton.nativeElement.textContent).toEqual('cancelLabel');
    expect(chooseButton.nativeElement.textContent).toEqual('chooseLabel');
  });

  it('should call onFileSelect (advanced)', () => {
    fixture.detectChanges();


    const event = {
      target: {
        files: [{
          lastModified: 1533276674178,
          name: 'primeng.txt',
          size: 179,
          type: 'text/plain'
        }]
      }
    };

    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();

    const uploadButton = fixture.debugElement.queryAll(By.css('button'))[0];
    const cancelButton = fixture.debugElement.queryAll(By.css('button'))[1];
    const fileUploadRow = fixture.debugElement.query(By.css('.ui-fileupload-row'));
    const fileNameEl = fileUploadRow.children[1];
    const fileSizeEl = fileUploadRow.children[2];
    const removeButtonEl = fileUploadRow.query(By.css('button'));
    expect(fileUploadRow).toBeTruthy();
    expect(fileNameEl).toBeTruthy();
    expect(fileNameEl).toBeTruthy();
    expect(removeButtonEl).toBeTruthy();
    expect(fileNameEl.nativeElement.textContent).toEqual('primeng.txt');
    expect(fileSizeEl.nativeElement.textContent).toEqual('179 B');
    expect(fileupload.hasFiles()).toEqual(true);
    expect(uploadButton.nativeElement.disabled).toEqual(false);
    expect(cancelButton.nativeElement.disabled).toEqual(false);
  });

  it('should call upload (advanced)', () => {
    fileupload.auto = true;
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
    fileupload.multiple = true;
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
    fileupload.multiple = true;
    fileupload.fileLimit = 1;
    fileupload.auto = true;
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

    expect(fileupload.files.length).toEqual(2);
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('should call upload with customUpload (advanced)', () => {
    fileupload.auto = true;
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

  it('should call onDrageEnter onDragLeave onDrop and onFileSelect (advanced)', () => {
    fileupload.customUpload = true;
    fileupload.url = ' ';
    fileupload.multiple = true;
    fixture.detectChanges();

    let event: unknown;
    event = {
      target: {
        files: [{
          lastModified: 1533276674178,
          name: 'primeng.txt',
          size: 179,
          type: 'text/plain'
        }]
      },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    let event2: unknown;
    event2 = {
      target: {
        files: [{
          lastModified: 1533276684178,
          name: 'prime.txt',
          size: 179,
          type: 'text/plain'
        }]
      },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();
    const onDragEnterSpy = spyOn(fileupload, 'onDragEnter').and.callThrough();
    const onDragLeaveSpy = spyOn(fileupload, 'onDragLeave').and.callThrough();
    const onDropSpy = spyOn(fileupload, 'onDrop').and.callThrough();
    const onFileSelectSpy = spyOn(fileupload, 'onFileSelect').and.callThrough();
    fileupload.onDragEnter(event as DragEvent);
    fileupload.onDragOver(event as DragEvent);
    fixture.detectChanges();

    const contentEl = fixture.debugElement.query(By.css('.ui-fileupload-content'));
    expect(fileupload.dragHighlight).toEqual(true);
    expect(contentEl.nativeElement.className).toContain('ui-fileupload-highlight');
    expect(onDragEnterSpy).toHaveBeenCalled();
    fileupload.onDragLeave(event as DragEvent);
    fixture.detectChanges();

    expect(onDragLeaveSpy).toHaveBeenCalled();
    expect(contentEl.nativeElement.className).not.toContain('ui-fileupload-highlight');
    // @ts-ignore
    fileupload.onDrop(event2);
    fixture.detectChanges();

    expect(onDropSpy).toHaveBeenCalled();
    expect(onFileSelectSpy).toHaveBeenCalled();
    expect(fileupload.files.length).toEqual(2);
  });

  it('should call clear and remove (advanced)', () => {
    fileupload.customUpload = true;
    fileupload.url = ' ';
    fileupload.multiple = true;
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
      },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    let event2;
    event2 = {
      target: {
        files: [{
          lastModified: 1533276684178,
          name: 'prime.txt',
          size: 179,
          type: 'text/plain'
        }]
      },
      stopPropagation(): void {
      },
      preventDefault(): void {
      }
    };
    const removeSpy = spyOn(fileupload, 'onRemove').and.callThrough();
    const clearSpy = spyOn(fileupload, 'onClear').and.callThrough();
    // @ts-ignore
    fileupload.onFileSelect(event);
    // @ts-ignore
    fileupload.onFileSelect(event2);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const firstElRemoveButton = buttons[3];
    firstElRemoveButton.nativeElement.click();
    fixture.detectChanges();

    expect(fileupload.files.length).toEqual(1);
    expect(removeSpy).toHaveBeenCalled();
    // @ts-ignore
    fileupload.onFileSelect(event);
    fixture.detectChanges();

    const clearButton = buttons[2];
    clearButton.nativeElement.click();
    fixture.detectChanges();

    expect(fileupload.files.length).toEqual(0);
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should accept all of multiple given MIME types', () => {
    const mockFile1 = { type: 'application/pdf', name: 'test.pdf' };
    const mockFile2 = { type: 'image/png', name: 'test.png' };

    fileupload.accept = 'application/pdf, image/png';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((fileupload as any).isFileTypeValid(mockFile1)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((fileupload as any).isFileTypeValid(mockFile2)).toBe(true);
  });

  it('should handle wildcards in MIME subtypes', () => {
    const mockFile1 = { type: 'application/pdf', name: 'test.pdf' };
    const mockFile2 = { type: 'image/png', name: 'test.png' };

    fileupload.accept = 'image/*';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((fileupload as any).isFileTypeValid(mockFile1)).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((fileupload as any).isFileTypeValid(mockFile2)).toBe(true);
  });
});
