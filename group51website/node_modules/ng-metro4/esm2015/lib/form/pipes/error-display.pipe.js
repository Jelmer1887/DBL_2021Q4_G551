import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let ErrorDisplayPipe = class ErrorDisplayPipe {
    transform(errors, formControlPath) {
        if (!errors) {
            return [];
        }
        const errorKeys = Object.keys(errors);
        return errorKeys.map(key => `${formControlPath}errors.${key}`);
    }
};
ErrorDisplayPipe = __decorate([
    Pipe({
        name: 'errorDisplay'
    })
], ErrorDisplayPipe);
export { ErrorDisplayPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItZGlzcGxheS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vcGlwZXMvZXJyb3ItZGlzcGxheS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQU1wRCxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQUUzQixTQUFTLENBQUMsTUFBNkIsRUFBRSxlQUF1QjtRQUM5RCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqRSxDQUFDO0NBRUYsQ0FBQTtBQVhZLGdCQUFnQjtJQUg1QixJQUFJLENBQUM7UUFDSixJQUFJLEVBQUUsY0FBYztLQUNyQixDQUFDO0dBQ1csZ0JBQWdCLENBVzVCO1NBWFksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3JzfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2Vycm9yRGlzcGxheSdcbn0pXG5leHBvcnQgY2xhc3MgRXJyb3JEaXNwbGF5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHRyYW5zZm9ybShlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCwgZm9ybUNvbnRyb2xQYXRoOiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICghZXJyb3JzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZXJyb3JLZXlzID0gT2JqZWN0LmtleXMoZXJyb3JzKTtcbiAgICByZXR1cm4gZXJyb3JLZXlzLm1hcChrZXkgPT4gYCR7Zm9ybUNvbnRyb2xQYXRofWVycm9ycy4ke2tleX1gKTtcbiAgfVxuXG59XG4iXX0=