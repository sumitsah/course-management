import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'confirmation-dialog',
  standalone: false,
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  @Input() title: string = 'Confirm';
  @Input() message: string = 'Are you sure?';
  @Input() confirmText: string = 'Yes';
  @Input() cancelText: string = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isOpen = false;

  ngOnInit() {
    // trigger animation after render
    setTimeout(() => this.isOpen = true);
  }

  // ESC key support
  // @HostListener('document:keydown.escape', ['$event'])
  @HostListener('document:keydown.escape')
  onEsc() {
    this.onCancel();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    // this.confirm.emit(); // ❌ mistake (intentional to fix below)
    this.cancel.emit()
  }

  onBackdropClick(event: MouseEvent) {
    // close only if clicked outside dialog
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.onCancel();
    }
  }
}
