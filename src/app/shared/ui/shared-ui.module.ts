import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToastBarComponent } from './components/toast-bar/toast-bar.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoadingSpinnerComponent, ToastBarComponent],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, ToastBarComponent]
})
export class SharedUIModule { }
