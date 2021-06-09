import { AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
export declare class DialogComponent implements OnChanges, AfterViewInit, OnDestroy {
    private element;
    isOpen: boolean;
    width: string;
    overlay: boolean;
    overlayColor: string;
    overlayAlpha: string;
    overlayClickClose: boolean;
    data: any;
    private dialog;
    closeEvent: EventEmitter<void>;
    dialogObj: any;
    private closeSubject$;
    private classObserver;
    constructor(element: ElementRef);
    open(): Observable<any>;
    close(): void;
    ngAfterViewInit(): void;
    private observeClassValue;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
