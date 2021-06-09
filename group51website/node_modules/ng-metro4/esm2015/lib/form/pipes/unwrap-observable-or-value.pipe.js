import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
let UnwrapObservableOrValuePipe = class UnwrapObservableOrValuePipe {
    constructor(cdRef) {
        this.cdRef = cdRef;
    }
    transform(value) {
        if (!(value instanceof Observable)) {
            return value;
        }
        if (!this.subscription) {
            if (!value) {
                return this.innerValue;
            }
            this.previousValue = value;
            this.subscription = value
                .subscribe((output) => {
                this.innerValue = output;
                this.cdRef.markForCheck();
            });
        }
        if (value !== this.previousValue) {
            this.ngOnDestroy();
            return this.transform(value);
        }
        return this.innerValue;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.innerValue = null;
        this.subscription = null;
    }
};
UnwrapObservableOrValuePipe.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
UnwrapObservableOrValuePipe = __decorate([
    Pipe({
        name: 'unwrapObservableOrValue',
        pure: false
    }),
    __metadata("design:paramtypes", [ChangeDetectorRef])
], UnwrapObservableOrValuePipe);
export { UnwrapObservableOrValuePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW53cmFwLW9ic2VydmFibGUtb3ItdmFsdWUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLW1ldHJvNC8iLCJzb3VyY2VzIjpbImxpYi9mb3JtL3BpcGVzL3Vud3JhcC1vYnNlcnZhYmxlLW9yLXZhbHVlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNoRixPQUFPLEVBQUMsVUFBVSxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBTTlDLElBQWEsMkJBQTJCLEdBQXhDLE1BQWEsMkJBQTJCO0lBT3RDLFlBQW9CLEtBQXdCO1FBQXhCLFVBQUssR0FBTCxLQUFLLENBQW1CO0lBQzVDLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBMEI7UUFDbEMsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLFVBQVUsQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUN4QjtZQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBRTNCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSztpQkFDdEIsU0FBUyxDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2dCQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQztRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7Q0FDRixDQUFBOztZQXRDNEIsaUJBQWlCOztBQVBqQywyQkFBMkI7SUFKdkMsSUFBSSxDQUFDO1FBQ0osSUFBSSxFQUFFLHlCQUF5QjtRQUMvQixJQUFJLEVBQUUsS0FBSztLQUNaLENBQUM7cUNBUTJCLGlCQUFpQjtHQVBqQywyQkFBMkIsQ0E2Q3ZDO1NBN0NZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWYsIE9uRGVzdHJveSwgUGlwZSwgUGlwZVRyYW5zZm9ybX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ3Vud3JhcE9ic2VydmFibGVPclZhbHVlJyxcbiAgcHVyZTogZmFsc2Vcbn0pXG5leHBvcnQgY2xhc3MgVW53cmFwT2JzZXJ2YWJsZU9yVmFsdWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSwgT25EZXN0cm95IHtcblxuICBwcml2YXRlIHByZXZpb3VzVmFsdWU6IE9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSBpbm5lclZhbHVlOiBhbnk7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnl8T2JzZXJ2YWJsZTxhbnk+KTogYW55IHtcbiAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbm5lclZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByZXZpb3VzVmFsdWUgPSB2YWx1ZTtcblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB2YWx1ZVxuICAgICAgICAuc3Vic2NyaWJlKChvdXRwdXQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRoaXMuaW5uZXJWYWx1ZSA9IG91dHB1dDtcbiAgICAgICAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT09IHRoaXMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy5uZ09uRGVzdHJveSgpO1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbm5lclZhbHVlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuaW5uZXJWYWx1ZSA9IG51bGw7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBudWxsO1xuICB9XG59XG4iXX0=