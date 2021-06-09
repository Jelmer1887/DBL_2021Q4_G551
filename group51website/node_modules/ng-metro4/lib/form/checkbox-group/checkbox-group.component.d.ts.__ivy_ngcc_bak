import { ChangeDetectorRef, ElementRef, QueryList } from '@angular/core';
import { ControlBase } from '../control-base';
import { CheckboxComponent } from '../checkbox/checkbox.component';
export declare class CheckboxGroupComponent extends ControlBase<any[]> {
    readonly: boolean;
    options: {
        [title: string]: any;
    };
    checkboxesContent: QueryList<CheckboxComponent>;
    checkboxesView: QueryList<CheckboxComponent>;
    private checkboxes;
    constructor(element: ElementRef, cdRef: ChangeDetectorRef);
    createControl(): Promise<void>;
    private computeInnerValue;
    disable(disabled: boolean): void;
    newValue(): void;
    newClassValue(newClasses: string[], oldClasses: string[]): void;
}
