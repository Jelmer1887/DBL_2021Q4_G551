import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
var UnwrapObservableOrValuePipe = /** @class */ (function () {
    function UnwrapObservableOrValuePipe(cdRef) {
        this.cdRef = cdRef;
    }
    UnwrapObservableOrValuePipe.prototype.transform = function (value) {
        var _this = this;
        if (!(value instanceof Observable)) {
            return value;
        }
        if (!this.subscription) {
            if (!value) {
                return this.innerValue;
            }
            this.previousValue = value;
            this.subscription = value
                .subscribe(function (output) {
                _this.innerValue = output;
                _this.cdRef.markForCheck();
            });
        }
        if (value !== this.previousValue) {
            this.ngOnDestroy();
            return this.transform(value);
        }
        return this.innerValue;
    };
    UnwrapObservableOrValuePipe.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.innerValue = null;
        this.subscription = null;
    };
    UnwrapObservableOrValuePipe.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    UnwrapObservableOrValuePipe = __decorate([
        Pipe({
            name: 'unwrapObservableOrValue',
            pure: false
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef])
    ], UnwrapObservableOrValuePipe);
    return UnwrapObservableOrValuePipe;
}());
export { UnwrapObservableOrValuePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW53cmFwLW9ic2VydmFibGUtb3ItdmFsdWUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLW1ldHJvNC8iLCJzb3VyY2VzIjpbImxpYi9mb3JtL3BpcGVzL3Vud3JhcC1vYnNlcnZhYmxlLW9yLXZhbHVlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNoRixPQUFPLEVBQUMsVUFBVSxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBTTlDO0lBT0UscUNBQW9CLEtBQXdCO1FBQXhCLFVBQUssR0FBTCxLQUFLLENBQW1CO0lBQzVDLENBQUM7SUFFRCwrQ0FBUyxHQUFULFVBQVUsS0FBMEI7UUFBcEMsaUJBeUJDO1FBeEJDLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxVQUFVLENBQUMsRUFBRTtZQUNsQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDVixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDeEI7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUUzQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUs7aUJBQ3RCLFNBQVMsQ0FBQyxVQUFDLE1BQWM7Z0JBQ3hCLEtBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2dCQUN6QixLQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELGlEQUFXLEdBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQztRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7O2dCQXJDMEIsaUJBQWlCOztJQVBqQywyQkFBMkI7UUFKdkMsSUFBSSxDQUFDO1lBQ0osSUFBSSxFQUFFLHlCQUF5QjtZQUMvQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUM7eUNBUTJCLGlCQUFpQjtPQVBqQywyQkFBMkIsQ0E2Q3ZDO0lBQUQsa0NBQUM7Q0FBQSxBQTdDRCxJQTZDQztTQTdDWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3ksIFBpcGUsIFBpcGVUcmFuc2Zvcm19IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICd1bndyYXBPYnNlcnZhYmxlT3JWYWx1ZScsXG4gIHB1cmU6IGZhbHNlXG59KVxuZXhwb3J0IGNsYXNzIFVud3JhcE9ic2VydmFibGVPclZhbHVlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0sIE9uRGVzdHJveSB7XG5cbiAgcHJpdmF0ZSBwcmV2aW91c1ZhbHVlOiBPYnNlcnZhYmxlPGFueT47XG4gIHByaXZhdGUgaW5uZXJWYWx1ZTogYW55O1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55fE9ic2VydmFibGU8YW55Pik6IGFueSB7XG4gICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdmFsdWVcbiAgICAgICAgLnN1YnNjcmliZSgob3V0cHV0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICB0aGlzLmlubmVyVmFsdWUgPSBvdXRwdXQ7XG4gICAgICAgICAgdGhpcy5jZFJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMubmdPbkRlc3Ryb3koKTtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5uZXJWYWx1ZTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLmlubmVyVmFsdWUgPSBudWxsO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgfVxufVxuIl19