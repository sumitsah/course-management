import { NgModule } from "@angular/core";
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { CommonModule } from "@angular/common";
import { FormValidationComponent } from './components/form-validation/form-validation.component';

@NgModule({
  declarations: [
    ModalContainerComponent,
    FormValidationComponent
  ],
  imports: [CommonModule],
  exports: [
    ModalContainerComponent,
    FormValidationComponent
  ]
})

export class CoreModule {

}