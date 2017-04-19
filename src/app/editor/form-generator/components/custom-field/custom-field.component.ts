import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

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
    @ViewChild('iframe')
    private iframe: ElementRef;

    ngAfterViewInit(): void {
        const iframe = this.iframe.nativeElement as HTMLIFrameElement;
        const iframeWindow = iframe.contentWindow as CustomControlWindow;
        if (this.api.field.config) {
            iframe.addEventListener('load', () => {
                if (typeof iframeWindow.initMeshControl === 'function') {
                    iframeWindow.initMeshControl(this.api);
                }
            });
            iframe.src = CUSTOM_COMPONENT_ROOT + this.api.field.config.formControl + '/control.html';
        }
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
    }

    valueChange(value: NodeFieldType): void {
        // handled by the custom control directly via MeshFieldControlApi.onValueChange()
    }

    formWidthChange(): void {
        // handled by the custom control directly via MeshFieldControlApi.onFormWidthChange()
    }

    onChange(value: string): void {
        this.api.setValue(value);
    }

}
