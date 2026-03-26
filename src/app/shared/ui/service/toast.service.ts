// import { Injectable } from "@angular/core";
// import { BehaviorSubject } from "rxjs";
// import { ToastMessage } from "../../../core/models/error";

// @Injectable({
//     providedIn: 'root'
// })
// export class ToastService {
//     toastBehaviourSubject = new BehaviorSubject<ToastMessage | null>(null);
//     toast$ = this.toastBehaviourSubject.asObservable();

//     showToast(message: string, type: string = 'success') {
//         this.toastBehaviourSubject.next({ message, type });
//         setTimeout(() => {
//             this.toastBehaviourSubject.next(null);
//         }, 3000);
//     }
// }

// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastType } from '../../../core/models/toast';


@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastsSubject.asObservable();

    private get toasts() {
        return this.toastsSubject.value;
    }

    show(message: string, type: ToastType = 'info', duration = 3000) {
        const toast: Toast = {
            id: crypto.randomUUID(),
            message,
            type,
            duration
        };

        this.toastsSubject.next([...this.toasts, toast]);

        // auto-remove
        setTimeout(() => this.remove(toast.id), duration);
    }

    remove(id: string) {
        this.toastsSubject.next(this.toasts.filter(t => t.id !== id));
    }

    clearAll() {
        this.toastsSubject.next([]);
    }
}