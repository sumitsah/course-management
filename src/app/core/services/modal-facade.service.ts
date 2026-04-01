import { Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, Subject } from "rxjs";

// export interface ModalConfig {
//     // id: string;
//     component: any; // Can be a component, template, or string
//     data?: any; // Optional data to pass to the modal
// }

@Injectable({
    providedIn: 'root'
})
// export class ModalFacade {
//     private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
//     // private modalSubject = new Subject<ModalConfig | null>();
//     modal$ = this.modalSubject.asObservable().pipe(distinctUntilChanged());

//     private resultSubject = new BehaviorSubject<any>(null);
//     result$ = this.resultSubject.asObservable().pipe(distinctUntilChanged());

//     open(config: ModalConfig) {
//         this.modalSubject.next(config);
//     }

//     close(result?: any) {
//         this.modalSubject.next(null);
//         this.resultSubject.next(result);
//     }
// }
// technique for component communication via service using subjects and observables in large size applications where multiple components need to open/close modals without direct parent-child relationship.
// It helps to decouple the modal logic from the components and centralizes the control of modal state in a single service.
export class ModalFacade {

    private openModalSubject = new Subject<void>();
    openModalObs$ = this.openModalSubject.asObservable();

    private closeModalSubject = new Subject<void>();
    closeModalObs$ = this.closeModalSubject.asObservable();

    openModal(data: any) {
        this.openModalSubject.next(data);
    }

    closeModal() {
        this.closeModalSubject.next();
    }
}

//   private modals: { [key: string]: boolean } = {};

//   openModal(modalId: string) {
//     this.modals[modalId] = true;
//   }

//   closeModal(modalId: string) {
//     this.modals[modalId] = false;
//   }