import { AfterContentInit, ComponentFactoryResolver, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { M4FormControl } from '../m4-form-control';
import { ControlValueAccessor } from '@angular/forms';
import { ControlBase } from '../control-base';
export declare class DynamicFormControlComponent implements AfterContentInit, OnDestroy, OnChanges, ControlValueAccessor {
    private componentFactoryResolver;
    formControl: M4FormControl<ControlBase<any>>;
    private container;
    private componentRef;
    private componentInstance;
    private onChangeFunction;
    private onTouchedFunction;
    private statusChangeSubscription;
    private componentReady$;
    constructor(componentFactoryResolver: ComponentFactoryResolver);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(obj: any): void;
}
