import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({})),
      state('closed', style({})),
      transition('closed <=> open', [
        style({ opacity: 0.2 }),
        animate('1s ease', style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class ShowMoreComponent implements OnInit {
  @Input() text: string;
  @Input() id: string;
  truncateLength = 50;
  state = 'closed';
  displayText = '';
  showButtons = false;
  inputWords: string[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.inputWords = this.text.split(' ');
    if (this.text && this.inputWords.length > this.truncateLength) {
      this.readMore(false);
      this.showButtons = true;
    } else {
      this.readMore(true);
      this.showButtons = false;
    }
  }

  readMore(flag: boolean): void {
    if (flag) {
      this.state = 'open';
      this.displayText = this.text;
    } else {
      this.state = 'closed';
      this.displayText = this.inputWords.slice(0, this.truncateLength).join(' ') + '...';
    }
  }

  redirection(): void {
    this.router.navigate(['deposits', this.id, 'view']);
  }
}
