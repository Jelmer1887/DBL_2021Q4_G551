import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { ControlBase } from './control-base';
export interface ControlStyle {
    label?: string | Observable<string>;
    description?: string | Observable<string>;
    hideErrors?: boolean;
    createError?: (error: string) => string | Observable<string>;
}
export declare class M4FormControl<T extends ControlBase<any>> extends FormControl {
    controlType: new (...args: any[]) => T;
    controlOptions?: Partial<T>;
    controlStyle?: ControlStyle;
    fieldName: string;
    index: number;
    constructor(controlType: new (...args: any[]) => T, formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, controlOptions?: Partial<T>, controlStyle?: ControlStyle);
}
