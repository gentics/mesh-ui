import { Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';

@Component({
    selector: 'mesh-name-input-dialog',
    templateUrl: './name-input-dialog.component.html',
    styleUrls: ['./name-input-dialog.component.scss']
})
export class NameInputDialogComponent implements IModalDialog, OnInit {
    closeFn: (result: string) => void;
    cancelFn: (val?: any) => void;

    title = '';
    label = '';
    value: string; //Passed from the caller
    error: string | null;
    constructor() { }

    ngOnInit() {
    }

    registerCloseFn(close: (val: string) => void): void {
        this.closeFn = close;
    }
    registerCancelFn(cancel: (val?: any) => void): void {
        this.cancelFn = cancel;
    }

    // Bound to the form's submit event.
    onSubmitClick() : void {
        this.closeFn(this.value);
    }

    // Bound to the "cancel" button in the template
    onCancelClick(): void {
        this.cancelFn();
    }

}
