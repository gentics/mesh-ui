import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../common/models/node.model';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';

// TODO: this needs to be configurable
const CUSTOM_COMPONENT_ROOT = './custom-controls/';

interface CustomControlWindow extends Window {
    initMeshControl: (api: MeshFieldControlApi) => void;
}

@Component({
    selector: 'custom-field',
    templateUrl: './custom-field.component.html',
    styleUrls: ['./custom-field.scss']
})
export class CustomFieldComponent extends BaseFieldComponent implements AfterViewInit {
    api: MeshFieldControlApi;
    iframeHeight: string = '150px';
    iframeWidth: string = '100%';
    @ViewChild('iframe')
    private iframe: ElementRef;

    constructor(changeDetector: ChangeDetectorRef, private ngZone: NgZone) {
        super(changeDetector);
    }

    ngAfterViewInit(): void {
        const iframe = this.iframe.nativeElement as HTMLIFrameElement;
        const iframeWindow = iframe.contentWindow as CustomControlWindow;
        if (this.api.field.control) {
            iframe.addEventListener('load', () => {
                if (typeof iframeWindow.initMeshControl === 'function') {
                    iframeWindow.initMeshControl(this.api);
                }
            });
            iframe.src = CUSTOM_COMPONENT_ROOT + this.api.field.control.use + '/control.html';
        }
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
    }

    valueChange(value: NodeFieldType): void {
        // handled by the custom control directly via MeshFieldControlApi.onValueChange()
    }

    formWidthChange(widthInPixels: number): void {
        // we set `width` directly rather than using the .setWidth() method, since this
        // method is overridden below.
        this.width = FIELD_FULL_WIDTH;
        this.isCompact = widthInPixels <= SMALL_SCREEN_LIMIT;
    }

    setHeight(val: string): void {
        this.iframeHeight = val.toString();
    }

    setWidth(val: string): void {
        this.iframeWidth = val.toString();
    }

    /**
     * Override the standard setFocus since this will be called from an iframe, which means
     * we need to manually let Angular know that a value has changed.
     */
    setFocus(val: boolean): void {
        this.ngZone.run(() => {
            this.isFocused = val;
        });
    }

    onChange(value: string): void {
        this.api.setValue(value);
    }

}
