import { Component, inject } from '@angular/core';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'toast-bar',
  standalone: false,
  templateUrl: './toast-bar.component.html',
  styleUrl: './toast-bar.component.css'
})
export class ToastBarComponent {
  toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  remove(id: string) {
    this.toastService.remove(id);
  }
}
