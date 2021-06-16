import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar/snack-bar-config';

@Injectable({
  providedIn: 'root'
})
export class AppSnackBarService {
  constructor(private snackBar: MatSnackBar) {
  }

  info(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, config || { panelClass: ['ok-snackbar'] });
  }

  warning(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, config || { panelClass: ['warning-snackbar'] });
  }

  error(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, config || { panelClass: ['error-snackbar'] });
  }
}
