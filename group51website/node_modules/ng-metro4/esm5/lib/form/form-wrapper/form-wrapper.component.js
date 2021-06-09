import { __decorate, __metadata } from "tslib";
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { M4FormGroup } from '../m4-form-group';
var FormWrapperComponent = /** @class */ (function () {
    function FormWrapperComponent() {
        this.showErrors = true;
    }
    FormWrapperComponent.prototype.ngOnInit = function () {
        this.formName = this.formGroup.name;
        this.formPath = "form." + this.formName + ".";
    };
    __decorate([
        Input('title'),
        __metadata("design:type", String)
    ], FormWrapperComponent.prototype, "title", void 0);
    __decorate([
        Input('description'),
        __metadata("design:type", String)
    ], FormWrapperComponent.prototype, "description", void 0);
    __decorate([
        Input('show-errors'),
        __metadata("design:type", Object)
    ], FormWrapperComponent.prototype, "showErrors", void 0);
    __decorate([
        Input(),
        __metadata("design:type", M4FormGroup)
    ], FormWrapperComponent.prototype, "formGroup", void 0);
    __decorate([
        ContentChild('formError', { static: true }),
        __metadata("design:type", TemplateRef)
    ], FormWrapperComponent.prototype, "errorTemplate", void 0);
    FormWrapperComponent = __decorate([
        Component({
            selector: 'm4-form-wrapper',
            template: "<h1 *ngIf=\"title\">{{title}}</h1>\n<p class=\"text-leader mb-5\" *ngIf=\"description\">{{description}}</p>\n\n<ng-content></ng-content>\n\n<ng-container *ngIf=\"showErrors && formGroup.errors && formGroup.dirty\">\n  <hr>\n\n  <ul class=\"unstyled-list fg-red text-small m-2\">\n    <li *ngFor=\"let error of formGroup.errors | errorDisplay: formPath\">\n      <ng-container *ngIf=\"errorTemplate\">\n        <ng-container *ngTemplateOutlet=\"errorTemplate;context:{ error: error }\"></ng-container>\n      </ng-container>\n      <ng-container *ngIf=\"!errorTemplate\">\n        {{error}}\n      </ng-container>\n    </li>\n  </ul>\n</ng-container>\n",
            styles: [""]
        }),
        __metadata("design:paramtypes", [])
    ], FormWrapperComponent);
    return FormWrapperComponent;
}());
export { FormWrapperComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS13cmFwcGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLW1ldHJvNC8iLCJzb3VyY2VzIjpbImxpYi9mb3JtL2Zvcm0td3JhcHBlci9mb3JtLXdyYXBwZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQU83QztJQVlFO1FBVHNCLGVBQVUsR0FBRyxJQUFJLENBQUM7SUFTeEIsQ0FBQztJQUVqQix1Q0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVEsSUFBSSxDQUFDLFFBQVEsTUFBRyxDQUFDO0lBQzNDLENBQUM7SUFoQmU7UUFBZixLQUFLLENBQUMsT0FBTyxDQUFDOzt1REFBZTtJQUNSO1FBQXJCLEtBQUssQ0FBQyxhQUFhLENBQUM7OzZEQUFxQjtJQUNwQjtRQUFyQixLQUFLLENBQUMsYUFBYSxDQUFDOzs0REFBbUI7SUFFL0I7UUFBUixLQUFLLEVBQUU7a0NBQVksV0FBVzsyREFBQztJQUVhO1FBQTVDLFlBQVksQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7a0NBQWdCLFdBQVc7K0RBQU07SUFQbEUsb0JBQW9CO1FBTGhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsdXBCQUE0Qzs7U0FFN0MsQ0FBQzs7T0FDVyxvQkFBb0IsQ0FrQmhDO0lBQUQsMkJBQUM7Q0FBQSxBQWxCRCxJQWtCQztTQWxCWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge000Rm9ybUdyb3VwfSBmcm9tICcuLi9tNC1mb3JtLWdyb3VwJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbTQtZm9ybS13cmFwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2Zvcm0td3JhcHBlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2Zvcm0td3JhcHBlci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgRm9ybVdyYXBwZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoJ3RpdGxlJykgdGl0bGU6IHN0cmluZztcbiAgQElucHV0KCdkZXNjcmlwdGlvbicpIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIEBJbnB1dCgnc2hvdy1lcnJvcnMnKSBzaG93RXJyb3JzID0gdHJ1ZTtcblxuICBASW5wdXQoKSBmb3JtR3JvdXA6IE00Rm9ybUdyb3VwO1xuXG4gIEBDb250ZW50Q2hpbGQoJ2Zvcm1FcnJvcicsIHsgc3RhdGljOiB0cnVlIH0pIGVycm9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHVibGljIGZvcm1OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBmb3JtUGF0aDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtTmFtZSA9IHRoaXMuZm9ybUdyb3VwLm5hbWU7XG4gICAgdGhpcy5mb3JtUGF0aCA9IGBmb3JtLiR7dGhpcy5mb3JtTmFtZX0uYDtcbiAgfVxufVxuIl19