import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IModalDialog } from 'gentics-ui-core';
import { GenticsImageEditorComponent, ImageTransformParams } from 'gentics-ui-image-editor';

@Component({
    selector: 'mesh-image-editor-modal',
    templateUrl: './image-editor-modal.component.html',
    styleUrls: ['./image-editor-modal.component.scss']
})
export class ImageEditorModalComponent implements AfterViewInit, IModalDialog {
    closeFn: (val: any) => void;
    cancelFn: (val?: any) => void;
    imageUrl: string | SafeUrl;
    params: ImageTransformParams | undefined;
    isEditing = false;
    @ViewChild('imageEditor') editor: GenticsImageEditorComponent;

    constructor() {}

    ngAfterViewInit(): void {
        if (!this.params) {
            return;
        }
        this.editor.focalPointX = this.params.focalPointX;
        this.editor.focalPointY = this.params.focalPointY;
    }

    applyEdits(): void {
        this.closeFn(this.params);
    }

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }
}
