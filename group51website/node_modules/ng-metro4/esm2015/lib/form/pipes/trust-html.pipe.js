import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
let TrustHtmlPipe = class TrustHtmlPipe {
    constructor(domSanitizer) {
        this.domSanitizer = domSanitizer;
    }
    transform(value) {
        return this.domSanitizer.bypassSecurityTrustHtml(value);
    }
};
TrustHtmlPipe.ctorParameters = () => [
    { type: DomSanitizer }
];
TrustHtmlPipe = __decorate([
    Pipe({
        name: 'trustHtml'
    }),
    __metadata("design:paramtypes", [DomSanitizer])
], TrustHtmlPipe);
export { TrustHtmlPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJ1c3QtaHRtbC5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbWV0cm80LyIsInNvdXJjZXMiOlsibGliL2Zvcm0vcGlwZXMvdHJ1c3QtaHRtbC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsWUFBWSxFQUFFLFFBQVEsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBS2pFLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7SUFFeEIsWUFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7SUFFOUMsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFhO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0NBRUYsQ0FBQTs7WUFSbUMsWUFBWTs7QUFGbkMsYUFBYTtJQUh6QixJQUFJLENBQUM7UUFDSixJQUFJLEVBQUUsV0FBVztLQUNsQixDQUFDO3FDQUdrQyxZQUFZO0dBRm5DLGFBQWEsQ0FVekI7U0FWWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEb21TYW5pdGl6ZXIsIFNhZmVIdG1sfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuQFBpcGUoe1xuICBuYW1lOiAndHJ1c3RIdG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBUcnVzdEh0bWxQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcikge1xuXG4gIH1cblxuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZyk6IFNhZmVIdG1sIHtcbiAgICByZXR1cm4gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodmFsdWUpO1xuICB9XG5cbn1cbiJdfQ==