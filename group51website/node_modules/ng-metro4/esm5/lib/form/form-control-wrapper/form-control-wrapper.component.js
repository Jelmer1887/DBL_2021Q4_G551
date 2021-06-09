import { __decorate, __metadata, __param } from "tslib";
import { Component, ContentChild, Host, Input, Optional, SkipSelf, TemplateRef } from '@angular/core';
import { AbstractControl, ControlContainer, FormControlName } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { ControlBase } from '../control-base';
var FormControlWrapperComponent = /** @class */ (function () {
    function FormControlWrapperComponent(controlContainer) {
        this.controlContainer = controlContainer;
        this.showErrors = true;
        this.marginTop = false;
    }
    FormControlWrapperComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        var directives = this.controlContainer.directives;
        var controlIndex = directives.findIndex(function (d) { return d.valueAccessor === _this.formControl; });
        var formControlNameDirective = directives[controlIndex];
        this.marginTop = controlIndex > 0;
        this.formControlName = formControlNameDirective.name;
        this.formGroup = this.controlContainer.control;
        this.formName = this.formGroup.name;
        this.formPath = "form." + this.formName + ".";
        this.formControlPath = "" + this.formPath + this.formControlName + ".";
        this.control = this.formGroup.get(this.formControlName);
        this.statusChangeSubscription = this.control.statusChanges.pipe(startWith(this.control.status))
            .subscribe(function (state) {
            if (_this.control.pristine) {
                return;
            }
            var validClasses = ['success'];
            var invalidClasses = ['alert'];
            var newClassValue = state === 'INVALID' ? invalidClasses : validClasses;
            var oldClassValue = state === 'INVALID' ? validClasses : invalidClasses;
            _this.formControl.newClassValue(newClassValue, oldClassValue);
        });
    };
    FormControlWrapperComponent.ctorParameters = function () { return [
        { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] }
    ]; };
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
    return FormControlWrapperComponent;
}());
export { FormControlWrapperComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1jb250cm9sLXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vZm9ybS1jb250cm9sLXdyYXBwZXIvZm9ybS1jb250cm9sLXdyYXBwZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQW1CLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0SCxPQUFPLEVBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFRNUM7SUFzQkUscUNBQW9ELGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBbkJoRSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBZWpDLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFJaUUsQ0FBQztJQUUzRix3REFBa0IsR0FBbEI7UUFBQSxpQkEwQkM7UUF6QkMsSUFBTSxVQUFVLEdBQTRCLElBQUksQ0FBQyxnQkFBaUIsQ0FBQyxVQUFVLENBQUM7UUFDOUUsSUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxhQUFhLEtBQUssS0FBSSxDQUFDLFdBQVcsRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO1FBQ3JGLElBQU0sd0JBQXdCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsZUFBZSxHQUFXLHdCQUF3QixDQUFDLElBQUksQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxHQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFRLElBQUksQ0FBQyxRQUFRLE1BQUcsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxNQUFHLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM1RixTQUFTLENBQUMsVUFBQyxLQUFLO1lBQ2YsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDekIsT0FBTzthQUNSO1lBRUQsSUFBTSxZQUFZLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNqQyxJQUFNLGNBQWMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpDLElBQU0sYUFBYSxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQzFFLElBQU0sYUFBYSxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1lBQzFFLEtBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7O2dCQTVCcUUsZ0JBQWdCLHVCQUF6RSxRQUFRLFlBQUksSUFBSSxZQUFJLFFBQVE7O0lBckJ6QjtRQUFmLEtBQUssQ0FBQyxPQUFPLENBQUM7OzhEQUFlO0lBQ1I7UUFBckIsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7b0VBQXFCO0lBQ3BCO1FBQXJCLEtBQUssQ0FBQyxhQUFhLENBQUM7O21FQUFtQjtJQUt4QztRQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7a0NBQ3hCLFdBQVc7b0VBQU07SUFFVztRQUEvQyxZQUFZLENBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO2tDQUFnQixXQUFXO3NFQUFNO0lBVnJFLDJCQUEyQjtRQUx2QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLGl2QkFBb0Q7O1NBRXJELENBQUM7UUF1QmEsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsSUFBSSxFQUFFLENBQUEsRUFBRSxXQUFBLFFBQVEsRUFBRSxDQUFBO3lDQUEyQixnQkFBZ0I7T0F0QjNFLDJCQUEyQixDQW9EdkM7SUFBRCxrQ0FBQztDQUFBLEFBcERELElBb0RDO1NBcERZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIEhvc3QsIElucHV0LCBPcHRpb25hbCwgU2tpcFNlbGYsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBDb250cm9sQ29udGFpbmVyLCBGb3JtQ29udHJvbE5hbWV9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0NvbnRyb2xCYXNlfSBmcm9tICcuLi9jb250cm9sLWJhc2UnO1xuaW1wb3J0IHtNNEZvcm1Hcm91cH0gZnJvbSAnLi4vbTQtZm9ybS1ncm91cCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ200LWZvcm0tY29udHJvbC13cmFwcGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2Zvcm0tY29udHJvbC13cmFwcGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZm9ybS1jb250cm9sLXdyYXBwZXIuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sV3JhcHBlckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBASW5wdXQoJ2xhYmVsJykgbGFiZWw6IHN0cmluZztcbiAgQElucHV0KCdkZXNjcmlwdGlvbicpIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIEBJbnB1dCgnc2hvdy1lcnJvcnMnKSBzaG93RXJyb3JzID0gdHJ1ZTtcblxuICBwdWJsaWMgZm9ybUdyb3VwOiBNNEZvcm1Hcm91cDtcblxuICBAQ29udGVudENoaWxkKENvbnRyb2xCYXNlLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwdWJsaWMgZm9ybUNvbnRyb2w6IENvbnRyb2xCYXNlPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZCgnY29udHJvbEVycm9yJywgeyBzdGF0aWM6IHRydWUgfSkgZXJyb3JUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBwdWJsaWMgY29udHJvbDogQWJzdHJhY3RDb250cm9sO1xuXG4gIHB1YmxpYyBmb3JtQ29udHJvbE5hbWU6IHN0cmluZztcbiAgcHVibGljIGZvcm1OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBmb3JtUGF0aDogc3RyaW5nO1xuICBwdWJsaWMgZm9ybUNvbnRyb2xQYXRoOiBzdHJpbmc7XG4gIHB1YmxpYyBtYXJnaW5Ub3AgPSBmYWxzZTtcblxuICBwcml2YXRlIHN0YXR1c0NoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBIb3N0KCkgQFNraXBTZWxmKCkgcHJpdmF0ZSBjb250cm9sQ29udGFpbmVyOiBDb250cm9sQ29udGFpbmVyKSB7IH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgZGlyZWN0aXZlczogRm9ybUNvbnRyb2xOYW1lW10gPSAoPGFueT50aGlzLmNvbnRyb2xDb250YWluZXIpLmRpcmVjdGl2ZXM7XG4gICAgY29uc3QgY29udHJvbEluZGV4ID0gZGlyZWN0aXZlcy5maW5kSW5kZXgoZCA9PiBkLnZhbHVlQWNjZXNzb3IgPT09IHRoaXMuZm9ybUNvbnRyb2wpO1xuICAgIGNvbnN0IGZvcm1Db250cm9sTmFtZURpcmVjdGl2ZSA9IGRpcmVjdGl2ZXNbY29udHJvbEluZGV4XTtcblxuICAgIHRoaXMubWFyZ2luVG9wID0gY29udHJvbEluZGV4ID4gMDtcbiAgICB0aGlzLmZvcm1Db250cm9sTmFtZSA9IDxzdHJpbmc+Zm9ybUNvbnRyb2xOYW1lRGlyZWN0aXZlLm5hbWU7XG4gICAgdGhpcy5mb3JtR3JvdXAgPSA8TTRGb3JtR3JvdXA+dGhpcy5jb250cm9sQ29udGFpbmVyLmNvbnRyb2w7XG4gICAgdGhpcy5mb3JtTmFtZSA9IHRoaXMuZm9ybUdyb3VwLm5hbWU7XG4gICAgdGhpcy5mb3JtUGF0aCA9IGBmb3JtLiR7dGhpcy5mb3JtTmFtZX0uYDtcbiAgICB0aGlzLmZvcm1Db250cm9sUGF0aCA9IGAke3RoaXMuZm9ybVBhdGh9JHt0aGlzLmZvcm1Db250cm9sTmFtZX0uYDtcbiAgICB0aGlzLmNvbnRyb2wgPSB0aGlzLmZvcm1Hcm91cC5nZXQodGhpcy5mb3JtQ29udHJvbE5hbWUpO1xuXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmNvbnRyb2wuc3RhdHVzQ2hhbmdlcy5waXBlKHN0YXJ0V2l0aCh0aGlzLmNvbnRyb2wuc3RhdHVzKSlcbiAgICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2wucHJpc3RpbmUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZENsYXNzZXMgPSBbJ3N1Y2Nlc3MnXTtcbiAgICAgICAgY29uc3QgaW52YWxpZENsYXNzZXMgPSBbJ2FsZXJ0J107XG5cbiAgICAgICAgY29uc3QgbmV3Q2xhc3NWYWx1ZSA9IHN0YXRlID09PSAnSU5WQUxJRCcgPyBpbnZhbGlkQ2xhc3NlcyA6IHZhbGlkQ2xhc3NlcztcbiAgICAgICAgY29uc3Qgb2xkQ2xhc3NWYWx1ZSA9IHN0YXRlID09PSAnSU5WQUxJRCcgPyB2YWxpZENsYXNzZXMgOiBpbnZhbGlkQ2xhc3NlcztcbiAgICAgICAgdGhpcy5mb3JtQ29udHJvbC5uZXdDbGFzc1ZhbHVlKG5ld0NsYXNzVmFsdWUsIG9sZENsYXNzVmFsdWUpO1xuICAgICAgfSk7XG4gIH1cblxufVxuIl19