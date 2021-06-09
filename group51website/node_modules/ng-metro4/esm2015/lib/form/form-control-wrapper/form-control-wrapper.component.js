import { __decorate, __metadata, __param } from "tslib";
import { Component, ContentChild, Host, Input, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { AbstractControl, ControlContainer, FormControlName } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { ControlBase } from '../control-base';
let FormControlWrapperComponent = class FormControlWrapperComponent {
    constructor(controlContainer) {
        this.controlContainer = controlContainer;
        this.showErrors = true;
        this.marginTop = false;
    }
    ngAfterContentInit() {
        const directives = this.controlContainer.directives;
        const controlIndex = directives.findIndex(d => d.valueAccessor === this.formControl);
        const formControlNameDirective = directives[controlIndex];
        this.marginTop = controlIndex > 0;
        this.formControlName = formControlNameDirective.name;
        this.formGroup = this.controlContainer.control;
        this.formName = this.formGroup.name;
        this.formPath = `form.${this.formName}.`;
        this.formControlPath = `${this.formPath}${this.formControlName}.`;
        this.control = this.formGroup.get(this.formControlName);
        this.statusChangeSubscription = this.control.statusChanges.pipe(startWith(this.control.status))
            .subscribe((state) => {
            if (this.control.pristine) {
                return;
            }
            const validClasses = ['success'];
            const invalidClasses = ['alert'];
            const newClassValue = state === 'INVALID' ? invalidClasses : validClasses;
            const oldClassValue = state === 'INVALID' ? validClasses : invalidClasses;
            this.formControl.newClassValue(newClassValue, oldClassValue);
        });
    }
};
FormControlWrapperComponent.ctorParameters = () => [
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] }
];
__decorate([
    Input('label'),
    __metadata("design:type", String)
], FormControlWrapperComponent.prototype, "label", void 0);
__decorate([
    Input('description'),
    __metadata("design:type", String)
], FormControlWrapperComponent.prototype, "description", void 0);
__decorate([
    Input('show-errors'),
    __metadata("design:type", Object)
], FormControlWrapperComponent.prototype, "showErrors", void 0);
__decorate([
    ContentChild(ControlBase, { static: true }),
    __metadata("design:type", ControlBase)
], FormControlWrapperComponent.prototype, "formControl", void 0);
__decorate([
    ContentChild('controlError', { static: true }),
    __metadata("design:type", TemplateRef)
], FormControlWrapperComponent.prototype, "errorTemplate", void 0);
FormControlWrapperComponent = __decorate([
    Component({
        selector: 'm4-form-control-wrapper',
        template: "<div class=\"form-group\" [class.mt-1]=\"marginTop\">\n  <label *ngIf=\"label\">{{label}}</label>\n  <ng-content></ng-content>\n  <small class=\"text-muted\" *ngIf=\"description\">{{description}}</small>\n\n  <ng-container *ngIf=\"showErrors && control.errors && control.dirty\">\n    <ul class=\"unstyled-list fg-red text-small m-1\">\n      <li *ngFor=\"let error of control.errors | errorDisplay: formControlPath\">\n        <ng-container *ngIf=\"errorTemplate\">\n          <ng-container *ngTemplateOutlet=\"errorTemplate;context:{ error: error }\"></ng-container>\n        </ng-container>\n        <ng-container *ngIf=\"!errorTemplate\">\n          {{error}}\n        </ng-container>\n      </li>\n    </ul>\n  </ng-container>\n</div>\n",
        styles: [""]
    }),
    __param(0, Optional()), __param(0, Host()), __param(0, SkipSelf()),
    __metadata("design:paramtypes", [ControlContainer])
], FormControlWrapperComponent);
export { FormControlWrapperComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1jb250cm9sLXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vZm9ybS1jb250cm9sLXdyYXBwZXIvZm9ybS1jb250cm9sLXdyYXBwZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQW1CLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0SCxPQUFPLEVBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFRNUMsSUFBYSwyQkFBMkIsR0FBeEMsTUFBYSwyQkFBMkI7SUFzQnRDLFlBQW9ELGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBbkJoRSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBZWpDLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFJaUUsQ0FBQztJQUUzRixrQkFBa0I7UUFDaEIsTUFBTSxVQUFVLEdBQTRCLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxVQUFVLENBQUM7UUFDOUUsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sd0JBQXdCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsZUFBZSxHQUFXLHdCQUF3QixDQUFDLElBQUksQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxHQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM1RixTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUN6QixPQUFPO2FBQ1I7WUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sY0FBYyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMsTUFBTSxhQUFhLEdBQUcsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDMUUsTUFBTSxhQUFhLEdBQUcsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7WUFDMUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUVGLENBQUE7O1lBOUJ1RSxnQkFBZ0IsdUJBQXpFLFFBQVEsWUFBSSxJQUFJLFlBQUksUUFBUTs7QUFyQnpCO0lBQWYsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7MERBQWU7QUFDUjtJQUFyQixLQUFLLENBQUMsYUFBYSxDQUFDOztnRUFBcUI7QUFDcEI7SUFBckIsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7K0RBQW1CO0FBS3hDO0lBREMsWUFBWSxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQzs4QkFDeEIsV0FBVztnRUFBTTtBQUVXO0lBQS9DLFlBQVksQ0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7OEJBQWdCLFdBQVc7a0VBQU07QUFWckUsMkJBQTJCO0lBTHZDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx5QkFBeUI7UUFDbkMsaXZCQUFvRDs7S0FFckQsQ0FBQztJQXVCYSxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxJQUFJLEVBQUUsQ0FBQSxFQUFFLFdBQUEsUUFBUSxFQUFFLENBQUE7cUNBQTJCLGdCQUFnQjtHQXRCM0UsMkJBQTJCLENBb0R2QztTQXBEWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FmdGVyQ29udGVudEluaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBIb3N0LCBJbnB1dCwgT3B0aW9uYWwsIFNraXBTZWxmLCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQ29udHJvbENvbnRhaW5lciwgRm9ybUNvbnRyb2xOYW1lfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtDb250cm9sQmFzZX0gZnJvbSAnLi4vY29udHJvbC1iYXNlJztcbmltcG9ydCB7TTRGb3JtR3JvdXB9IGZyb20gJy4uL200LWZvcm0tZ3JvdXAnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtNC1mb3JtLWNvbnRyb2wtd3JhcHBlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9mb3JtLWNvbnRyb2wtd3JhcHBlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2Zvcm0tY29udHJvbC13cmFwcGVyLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbFdyYXBwZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgQElucHV0KCdsYWJlbCcpIGxhYmVsOiBzdHJpbmc7XG4gIEBJbnB1dCgnZGVzY3JpcHRpb24nKSBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBASW5wdXQoJ3Nob3ctZXJyb3JzJykgc2hvd0Vycm9ycyA9IHRydWU7XG5cbiAgcHVibGljIGZvcm1Hcm91cDogTTRGb3JtR3JvdXA7XG5cbiAgQENvbnRlbnRDaGlsZChDb250cm9sQmFzZSwgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHVibGljIGZvcm1Db250cm9sOiBDb250cm9sQmFzZTxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoJ2NvbnRyb2xFcnJvcicsIHsgc3RhdGljOiB0cnVlIH0pIGVycm9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgcHVibGljIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcblxuICBwdWJsaWMgZm9ybUNvbnRyb2xOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBmb3JtTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgZm9ybVBhdGg6IHN0cmluZztcbiAgcHVibGljIGZvcm1Db250cm9sUGF0aDogc3RyaW5nO1xuICBwdWJsaWMgbWFyZ2luVG9wID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBzdGF0dXNDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHByaXZhdGUgY29udHJvbENvbnRhaW5lcjogQ29udHJvbENvbnRhaW5lcikgeyB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGRpcmVjdGl2ZXM6IEZvcm1Db250cm9sTmFtZVtdID0gKDxhbnk+dGhpcy5jb250cm9sQ29udGFpbmVyKS5kaXJlY3RpdmVzO1xuICAgIGNvbnN0IGNvbnRyb2xJbmRleCA9IGRpcmVjdGl2ZXMuZmluZEluZGV4KGQgPT4gZC52YWx1ZUFjY2Vzc29yID09PSB0aGlzLmZvcm1Db250cm9sKTtcbiAgICBjb25zdCBmb3JtQ29udHJvbE5hbWVEaXJlY3RpdmUgPSBkaXJlY3RpdmVzW2NvbnRyb2xJbmRleF07XG5cbiAgICB0aGlzLm1hcmdpblRvcCA9IGNvbnRyb2xJbmRleCA+IDA7XG4gICAgdGhpcy5mb3JtQ29udHJvbE5hbWUgPSA8c3RyaW5nPmZvcm1Db250cm9sTmFtZURpcmVjdGl2ZS5uYW1lO1xuICAgIHRoaXMuZm9ybUdyb3VwID0gPE00Rm9ybUdyb3VwPnRoaXMuY29udHJvbENvbnRhaW5lci5jb250cm9sO1xuICAgIHRoaXMuZm9ybU5hbWUgPSB0aGlzLmZvcm1Hcm91cC5uYW1lO1xuICAgIHRoaXMuZm9ybVBhdGggPSBgZm9ybS4ke3RoaXMuZm9ybU5hbWV9LmA7XG4gICAgdGhpcy5mb3JtQ29udHJvbFBhdGggPSBgJHt0aGlzLmZvcm1QYXRofSR7dGhpcy5mb3JtQ29udHJvbE5hbWV9LmA7XG4gICAgdGhpcy5jb250cm9sID0gdGhpcy5mb3JtR3JvdXAuZ2V0KHRoaXMuZm9ybUNvbnRyb2xOYW1lKTtcblxuICAgIHRoaXMuc3RhdHVzQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5jb250cm9sLnN0YXR1c0NoYW5nZXMucGlwZShzdGFydFdpdGgodGhpcy5jb250cm9sLnN0YXR1cykpXG4gICAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sLnByaXN0aW5lKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRDbGFzc2VzID0gWydzdWNjZXNzJ107XG4gICAgICAgIGNvbnN0IGludmFsaWRDbGFzc2VzID0gWydhbGVydCddO1xuXG4gICAgICAgIGNvbnN0IG5ld0NsYXNzVmFsdWUgPSBzdGF0ZSA9PT0gJ0lOVkFMSUQnID8gaW52YWxpZENsYXNzZXMgOiB2YWxpZENsYXNzZXM7XG4gICAgICAgIGNvbnN0IG9sZENsYXNzVmFsdWUgPSBzdGF0ZSA9PT0gJ0lOVkFMSUQnID8gdmFsaWRDbGFzc2VzIDogaW52YWxpZENsYXNzZXM7XG4gICAgICAgIHRoaXMuZm9ybUNvbnRyb2wubmV3Q2xhc3NWYWx1ZShuZXdDbGFzc1ZhbHVlLCBvbGRDbGFzc1ZhbHVlKTtcbiAgICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==