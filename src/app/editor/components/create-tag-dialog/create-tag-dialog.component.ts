import { Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';

@Component({
    selector: 'app-create-tag-dialog',
    templateUrl: './create-tag-dialog.component.html',
    styleUrls: ['./create-tag-dialog.component.scss']
})
export class CreateTagDialogComponent implements IModalDialog, OnInit {

    closeFn: (result: boolean) => void;
    cancelFn: (val?: any) => void;

    constructor(private i18n: I18nService) {}

    ngOnInit() {

    }

    registerCloseFn(close: (val: boolean) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

}
