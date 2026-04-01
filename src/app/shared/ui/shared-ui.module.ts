import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToastBarComponent } from './components/toast-bar/toast-bar.component';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [LoadingSpinnerComponent, ToastBarComponent, ConfirmationDialogComponent],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, ToastBarComponent, ConfirmationDialogComponent]
})
export class SharedUIModule { }
