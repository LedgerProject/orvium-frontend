import { Component, EventEmitter, Input, Output } from '@angular/core';
import { canOpenOverleaf } from '../shared-functions';
import { FileMetadata } from '../../model/api';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent {
  @Input() files: FileMetadata[] = [];
  @Input() baseHref?: string;
  @Input() readonly = true;

  @Output() fileDeleted: EventEmitter<string> = new EventEmitter();

  canOpenOverleaf = canOpenOverleaf;
  columnsToDisplay = ['icon', 'filename', 'length', 'actions'];

  constructor() {
  }

  deleteFile(filename: string): void {
    this.fileDeleted.emit(filename);
  }
}
