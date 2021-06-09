import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
var ErrorDisplayPipe = /** @class */ (function () {
    function ErrorDisplayPipe() {
    }
    ErrorDisplayPipe.prototype.transform = function (errors, formControlPath) {
        if (!errors) {
            return [];
        }
        var errorKeys = Object.keys(errors);
        return errorKeys.map(function (key) { return formControlPath + "errors." + key; });
    };
    ErrorDisplayPipe = __decorate([
        Pipe({
            name: 'errorDisplay'
        })
    ], ErrorDisplayPipe);
    return ErrorDisplayPipe;
}());
export { ErrorDisplayPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItZGlzcGxheS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vcGlwZXMvZXJyb3ItZGlzcGxheS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQU1wRDtJQUFBO0lBV0EsQ0FBQztJQVRDLG9DQUFTLEdBQVQsVUFBVSxNQUE2QixFQUFFLGVBQXVCO1FBQzlELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBRyxlQUFlLGVBQVUsR0FBSyxFQUFqQyxDQUFpQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQVRVLGdCQUFnQjtRQUg1QixJQUFJLENBQUM7WUFDSixJQUFJLEVBQUUsY0FBYztTQUNyQixDQUFDO09BQ1csZ0JBQWdCLENBVzVCO0lBQUQsdUJBQUM7Q0FBQSxBQVhELElBV0M7U0FYWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQFBpcGUoe1xuICBuYW1lOiAnZXJyb3JEaXNwbGF5J1xufSlcbmV4cG9ydCBjbGFzcyBFcnJvckRpc3BsYXlQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKGVycm9yczogVmFsaWRhdGlvbkVycm9yc3xudWxsLCBmb3JtQ29udHJvbFBhdGg6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKCFlcnJvcnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBlcnJvcktleXMgPSBPYmplY3Qua2V5cyhlcnJvcnMpO1xuICAgIHJldHVybiBlcnJvcktleXMubWFwKGtleSA9PiBgJHtmb3JtQ29udHJvbFBhdGh9ZXJyb3JzLiR7a2V5fWApO1xuICB9XG5cbn1cbiJdfQ==