import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from '@angular/core';
import { ScrollFrameDirective } from './scroll-frame.directive';
import { Subscription } from 'rxjs/Subscription';

interface Options {
    /** Debounce the scroll event - can increase this if performance is impacted */
    debounce: number;
    /** The heading will not be floated if the target is below this height */
    minimumElementHeight: number;
    /** The top offset of the heading when it is being floated */
    top: number;
}

export interface ScrollFrameTrackingOptions extends Partial<Options> {
    target: HTMLElement | ElementRef;
}

const DEFAULT_OPTIONS: Options = {
    debounce: 1,
    minimumElementHeight: 300,
    top: 0
};

/**
 * Directive which works in conjunction with the ScrollFrameDirective to provide a "sticky" header functionality.
 * This directive must have a ScrollFrameDirective as an ancestor in the DOM.
 *
 * The directive must be passed an options object, of which the "target" property is required.
 * The target property refers to that DOM element which is used to establish when the heading should be floated.
 *
 * ```
 * <div scrollFrame>
 *     <!-- scrollable content -->
 *     <h3 [scrollFrameHeading]="{ target: scrollTarget }">Section X</h3>
 *     <div #scrollTarget>
 *         <!-- long content of "section X" -->
 *     </div>
 * </div>
 * ```
 */
@Directive({selector: '[scrollFrameHeading]'})
export class ScrollFrameHeadingDirective implements OnInit, OnDestroy, OnChanges {

    @Input('scrollFrameHeading') options: ScrollFrameTrackingOptions;
    @Input() disableScrollTarget: boolean;

    @HostBinding('style.position')
    position: 'inherit' | 'fixed' = 'inherit';

    @HostBinding('style.top')
    top: string | 'inherit' = 'inherit';

    @HostBinding('class.scroll-frame-heading')
    readonly fixedClass = true;

    @HostBinding('class.floating')
    floating: boolean = false;

    private subscription: Subscription;

    constructor(private elementRef: ElementRef,
                private changeDetector: ChangeDetectorRef,
                @Optional() private scrollFrame?: ScrollFrameDirective) {}

    ngOnInit() {
        if (!this.disableScrollTarget) {
            this.setUpScrollTracking();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['disableScrollTarget']) {
            if (!!changes['disableScrollTarget'].currentValue === true) {
                this.stopScrollTracking();
            } else {
                this.setUpScrollTracking();
            }
        }
    }

    ngOnDestroy(): void {
        this.stopScrollTracking();
    }

    /**
     * Subscribe to the scroll event of the ScrollFrame and float the title when the target element is in the frame but
     * cut off at the top.
     */
    private setUpScrollTracking() {
        if (!this.scrollFrame) {
            throw new Error('ScrollFrameTargetDirective could not find any ScrollFrameDirective');
        }
        const target = this.options.target instanceof ElementRef ? this.options.target.nativeElement : this.options.target;
        const frameElement = this.scrollFrame.frameElement;
        const options: Options & ScrollFrameTrackingOptions = { ...DEFAULT_OPTIONS, ...this.options };

        this.subscription = this.scrollFrame.scrollEnd$
            .debounceTime(options.debounce)
            .map(() => this.targetShouldFloat(frameElement, target, options))
            .distinctUntilChanged()
            .subscribe(float => {
                if (float) {
                    this.position = 'fixed';
                    this.top = `${options.top + frameElement.offsetTop}px`;
                } else {
                    this.position = 'inherit';
                    this.top = 'inherit';
                }
                this.floating = float;
                this.changeDetector.markForCheck();
            });
    }

    /**
     * Unsubscribe from the ScrollFrame scroll event.
     */
    private stopScrollTracking(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Inspects the positions of the ScrollFrame and the target element to determine whether the
     * heading element should be floated.
     */
    private targetShouldFloat(frameElement: HTMLElement, target: HTMLElement, options: Options): boolean {
        if (target.offsetHeight < options.minimumElementHeight!) {
            return false;
        }
        // this is the offset between the frameElement and its stacking context
        const globalOffset = frameElement.offsetTop;
        const targetTop = target.getBoundingClientRect().top - globalOffset;
        const targetBottom = target.getBoundingClientRect().bottom - globalOffset;
        const frameTop = frameElement.getBoundingClientRect().top - globalOffset;
        const frameBottom = frameElement.getBoundingClientRect().bottom - globalOffset;

        const isInView = targetTop < frameBottom &&  frameTop < (targetBottom - this.elementRef.nativeElement.offsetHeight);
        const topIsAboveFrame = targetTop < frameTop;
        return isInView && topIsAboveFrame;
    }
}
