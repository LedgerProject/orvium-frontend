import { Component, Input, OnInit } from '@angular/core';
import { Author } from '../../model/orvium';

@Component({
  selector: 'app-author-button',
  templateUrl: './author-button.component.html',
  styleUrls: ['./author-button.component.scss']
})
export class AuthorButtonComponent implements OnInit {
  @Input() author: Author;

  public showMenu = false;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.author) {
      throw new TypeError('The input "author" is required');
    }

    if (this.author.email || this.author.orcid || (this.author.credit && this.author.credit.length > 0)) {
      this.showMenu = true;
    }
  }

}
