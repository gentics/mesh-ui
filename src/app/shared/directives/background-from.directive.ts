import { Directive, HostBinding, Input, OnChanges } from '@angular/core';
import { stringToColor } from '../../common/util/util';

/**
 * Make BackgroundColor from:
 * Arbitrary string - see [stringToColor](app/common/utils/util.js).
 */
@Directive({
    selector: '[meshBackgroundFrom]'
})
export class BackgroundFromDirective implements OnChanges {
    @HostBinding('style.backgroundColor')
    private backgroundColor: string;

    @Input()
    private meshBackgroundFrom: string;

    ngOnChanges(): void {
        this.backgroundColor = stringToColor(this.meshBackgroundFrom);
    }
}
