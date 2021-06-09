import { OnChanges } from '@angular/core';
import { ControlBase } from '../control-base';
export interface Option {
    title: string;
    dataTemplate: string;
    value: any;
}
export declare class SelectComponent extends ControlBase<object | object[]> implements OnChanges {
    options: {
        [key: string]: (string | {
            [key: string]: string;
        });
    } | (Option | {
        groupName: string;
        options: Option[];
    })[];
    multiple: boolean;
    duration: number;
    prepend: string;
    append: string;
    dropHeight: number;
    filter: boolean;
    filterPlaceholder: string;
    clsSelect: string;
    clsPrepend: string;
    clsAppend: string;
    clsOption: string;
    clsOptionGroup: string;
    clsDropList: string;
    clsSelectedItem: string;
    clsSelectedItemRemover: string;
    private input;
    private select;
    private clonedElement;
    createControl(): Promise<void>;
    disable(disabled: boolean): void;
    newValue(): void;
    newClassValue(newClasses: string[], oldClasses: string[]): void;
}
