import { Component } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';

/**
 * A modal for the user to
 */
@Component({
    selector: 'confirm-navigation-modal',
    templateUrl: './confirm-navigation-modal.tpl.html',
    styleUrls: ['./confirm-navigation-modal.scss']
})
export class ConfirmNavigationModalComponent implements IModalDialog {
    closeFn: (result: boolean) => void;
    cancelFn: (val?: any) => void;

    nodeEditor: NodeEditorComponent;

    saveAndClose(): void {
        this.nodeEditor.saveNode();
        this.closeFn(true);
    }

    registerCloseFn(close: (val: boolean) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }
}
