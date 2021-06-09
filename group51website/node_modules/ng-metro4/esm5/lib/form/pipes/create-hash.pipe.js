import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { StringHelper } from '../../helper/string-helper';
var CreateHashPipe = /** @class */ (function () {
    function CreateHashPipe() {
    }
    CreateHashPipe.prototype.transform = function (value) {
        return StringHelper.createHash(value);
    };
    CreateHashPipe = __decorate([
        Pipe({
            name: 'createHash'
        })
    ], CreateHashPipe);
    return CreateHashPipe;
}());
export { CreateHashPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWhhc2gucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nLW1ldHJvNC8iLCJzb3VyY2VzIjpbImxpYi9mb3JtL3BpcGVzL2NyZWF0ZS1oYXNoLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUt4RDtJQUFBO0lBTUEsQ0FBQztJQUpDLGtDQUFTLEdBQVQsVUFBVSxLQUFVO1FBQ2xCLE9BQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBSlUsY0FBYztRQUgxQixJQUFJLENBQUM7WUFDSixJQUFJLEVBQUUsWUFBWTtTQUNuQixDQUFDO09BQ1csY0FBYyxDQU0xQjtJQUFELHFCQUFDO0NBQUEsQUFORCxJQU1DO1NBTlksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3RyaW5nSGVscGVyfSBmcm9tICcuLi8uLi9oZWxwZXIvc3RyaW5nLWhlbHBlcic7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2NyZWF0ZUhhc2gnXG59KVxuZXhwb3J0IGNsYXNzIENyZWF0ZUhhc2hQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmdIZWxwZXIuY3JlYXRlSGFzaCh2YWx1ZSk7XG4gIH1cblxufVxuIl19