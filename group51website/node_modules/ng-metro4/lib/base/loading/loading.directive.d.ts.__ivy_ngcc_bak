import { ElementRef, EventEmitter, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
export declare class LoadingDirective implements OnInit, OnChanges {
    private element;
    private renderer;
    subscription: Subscription;
    disabled: boolean;
    stateChange: EventEmitter<boolean>;
    private registeredTeardownLogic;
    constructor(element: ElementRef, renderer: Renderer2);
    private createElement;
    private setDisabled;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
