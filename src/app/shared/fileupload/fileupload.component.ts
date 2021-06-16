import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { AppSnackBarService } from '../../services/app-snack-bar.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
})
export class FileuploadComponent {

  @Input() name = 'file';

  @Input() url?: string;

  @Input() accept?: string;

  @Input() disabled = false;

  @Input() maxFileSize?: number;

  @Input() invalidFileSizeMessageSummary = '{0}: Invalid file size, ';

  @Input() invalidFileSizeMessageDetail = 'maximum upload size is {0}.';

  @Input() invalidFileTypeMessageSummary = '{0}: Invalid file type, ';

  @Input() invalidFileTypeMessageDetail = 'allowed file types: {0}.';

  @Input() invalidFileLimitMessageDetail = 'limit is {0} at most.';

  @Input() invalidFileLimitMessageSummary = 'Maximum number of files exceeded, ';

  @Input() chooseLabel = 'Choose';

  @Input() uploadLabel = 'Upload';

  @Input() cancelLabel = 'Cancel';

  @Input() customUpload = false;

  @Input() fileLimit = 0;

  @Input() uploadedFileCount = 0;

  @Output() beforeUpload: EventEmitter<unknown> = new EventEmitter();

  @Output() send: EventEmitter<unknown> = new EventEmitter();

  @Output() fileUpload: EventEmitter<{ originalEvent: HttpResponse<unknown>, files: File[] }> = new EventEmitter();

  @Output() fileError: EventEmitter<unknown> = new EventEmitter();

  @Output() clear: EventEmitter<void> = new EventEmitter();

  @Output() fileSelect: EventEmitter<unknown> = new EventEmitter();

  @Output() fileProgress: EventEmitter<unknown> = new EventEmitter();

  @Output() uploadHandler: EventEmitter<{ files: File[] }> = new EventEmitter();

  @ViewChild('advancedfileinput') advancedFileInput?: ElementRef;

  @ViewChild('content') content?: ElementRef;
  public progress = 0;
  uploading = false;

  constructor(
    private http: HttpClient,
    private snackBar: AppSnackBarService
  ) {
  }

  public _files: File[] = [];

  get files(): File[] {
    return this._files;
  }

  @Input() set files(files) {
    this._files = [];

    for (const file of files) {
      if (this.validate(file)) {
        this._files.push(file);
      }
    }
  }

  onFileSelect(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    for (let i = 0; files && i < files.length; i++) {
      const file = files[i];
      if (!this.isFileSelected(file)) {
        if (this.validate(file)) {
          this.files.push(file);
        }
      }
    }
    this.fileSelect.emit({ originalEvent: event, files, currentFiles: this.files });

    if (this.fileLimit > 0) {
      this.checkFileLimit();
    }

    if (this.hasFiles() && !this.isFileLimitExceeded()) {
      this.upload();
    }
  }

  isFileSelected(file: File): boolean {
    for (const sFile of this.files) {
      if ((sFile.name + sFile.type + sFile.size) === (file.name + file.type + file.size)) {
        return true;
      }
    }

    return false;
  }

  validate(file: File): boolean {
    if (this.accept && !this.isFileTypeValid(file)) {
      const errorMessage = this.invalidFileTypeMessageDetail.replace('{0}', this.accept);
      this.snackBar.error(errorMessage);
      return false;
    }

    if (this.maxFileSize && file.size > this.maxFileSize) {
      const errorMessage = this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize));
      this.snackBar.error(errorMessage);
      return false;
    }

    return true;
  }

  isFileTypeValid(file: File): boolean {
    if (this.accept) {
      const acceptableTypes = this.accept.split(',').map(type => type.trim());
      for (const type of acceptableTypes) {
        const acceptable = this.isWildcard(type)
          ? this.getTypeClass(file.type) === this.getTypeClass(type)
          : file.type === type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

        if (acceptable) {
          return true;
        }
      }
    }

    return false;
  }

  getTypeClass(fileType: string): string {
    return fileType.substring(0, fileType.indexOf('/'));
  }

  isWildcard(fileType: string): boolean {
    return fileType.indexOf('*') !== -1;
  }

  getFileExtension(file: File): string {
    return '.' + file.name.split('.').pop();
  }

  async upload(): Promise<void> {

    if (this.customUpload) {
      if (this.fileLimit>0) {
        this.uploadedFileCount += this.files.length;
      }

      this.uploadHandler.emit({
        files: this.files
      });
    } else {
      this.uploading = true;
      const formData = new FormData();

      this.beforeUpload.emit({
        formData
      });

      for (const file of this.files) {
        formData.append(this.name, file, file.name);
      }

      const fileObject = this.files[0];

      const file = {
        name: fileObject.name,
        type: fileObject.type,
        size: fileObject.size,
        lastModified: fileObject.lastModified
      };

      if (!this.url) {
        throw new Error('No presigned url configured');
      }

      let res = await this.http.post<{ signedUrl: string }>(this.url, { file }).toPromise();

      this.http.put(res.signedUrl, fileObject, {
        reportProgress: true, observe: 'events'
      }).subscribe(
        (event: HttpEvent<unknown>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.send.emit({
                originalEvent: event,
                formData
              });
              break;
            case HttpEventType.Response:
              this.uploading = false;
              this.progress = 0;

              if (event.status >= 200 && event.status < 300) {
                if (this.fileLimit>0) {
                  this.uploadedFileCount += this.files.length;
                }

                this.fileUpload.emit({ originalEvent: event, files: this.files });
              } else {
                this.fileError.emit({ files: this.files });
                this.snackBar.error(event.statusText);
              }

              this.onClear();
              break;
            case HttpEventType.UploadProgress: {
              if (event.loaded && event.total) {
                this.progress = Math.round((event.loaded * 100) / (event.total));
              }

              this.fileProgress.emit({ originalEvent: event, progress: this.progress });
              break;
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.uploading = false;
          this.fileError.emit({ files: this.files, error });
          this.snackBar.error(error.message);
        }
      );
    }
  }

  onClear(): void {
    this.files = [];
    this.clear.emit();
    this.clearInputElement();
  }

  isFileLimitExceeded(): boolean {
    return (this.fileLimit > 0) && this.fileLimit < this.files.length + this.uploadedFileCount;
  }

  isChooseDisabled(): boolean {
    return (this.fileLimit > 0) && this.fileLimit <= this.files.length + this.uploadedFileCount;
  }

  checkFileLimit(): void {
    if (this.isFileLimitExceeded()) {
      const errorMessage = this.invalidFileLimitMessageDetail.replace('{0}', this.fileLimit.toString());
      this.snackBar.error(errorMessage);
      this.onClear();
    }
  }

  clearInputElement(): void {
    if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
      this.advancedFileInput.nativeElement.value = '';
    }
  }

  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const dm = 3;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
