import { __decorate, __read, __spread } from "tslib";
import { Pipe } from '@angular/core';
var ExecuteFunctionOncePipe = /** @class */ (function () {
    function ExecuteFunctionOncePipe() {
    }
    ExecuteFunctionOncePipe.prototype.transform = function (value) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        return value.apply(void 0, __spread(parameters));
    };
    ExecuteFunctionOncePipe = __decorate([
        Pipe({
            name: 'executeFunctionOnce'
        })
    ], ExecuteFunctionOncePipe);
    return ExecuteFunctionOncePipe;
}());
export { ExecuteFunctionOncePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0ZS1mdW5jdGlvbi1vbmNlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1tZXRybzQvIiwic291cmNlcyI6WyJsaWIvZm9ybS9waXBlcy9leGVjdXRlLWZ1bmN0aW9uLW9uY2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFLcEQ7SUFBQTtJQU1BLENBQUM7SUFKQywyQ0FBUyxHQUFULFVBQVUsS0FBZTtRQUFFLG9CQUFvQjthQUFwQixVQUFvQixFQUFwQixxQkFBb0IsRUFBcEIsSUFBb0I7WUFBcEIsbUNBQW9COztRQUM3QyxPQUFPLEtBQUssd0JBQUksVUFBVSxHQUFFO0lBQzlCLENBQUM7SUFKVSx1QkFBdUI7UUFIbkMsSUFBSSxDQUFDO1lBQ0osSUFBSSxFQUFFLHFCQUFxQjtTQUM1QixDQUFDO09BQ1csdUJBQXVCLENBTW5DO0lBQUQsOEJBQUM7Q0FBQSxBQU5ELElBTUM7U0FOWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2V4ZWN1dGVGdW5jdGlvbk9uY2UnXG59KVxuZXhwb3J0IGNsYXNzIEV4ZWN1dGVGdW5jdGlvbk9uY2VQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBGdW5jdGlvbiwgLi4ucGFyYW1ldGVyczogYW55W10pOiBhbnkge1xuICAgIHJldHVybiB2YWx1ZSguLi5wYXJhbWV0ZXJzKTtcbiAgfVxuXG59XG4iXX0=