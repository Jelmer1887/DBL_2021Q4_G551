export declare class DefaultValueAccessor {
    static get(type: any): {
        provide: import("@angular/core").InjectionToken<import("@angular/forms").ControlValueAccessor>;
        useExisting: import("@angular/core").Type<any>;
        multi: boolean;
    };
}
