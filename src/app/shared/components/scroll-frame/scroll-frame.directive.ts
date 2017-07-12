import { Directive, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
 * The ScrollFrame directive should be attached to scrollable divs (i.e. divs with `overflow-y: auto`).
 * See ScrollFrameTargetDirective for further usage.
 */
@Directive({selector: '[scrollFrame]'})
export class ScrollFrameDirective {
    scrollEnd$: Observable<Event>;
    frameElement: HTMLElement;

    constructor(private elementRef: ElementRef) {
        this.frameElement = elementRef.nativeElement;
        this.scrollEnd$ = Observable.fromEvent(this.frameElement, 'scroll');
    }
}
