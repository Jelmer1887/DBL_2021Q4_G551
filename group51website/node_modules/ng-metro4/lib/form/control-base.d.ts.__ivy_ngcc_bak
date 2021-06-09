import { ControlValueAccessor } from '@angular/forms';
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
export declare abstract class ControlBase<T> implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
    mainElement: ElementRef;
    private cdRef;
    private classObserver;
    private disabled;
    private currentClasses;
    innerValue: T;
    disableUpdate: boolean;
    touchCallback: () => void;
    changeCallback: (currentValue: T) => void;
    constructor(mainElement: ElementRef, cdRef: ChangeDetectorRef);
    private observeClassValue;
    abstract newClassValue(newClasses: string[], oldClasses: string[]): any;
    changeValue(newValue: T, callback?: boolean): void;
    registerOnChange(fn: (v: T) => void): void;
    registerOnTouched(fn: () => void): void;
    abstract disable(disabled: boolean): any;
    setDisabledState(isDisabled: boolean): void;
    abstract newValue(): any;
    callNewValue(): void;
    writeValue(newValue: T): void;
    abstract createControl(): Promise<void>;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    updateProperty(key: keyof this, newValue: any): void;
}
