import { Directive, HostBinding, Input, OnChanges } from '@angular/core';
import { stringToColor } from '../../common/util/util';

@Directive({
    selector: '[appBackgroundFrom]'
})
export class BackgroundFromDirective implements OnChanges {
    @HostBinding('style.backgroundColor')
    private backgroundColor: string;

    @Input()
    private appBackgroundFrom: string;

    ngOnChanges(): void {
        this.backgroundColor = stringToColor(this.appBackgroundFrom);
    }
}
