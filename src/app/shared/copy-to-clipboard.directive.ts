import { Directive, HostListener, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  @Input() message = 'Copied to clipboard';
  @Input('appCopyToClipboard') text = '';

  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar) {
  }

  @HostListener('click') copyToClipboard(): void {
    if (this.clipboard.copy(this.text)) {
      this.snackBar.open(this.message, 'Dismiss', { panelClass: ['info-snackbar'] });
    }
  }
}
