import { __decorate, __metadata } from "tslib";
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { M4FormGroup } from '../m4-form-group';
let FormWrapperComponent = class FormWrapperComponent {
    constructor() {
        this.showErrors = true;
    }
    ngOnInit() {
        this.formName = this.formGroup.name;
        this.formPath = `form.${this.formName}.`;
    }
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
export { FormWrapperComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS13cmFwcGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLW1ldHJvNC8iLCJzb3VyY2VzIjpbImxpYi9mb3JtL2Zvcm0td3JhcHBlci9mb3JtLXdyYXBwZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQU83QyxJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFvQjtJQVkvQjtRQVRzQixlQUFVLEdBQUcsSUFBSSxDQUFDO0lBU3hCLENBQUM7SUFFakIsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQztJQUMzQyxDQUFDO0NBQ0YsQ0FBQTtBQWpCaUI7SUFBZixLQUFLLENBQUMsT0FBTyxDQUFDOzttREFBZTtBQUNSO0lBQXJCLEtBQUssQ0FBQyxhQUFhLENBQUM7O3lEQUFxQjtBQUNwQjtJQUFyQixLQUFLLENBQUMsYUFBYSxDQUFDOzt3REFBbUI7QUFFL0I7SUFBUixLQUFLLEVBQUU7OEJBQVksV0FBVzt1REFBQztBQUVhO0lBQTVDLFlBQVksQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7OEJBQWdCLFdBQVc7MkRBQU07QUFQbEUsb0JBQW9CO0lBTGhDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsdXBCQUE0Qzs7S0FFN0MsQ0FBQzs7R0FDVyxvQkFBb0IsQ0FrQmhDO1NBbEJZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TTRGb3JtR3JvdXB9IGZyb20gJy4uL200LWZvcm0tZ3JvdXAnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtNC1mb3JtLXdyYXBwZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZm9ybS13cmFwcGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZm9ybS13cmFwcGVyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBGb3JtV3JhcHBlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgndGl0bGUnKSB0aXRsZTogc3RyaW5nO1xuICBASW5wdXQoJ2Rlc2NyaXB0aW9uJykgZGVzY3JpcHRpb246IHN0cmluZztcbiAgQElucHV0KCdzaG93LWVycm9ycycpIHNob3dFcnJvcnMgPSB0cnVlO1xuXG4gIEBJbnB1dCgpIGZvcm1Hcm91cDogTTRGb3JtR3JvdXA7XG5cbiAgQENvbnRlbnRDaGlsZCgnZm9ybUVycm9yJywgeyBzdGF0aWM6IHRydWUgfSkgZXJyb3JUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBwdWJsaWMgZm9ybU5hbWU6IHN0cmluZztcbiAgcHVibGljIGZvcm1QYXRoOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm1OYW1lID0gdGhpcy5mb3JtR3JvdXAubmFtZTtcbiAgICB0aGlzLmZvcm1QYXRoID0gYGZvcm0uJHt0aGlzLmZvcm1OYW1lfS5gO1xuICB9XG59XG4iXX0=