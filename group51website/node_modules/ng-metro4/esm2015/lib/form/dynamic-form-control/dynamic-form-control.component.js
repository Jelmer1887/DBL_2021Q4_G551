var DynamicFormControlComponent_1;
import { __decorate, __metadata } from "tslib";
import { AfterContentInit, Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { M4FormControl } from '../m4-form-control';
import { filter, startWith, take } from 'rxjs/operators';
import { asapScheduler, BehaviorSubject } from 'rxjs';
import { DefaultValueAccessor } from '../../helper/default-value-accessor';
import { TypeAlias } from '../../helper/type-alias';
let DynamicFormControlComponent = DynamicFormControlComponent_1 = class DynamicFormControlComponent {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.componentReady$ = new BehaviorSubject(false);
    }
    ngAfterContentInit() {
        this.ngOnDestroy();
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.formControl.controlType);
        this.componentRef = this.container.createComponent(factory);
        this.componentInstance = this.componentRef.instance;
        this.componentInstance.registerOnChange(this.onChangeFunction);
        this.componentInstance.registerOnTouched(this.onTouchedFunction);
        if (this.formControl.controlOptions) {
            Object.keys(this.formControl.controlOptions).forEach((key) => {
                this.componentInstance.updateProperty(key, this.formControl.controlOptions[key]);
            });
        }
        this.statusChangeSubscription = this.formControl.statusChanges.pipe(startWith(this.formControl.status))
            .subscribe((state) => {
            if (this.formControl.pristine) {
                return;
            }
            const validClasses = ['success'];
            const invalidClasses = ['alert'];
            const newClassValue = state === 'INVALID' ? invalidClasses : validClasses;
            const oldClassValue = state === 'INVALID' ? validClasses : invalidClasses;
            this.componentInstance.newClassValue(newClassValue, oldClassValue);
        });
        asapScheduler.schedule(() => {
            this.componentReady$.next(true);
            asapScheduler.schedule(() => {
                this.formControl.markAsPristine();
            });
        });
    }
    ngOnDestroy() {
        this.componentReady$.next(false);
        if (this.statusChangeSubscription) {
            this.statusChangeSubscription.unsubscribe();
        }
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
            this.componentInstance = null;
        }
    }
    ngOnChanges(changes) {
        this.ngAfterContentInit();
    }
    registerOnChange(fn) {
        this.onChangeFunction = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedFunction = fn;
    }
    setDisabledState(isDisabled) {
        this.componentReady$.pipe(filter(v => v), take(1)).subscribe(() => {
            this.componentInstance.setDisabledState(isDisabled);
        });
    }
    writeValue(obj) {
        this.componentReady$.pipe(filter(v => v), take(1)).subscribe(() => {
            this.componentInstance.writeValue(obj);
        });
    }
};
DynamicFormControlComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver }
];
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
export { DynamicFormControlComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1mb3JtLWNvbnRyb2wuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vZHluYW1pYy1mb3JtLWNvbnRyb2wvZHluYW1pYy1mb3JtLWNvbnRyb2wuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixTQUFTLEVBQ1Qsd0JBQXdCLEVBQ3hCLFlBQVksRUFDWixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxhQUFhLEVBQ2IsU0FBUyxFQUNULGdCQUFnQixFQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFFakQsT0FBTyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGFBQWEsRUFBRSxlQUFlLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFFbEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBUWxELElBQWEsMkJBQTJCLG1DQUF4QyxNQUFhLDJCQUEyQjtJQWN0QyxZQUFvQix3QkFBa0Q7UUFBbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUY5RCxvQkFBZSxHQUFHLElBQUksZUFBZSxDQUFVLEtBQUssQ0FBQyxDQUFDO0lBRVksQ0FBQztJQUUzRSxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBbUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0SCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMs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QyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDaEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFRO1FBQ2pCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDaEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFBOztZQTlFK0Msd0JBQXdCOztBQWI3RDtJQUFSLEtBQUssRUFBRTs4QkFBYyxhQUFhO2dFQUFtQjtBQUVVO0lBQS9ELFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDOzhCQUFvQixnQkFBZ0I7OERBQUM7QUFIekYsMkJBQTJCO0lBTnZDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx5QkFBeUI7UUFDbkMsZ25DQUFvRDtRQUVwRCxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsNkJBQTJCLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLDZCQUEyQixDQUFDLENBQUM7O0tBQy9HLENBQUM7cUNBZThDLHdCQUF3QjtHQWQzRCwyQkFBMkIsQ0E0RnZDO1NBNUZZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNNEZvcm1Db250cm9sfSBmcm9tICcuLi9tNC1mb3JtLWNvbnRyb2wnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtmaWx0ZXIsIHN0YXJ0V2l0aCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHthc2FwU2NoZWR1bGVyLCBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0NvbnRyb2xCYXNlfSBmcm9tICcuLi9jb250cm9sLWJhc2UnO1xuaW1wb3J0IHtEZWZhdWx0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi4vLi4vaGVscGVyL2RlZmF1bHQtdmFsdWUtYWNjZXNzb3InO1xuaW1wb3J0IHtUeXBlQWxpYXN9IGZyb20gJy4uLy4uL2hlbHBlci90eXBlLWFsaWFzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbTQtZHluYW1pYy1mb3JtLWNvbnRyb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vZHluYW1pYy1mb3JtLWNvbnRyb2wuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9keW5hbWljLWZvcm0tY29udHJvbC5jb21wb25lbnQuY3NzJ10sXG4gIHByb3ZpZGVyczogW0RlZmF1bHRWYWx1ZUFjY2Vzc29yLmdldChEeW5hbWljRm9ybUNvbnRyb2xDb21wb25lbnQpLCBUeXBlQWxpYXMuZ2V0KER5bmFtaWNGb3JtQ29udHJvbENvbXBvbmVudCldLFxufSlcbmV4cG9ydCBjbGFzcyBEeW5hbWljRm9ybUNvbnRyb2xDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBASW5wdXQoKSBmb3JtQ29udHJvbDogTTRGb3JtQ29udHJvbDxDb250cm9sQmFzZTxhbnk+PjtcblxuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7cmVhZDogVmlld0NvbnRhaW5lclJlZiwgc3RhdGljOiB0cnVlfSkgcHJpdmF0ZSBjb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG4gIHByaXZhdGUgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8Q29udHJvbEJhc2U8YW55Pj47XG4gIHByaXZhdGUgY29tcG9uZW50SW5zdGFuY2U6IENvbnRyb2xCYXNlPGFueT47XG5cbiAgcHJpdmF0ZSBvbkNoYW5nZUZ1bmN0aW9uOiBhbnk7XG4gIHByaXZhdGUgb25Ub3VjaGVkRnVuY3Rpb246IGFueTtcblxuICBwcml2YXRlIHN0YXR1c0NoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByaXZhdGUgY29tcG9uZW50UmVhZHkkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgeyB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMubmdPbkRlc3Ryb3koKTtcblxuICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeTxDb250cm9sQmFzZTxhbnk+Pih0aGlzLmZvcm1Db250cm9sLmNvbnRyb2xUeXBlKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudDxDb250cm9sQmFzZTxhbnk+PihmYWN0b3J5KTtcbiAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG5cbiAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlLnJlZ2lzdGVyT25DaGFuZ2UodGhpcy5vbkNoYW5nZUZ1bmN0aW9uKTtcbiAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlLnJlZ2lzdGVyT25Ub3VjaGVkKHRoaXMub25Ub3VjaGVkRnVuY3Rpb24pO1xuXG4gICAgaWYgKHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbE9wdGlvbnMpIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUNvbnRyb2wuY29udHJvbE9wdGlvbnMpLmZvckVhY2goKGtleTogYW55KSA9PiB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50SW5zdGFuY2UudXBkYXRlUHJvcGVydHkoa2V5LCB0aGlzLmZvcm1Db250cm9sLmNvbnRyb2xPcHRpb25zW2tleV0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmZvcm1Db250cm9sLnN0YXR1c0NoYW5nZXMucGlwZShzdGFydFdpdGgodGhpcy5mb3JtQ29udHJvbC5zdGF0dXMpKVxuICAgICAgLnN1YnNjcmliZSgoc3RhdGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUNvbnRyb2wucHJpc3RpbmUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZENsYXNzZXMgPSBbJ3N1Y2Nlc3MnXTtcbiAgICAgICAgY29uc3QgaW52YWxpZENsYXNzZXMgPSBbJ2FsZXJ0J107XG5cbiAgICAgICAgY29uc3QgbmV3Q2xhc3NWYWx1ZSA9IHN0YXRlID09PSAnSU5WQUxJRCcgPyBpbnZhbGlkQ2xhc3NlcyA6IHZhbGlkQ2xhc3NlcztcbiAgICAgICAgY29uc3Qgb2xkQ2xhc3NWYWx1ZSA9IHN0YXRlID09PSAnSU5WQUxJRCcgPyB2YWxpZENsYXNzZXMgOiBpbnZhbGlkQ2xhc3NlcztcbiAgICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZS5uZXdDbGFzc1ZhbHVlKG5ld0NsYXNzVmFsdWUsIG9sZENsYXNzVmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICBhc2FwU2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVhZHkkLm5leHQodHJ1ZSk7XG5cbiAgICAgIGFzYXBTY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICB0aGlzLmZvcm1Db250cm9sLm1hcmtBc1ByaXN0aW5lKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50UmVhZHkkLm5leHQoZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN0YXR1c0NoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWYuZGVzdHJveSgpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSBudWxsO1xuICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlRnVuY3Rpb24gPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZEZ1bmN0aW9uID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvbmVudFJlYWR5JC5waXBlKGZpbHRlcih2ID0+IHYpLCB0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZS5zZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgd3JpdGVWYWx1ZShvYmo6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50UmVhZHkkLnBpcGUoZmlsdGVyKHYgPT4gdiksIHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlLndyaXRlVmFsdWUob2JqKTtcbiAgICB9KTtcbiAgfVxufVxuIl19