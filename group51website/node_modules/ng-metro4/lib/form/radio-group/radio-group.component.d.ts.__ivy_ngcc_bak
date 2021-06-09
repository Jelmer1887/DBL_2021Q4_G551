import { ChangeDetectorRef, ElementRef, QueryList } from '@angular/core';
import { ControlBase } from '../control-base';
import { RadioComponent } from '../radio/radio.component';
export declare class RadioGroupComponent extends ControlBase<any> {
    options: {
        [title: string]: any;
    };
    radiosContent: QueryList<RadioComponent>;
    radiosView: QueryList<RadioComponent>;
    private radios;
    name: string;
    constructor(element: ElementRef, cdRef: ChangeDetectorRef);
    createControl(): Promise<void>;
    disable(disabled: boolean): void;
    newValue(): void;
    newClassValue(newClasses: string[], oldClasses: string[]): void;
}
