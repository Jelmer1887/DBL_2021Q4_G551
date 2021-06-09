import { ChangeDetectorRef, OnDestroy, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
export declare class UnwrapObservableOrValuePipe implements PipeTransform, OnDestroy {
    private cdRef;
    private previousValue;
    private innerValue;
    private subscription;
    constructor(cdRef: ChangeDetectorRef);
    transform(value: any | Observable<any>): any;
    ngOnDestroy(): void;
}
