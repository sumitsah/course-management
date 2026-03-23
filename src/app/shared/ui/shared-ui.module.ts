import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToastBarComponent } from './components/toast-bar/toast-bar.component';
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  declarations: [LoadingSpinnerComponent, ToastBarComponent],
  imports: [BrowserModule],
  exports: [LoadingSpinnerComponent, ToastBarComponent]
})
export class SharedUIModule { }
