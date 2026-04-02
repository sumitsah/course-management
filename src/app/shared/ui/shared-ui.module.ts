import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToastBarComponent } from './components/toast-bar/toast-bar.component';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoadingSpinnerComponent, ToastBarComponent, ConfirmationDialogComponent, PagenotfoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [LoadingSpinnerComponent, ToastBarComponent, ConfirmationDialogComponent]
})
export class SharedUIModule { }
