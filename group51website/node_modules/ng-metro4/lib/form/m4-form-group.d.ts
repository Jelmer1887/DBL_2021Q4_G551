import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
export interface FormStyle {
    title?: string | Observable<string>;
    description?: string | Observable<string>;
    hideErrors?: boolean;
    createError?: (error: string) => string | Observable<string>;
}
export declare class M4FormGroup extends FormGroup {
    name: string;
    formStyle?: FormStyle;
    constructor(name: string, controls: {
        [key: string]: AbstractControl;
    }, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, formStyle?: FormStyle);
}
