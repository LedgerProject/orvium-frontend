import { Component, Input } from '@angular/core';
import { CallForPapers } from '../../model/api';

@Component({
  selector: 'app-call-for-papers',
  templateUrl: './call-for-papers.component.html',
  styleUrls: ['./call-for-papers.component.scss']
})
export class CallForPapersComponent {

  @Input() callForPapers?: CallForPapers;

  constructor() {
  }

}
