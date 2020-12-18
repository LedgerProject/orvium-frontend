import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FileuploadComponent implements AfterViewInit, OnDestroy {

  @Input() name: string;

  @Input() url: string;

  @Input() method = 'POST';

  @Input() multiple: boolean;

  @Input() accept: string;

  @Input() disabled: boolean;

  @Input() auto: boolean;

  @Input() withCredentials: boolean;

  @Input() maxFileSize: number;

  @Input() invalidFileSizeMessageSummary = '{0}: Invalid file size, ';

  @Input() invalidFileSizeMessageDetail = 'maximum upload size is {0}.';

  @Input() invalidFileTypeMessageSummary = '{0}: Invalid file type, ';

  @Input() invalidFileTypeMessageDetail = 'allowed file types: {0}.';

  @Input() invalidFileLimitMessageDetail = 'limit is {0} at most.';

  @Input() invalidFileLimitMessageSummary = 'Maximum number of files exceeded, ';

  @Input() previewWidth = 50;

  @Input() chooseLabel = 'Choose';

  @Input() uploadLabel = 'Upload';

  @Input() cancelLabel = 'Cancel';

  @Input() chooseIcon = 'pi pi-plus';

  @Input() uploadIcon = 'pi pi-upload';

  @Input() cancelIcon = 'pi pi-times';

  @Input() showUploadButton = true;

  @Input() showCancelButton = true;

  @Input() headers: HttpHeaders;

  @Input() customUpload: boolean;

  @Input() fileLimit: number;

  @Output() beforeUpload: EventEmitter<any> = new EventEmitter();

  @Output() send: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpload: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onError: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClear: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onProgress: EventEmitter<any> = new EventEmitter();

  @Output() uploadHandler: EventEmitter<any> = new EventEmitter();

  @ViewChild('advancedfileinput') advancedFileInput: ElementRef;

  @ViewChild('basicfileinput') basicFileInput: ElementRef;

  @ViewChild('content') content: ElementRef;

  @Input() set files(files) {
    this._files = [];

    for (const file of files) {
      if (this.validate(file)) {
        if (this.isImage(file)) {
          (file as any).objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
        }

        this._files.push(file);
      }
    }
  }

  get files(): File[] {
    return this._files;
  }

  // tslint:disable-next-line:variable-name
  public _files: File[] = [];

  public progress = 0;

  public dragHighlight: boolean;

  public uploadedFileCount = 0;

  focus: boolean;

  uploading: boolean;

  constructor(private el: ElementRef,
              public sanitizer: DomSanitizer,
              public zone: NgZone,
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      if (this.content) {
        this.content.nativeElement.addEventListener('dragover', this.onDragOver.bind(this));
      }
    });
  }

  onFileSelect(event) {
    if (!this.multiple) {
      this.files = [];
    }

    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    for (const file of files) {
      if (!this.isFileSelected(file)) {
        if (this.validate(file)) {
          if (this.isImage(file)) {
            file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
          }

          this.files.push(file);
        }
      }
    }

    this.onSelect.emit({ originalEvent: event, files, currentFiles: this.files });

    if (this.fileLimit) {
      this.checkFileLimit();
    }

    if (this.hasFiles() && this.auto && !this.isFileLimitExceeded()) {
      this.upload();
    }

    if (event.type === 'drop') {
      this.clearInputElement();
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
      this.snackBar.open(errorMessage, null, { panelClass: ['error-snackbar'] });
      return false;
    }

    if (this.maxFileSize && file.size > this.maxFileSize) {
      const errorMessage = this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize));
      this.snackBar.open(errorMessage, null, { panelClass: ['error-snackbar'] });
      return false;
    }

    return true;
  }

  private isFileTypeValid(file: File): boolean {
    const acceptableTypes = this.accept.split(',').map(type => type.trim());
    for (const type of acceptableTypes) {
      const acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type)
        : file.type === type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

      if (acceptable) {
        return true;
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

  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }

  onImageLoad(img: any) {
    window.URL.revokeObjectURL(img.src);
  }

  upload() {
    if (this.customUpload) {
      if (this.fileLimit) {
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

      this.http.post(this.url, formData, {
        headers: this.headers, reportProgress: true, observe: 'events', withCredentials: this.withCredentials
      }).subscribe((event: HttpEvent<any>) => {
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
                if (this.fileLimit) {
                  this.uploadedFileCount += this.files.length;
                }

                this.onUpload.emit({ originalEvent: event, files: this.files });
              } else {
                this.onError.emit({ files: this.files });
              }

              this.clear();
              break;
            case HttpEventType.UploadProgress: {
              if (event.loaded) {
                this.progress = Math.round((event.loaded * 100) / event.total);
              }

              this.onProgress.emit({ originalEvent: event, progress: this.progress });
              break;
            }
          }
        },
        error => {
          this.uploading = false;
          this.onError.emit({ files: this.files, error });
        });
    }
  }

  clear() {
    this.files = [];
    this.onClear.emit();
    this.clearInputElement();
  }

  remove(event: Event, index: number) {
    this.clearInputElement();
    this.onRemove.emit({ originalEvent: event, file: this.files[index] });
    this.files.splice(index, 1);
  }

  isFileLimitExceeded() {
    if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focus) {
      this.focus = false;
    }

    return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
  }

  isChooseDisabled() {
    return this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount;
  }

  checkFileLimit() {
    if (this.isFileLimitExceeded()) {
      const errorMessage = this.invalidFileLimitMessageDetail.replace('{0}', this.fileLimit.toString());
      this.snackBar.open(errorMessage, null, { panelClass: ['error-snackbar'] });
    }
  }

  clearInputElement() {
    if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
      this.advancedFileInput.nativeElement.value = '';
    }

    if (this.basicFileInput && this.basicFileInput.nativeElement) {
      this.basicFileInput.nativeElement.value = '';
    }
  }

  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  onDragEnter(e) {
    if (!this.disabled) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onDragOver(e) {
    if (!this.disabled) {
      this.renderer.addClass(this.content.nativeElement, 'ui-fileupload-highlight');
      this.dragHighlight = true;
      e.stopPropagation();
      e.preventDefault();
    }
  }

  onDragLeave(event) {
    if (!this.disabled) {
      this.renderer.removeClass(this.content.nativeElement, 'ui-fileupload-highlight');
    }
  }

  onDrop(event) {
    if (!this.disabled) {
      this.renderer.removeClass(this.content.nativeElement, 'ui-fileupload-highlight');
      event.stopPropagation();
      event.preventDefault();

      const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
      const allowDrop = this.multiple || (files && files.length === 1);

      if (allowDrop) {
        this.onFileSelect(event);
      }
    }
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  formatSize(bytes) {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const dm = 3;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ngOnDestroy() {
    if (this.content && this.content.nativeElement) {
      this.content.nativeElement.removeEventListener('dragover', this.onDragOver);
    }
  }
}
