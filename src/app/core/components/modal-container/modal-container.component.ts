import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core';
import { ModalFacade } from '../../services/modal-facade.service';
import { MODAL_DATA } from '../../const/const';

@Component({
  selector: 'modal-container',
  standalone: false,
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class ModalContainerComponent implements OnInit {
  modalFacade = inject(ModalFacade);
  private injector = inject(Injector);
  // config$ = this.modalFacade.modal$;
  config: any = null;

  ngOnInit() {
    // this.modalFacade.modal$.subscribe(config => {
    //   this.config = config;
    // });
  }
  createInjector(data: any): Injector {
    return Injector.create({
      providers: [{ provide: MODAL_DATA, useValue: data }],
      parent: this.injector
    });
  }
}


// 🎯 Final Mental Model
// Component → open()
//         ↓
// ModalFacade
//         ↓
// ModalContainer
//         ↓
// Dynamic Component
//         ↓
// close(result)
//         ↓
// result$
//         ↓
// Component reacts

// Mental Model
// Default → "Check everything just in case"
// OnPush → "Check only when necessary"
// Async → "Tell Angular exactly when necessary"

// Why This Matters in Real Apps

// In large apps:

// ✔ Better FPS (smooth UI)
// ✔ Less CPU usage
// ✔ Scales to hundreds of components
// ✔ Cleaner reactive architecture

// Default → Teacher checks every student every minute
// OnPush → Students raise hand when needed
// Async → Bell rings when something changes

// Default → Teacher checks every student every minute
// OnPush → Students raise hand when needed
// Async → Bell rings when something changes