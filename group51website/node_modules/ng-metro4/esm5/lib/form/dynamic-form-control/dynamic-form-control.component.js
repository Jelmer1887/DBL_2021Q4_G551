import { __decorate, __metadata } from "tslib";
import { AfterContentInit, Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { M4FormControl } from '../m4-form-control';
import { filter, startWith, take } from 'rxjs/operators';
import { asapScheduler, BehaviorSubject } from 'rxjs';
import { DefaultValueAccessor } from '../../helper/default-value-accessor';
import { TypeAlias } from '../../helper/type-alias';
var DynamicFormControlComponent = /** @class */ (function () {
    function DynamicFormControlComponent(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.componentReady$ = new BehaviorSubject(false);
    }
    DynamicFormControlComponent_1 = DynamicFormControlComponent;
    DynamicFormControlComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.ngOnDestroy();
        var factory = this.componentFactoryResolver.resolveComponentFactory(this.formControl.controlType);
        this.componentRef = this.container.createComponent(factory);
        this.componentInstance = this.componentRef.instance;
        this.componentInstance.registerOnChange(this.onChangeFunction);
        this.componentInstance.registerOnTouched(this.onTouchedFunction);
        if (this.formControl.controlOptions) {
            Object.keys(this.formControl.controlOptions).forEach(function (key) {
                _this.componentInstance.updateProperty(key, _this.formControl.controlOptions[key]);
            });
        }
        this.statusChangeSubscription = this.formControl.statusChanges.pipe(startWith(this.formControl.status))
            .subscribe(function (state) {
            if (_this.formControl.pristine) {
                return;
            }
            var validClasses = ['success'];
            var invalidClasses = ['alert'];
            var newClassValue = state === 'INVALID' ? invalidClasses : validClasses;
            var oldClassValue = state === 'INVALID' ? validClasses : invalidClasses;
            _this.componentInstance.newClassValue(newClassValue, oldClassValue);
        });
        asapScheduler.schedule(function () {
            _this.componentReady$.next(true);
            asapScheduler.schedule(function () {
                _this.formControl.markAsPristine();
            });
        });
    };
    DynamicFormControlComponent.prototype.ngOnDestroy = function () {
        this.componentReady$.next(false);
        if (this.statusChangeSubscription) {
            this.statusChangeSubscription.unsubscribe();
        }
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
            this.componentInstance = null;
        }
    };
    DynamicFormControlComponent.prototype.ngOnChanges = function (changes) {
        this.ngAfterContentInit();
    };
    DynamicFormControlComponent.prototype.registerOnChange = function (fn) {
        this.onChangeFunction = fn;
    };
    DynamicFormControlComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedFunction = fn;
    };
    DynamicFormControlComponent.prototype.setDisabledState = function (isDisabled) {
        var _this = this;
        this.componentReady$.pipe(filter(function (v) { return v; }), take(1)).subscribe(function () {
            _this.componentInstance.setDisabledState(isDisabled);
        });
    };
    DynamicFormControlComponent.prototype.writeValue = function (obj) {
        var _this = this;
        this.componentReady$.pipe(filter(function (v) { return v; }), take(1)).subscribe(function () {
            _this.componentInstance.writeValue(obj);
        });
    };
    var DynamicFormControlComponent_1;
    DynamicFormControlComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", M4FormControl)
    ], DynamicFormControlComponent.prototype, "formControl", void 0);
    __decorate([
        ViewChild('container', { read: ViewContainerRef, static: true }),
        __metadata("design:type", ViewContainerRef)
    ], DynamicFormControlComponent.prototype, "container", void 0);
    DynamicFormControlComponent = DynamicFormControlComponent_1 = __decorate([
        Component({
            selector: 'm4-dynamic-form-control',
            template: "<div class=\"form-group\" [class.mt-1]=\"formControl.index > 0\">\n  <label *ngIf=\"formControl?.controlStyle?.label\"\n         [innerHTML]=\"formControl.controlStyle.label | unwrapObservableOrValue | trustHtml\"></label>\n  <ng-template #container></ng-template>\n  <small class=\"text-muted\" *ngIf=\"formControl?.controlStyle?.description\"\n         [innerHTML]=\"formControl.controlStyle.description | unwrapObservableOrValue | trustHtml\">\n  </small>\n\n  <ng-container *ngIf=\"!(formControl?.controlStyle?.hideErrors) && formControl.errors && formControl.dirty\">\n    <ul class=\"unstyled-list fg-red text-small m-1\">\n      <li *ngFor=\"let error of formControl.errors | errorDisplay: formControl.fieldName + '.'\">\n        <span *ngIf=\"formControl?.controlStyle?.createError; else defaultErrorBlock\"\n              [innerHTML]=\"formControl.controlStyle.createError | executeFunctionOnce:error\n              | unwrapObservableOrValue | trustHtml\">\n        </span>\n\n        <ng-template #defaultErrorBlock>\n          {{error}}\n        </ng-template>\n      </li>\n    </ul>\n  </ng-container>\n</div>\n",
            providers: [DefaultValueAccessor.get(DynamicFormControlComponent_1), TypeAlias.get(DynamicFormControlComponent_1)],
            styles: [""]
        }),
        __metadata("design:paramtypes", [ComponentFactoryResolver])
    ], DynamicFormControlComponent);
    return DynamicFormControlComponent;
}());
export { DynamicFormControlComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1mb3JtLWNvbnRyb2wuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vZHluYW1pYy1mb3JtLWNvbnRyb2wvZHluYW1pYy1mb3JtLWNvbnRyb2wuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsWUFBWSxFQUNaLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULGFBQWEsRUFDYixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUVqRCxPQUFPLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsYUFBYSxFQUFFLGVBQWUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFRbEQ7SUFjRSxxQ0FBb0Isd0JBQWtEO1FBQWxELDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFGOUQsb0JBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztJQUVZLENBQUM7b0NBZGhFLDJCQUEyQjtJQWdCdEMsd0RBQWtCLEdBQWxCO1FBQUEsaUJBcUNDO1FBcENDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQW1CLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFD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LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbXBvbmVudFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge000Rm9ybUNvbnRyb2x9IGZyb20gJy4uL200LWZvcm0tY29udHJvbCc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge2ZpbHRlciwgc3RhcnRXaXRoLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge2FzYXBTY2hlZHVsZXIsIEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7Q29udHJvbEJhc2V9IGZyb20gJy4uL2NvbnRyb2wtYmFzZSc7XG5pbXBvcnQge0RlZmF1bHRWYWx1ZUFjY2Vzc29yfSBmcm9tICcuLi8uLi9oZWxwZXIvZGVmYXVsdC12YWx1ZS1hY2Nlc3Nvcic7XG5pbXBvcnQge1R5cGVBbGlhc30gZnJvbSAnLi4vLi4vaGVscGVyL3R5cGUtYWxpYXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtNC1keW5hbWljLWZvcm0tY29udHJvbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9keW5hbWljLWZvcm0tY29udHJvbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2R5bmFtaWMtZm9ybS1jb250cm9sLmNvbXBvbmVudC5jc3MnXSxcbiAgcHJvdmlkZXJzOiBbRGVmYXVsdFZhbHVlQWNjZXNzb3IuZ2V0KER5bmFtaWNGb3JtQ29udHJvbENvbXBvbmVudCksIFR5cGVBbGlhcy5nZXQoRHluYW1pY0Zvcm1Db250cm9sQ29tcG9uZW50KV0sXG59KVxuZXhwb3J0IGNsYXNzIER5bmFtaWNGb3JtQ29udHJvbENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIGZvcm1Db250cm9sOiBNNEZvcm1Db250cm9sPENvbnRyb2xCYXNlPGFueT4+O1xuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHtyZWFkOiBWaWV3Q29udGFpbmVyUmVmLCBzdGF0aWM6IHRydWV9KSBwcml2YXRlIGNvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHJpdmF0ZSBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxDb250cm9sQmFzZTxhbnk+PjtcbiAgcHJpdmF0ZSBjb21wb25lbnRJbnN0YW5jZTogQ29udHJvbEJhc2U8YW55PjtcblxuICBwcml2YXRlIG9uQ2hhbmdlRnVuY3Rpb246IGFueTtcbiAgcHJpdmF0ZSBvblRvdWNoZWRGdW5jdGlvbjogYW55O1xuXG4gIHByaXZhdGUgc3RhdHVzQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJpdmF0ZSBjb21wb25lbnRSZWFkeSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7IH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5uZ09uRGVzdHJveSgpO1xuXG4gICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5PENvbnRyb2xCYXNlPGFueT4+KHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbFR5cGUpO1xuICAgIHRoaXMuY29tcG9uZW50UmVmID0gdGhpcy5jb250YWluZXIuY3JlYXRlQ29tcG9uZW50PENvbnRyb2xCYXNlPGFueT4+KGZhY3RvcnkpO1xuICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2UgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcblxuICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2UucmVnaXN0ZXJPbkNoYW5nZSh0aGlzLm9uQ2hhbmdlRnVuY3Rpb24pO1xuICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2UucmVnaXN0ZXJPblRvdWNoZWQodGhpcy5vblRvdWNoZWRGdW5jdGlvbik7XG5cbiAgICBpZiAodGhpcy5mb3JtQ29udHJvbC5jb250cm9sT3B0aW9ucykge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5mb3JtQ29udHJvbC5jb250cm9sT3B0aW9ucykuZm9yRWFjaCgoa2V5OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZS51cGRhdGVQcm9wZXJ0eShrZXksIHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbE9wdGlvbnNba2V5XSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXR1c0NoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuZm9ybUNvbnRyb2wuc3RhdHVzQ2hhbmdlcy5waXBlKHN0YXJ0V2l0aCh0aGlzLmZvcm1Db250cm9sLnN0YXR1cykpXG4gICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5mb3JtQ29udHJvbC5wcmlzdGluZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbGlkQ2xhc3NlcyA9IFsnc3VjY2VzcyddO1xuICAgICAgICBjb25zdCBpbnZhbGlkQ2xhc3NlcyA9IFsnYWxlcnQnXTtcblxuICAgICAgICBjb25zdCBuZXdDbGFzc1ZhbHVlID0gc3RhdGUgPT09ICdJTlZBTElEJyA/IGludmFsaWRDbGFzc2VzIDogdmFsaWRDbGFzc2VzO1xuICAgICAgICBjb25zdCBvbGRDbGFzc1ZhbHVlID0gc3RhdGUgPT09ICdJTlZBTElEJyA/IHZhbGlkQ2xhc3NlcyA6IGludmFsaWRDbGFzc2VzO1xuICAgICAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlLm5ld0NsYXNzVmFsdWUobmV3Q2xhc3NWYWx1ZSwgb2xkQ2xhc3NWYWx1ZSk7XG4gICAgICB9KTtcblxuICAgIGFzYXBTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWFkeSQubmV4dCh0cnVlKTtcblxuICAgICAgYXNhcFNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wubWFya0FzUHJpc3RpbmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRSZWFkeSQubmV4dChmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5zdGF0dXNDaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3RhdHVzQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IG51bGw7XG4gICAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5uZ0FmdGVyQ29udGVudEluaXQoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2VGdW5jdGlvbiA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkRnVuY3Rpb24gPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50UmVhZHkkLnBpcGUoZmlsdGVyKHYgPT4gdiksIHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlLnNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZCk7XG4gICAgfSk7XG4gIH1cblxuICB3cml0ZVZhbHVlKG9iajogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRSZWFkeSQucGlwZShmaWx0ZXIodiA9PiB2KSwgdGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2Uud3JpdGVWYWx1ZShvYmopO1xuICAgIH0pO1xuICB9XG59XG4iXX0=