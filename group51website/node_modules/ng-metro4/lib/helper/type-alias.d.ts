import { ControlBase } from '../form/control-base';
export declare class TypeAlias {
    static get(type: any): {
        provide: typeof ControlBase;
        useExisting: import("@angular/core").Type<any>;
    };
}
