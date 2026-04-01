import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom, Subject, take } from "rxjs";

export interface ConfirmConfig {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

@Injectable({
    providedIn: 'root'
})

export class ConfirmationDialogService {
    private confirmState = new BehaviorSubject<ConfirmConfig | null>(null);
    confirmState$ = this.confirmState.asObservable();

    private responseSubject!: Subject<boolean>;

    confirm(config: ConfirmConfig) {
        this.responseSubject = new Subject<boolean>();
        this.confirmState.next(config);
        return this.responseSubject.asObservable();
    }

    // ✅ NEW: Promise-based method
    confirmAsync(config: ConfirmConfig): Promise<boolean> {
        return firstValueFrom(
            this.confirm(config).pipe(take(1))
        );
    }

    confirmYes() {
        this.responseSubject.next(true);
        this.responseSubject.complete();
        this.confirmState.next(null);
    }

    confirmNo() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.confirmState.next(null);
    }
} 