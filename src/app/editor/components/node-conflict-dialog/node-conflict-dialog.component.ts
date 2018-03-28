import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MeshNode } from '../../../common/models/node.model';

/**
 * A modal for the user to
 */
@Component({
    selector: 'mesh-node-conflict-dialog',
    templateUrl: './node-conflict-dialog.component.html',
    styleUrls: ['./node-conflict-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeConflictDialogComponent implements IModalDialog, OnInit {
    closeFn: (result: boolean) => void;
    cancelFn: (val?: any) => void;
    mineNode: MeshNode;
    theirsNode: MeshNode;
    conflict: any;

    constructor(private i18n: I18nService) {}

    ngOnInit(): void {

    }

    saveAndClose(): void {
        this.closeFn(true);
    }

    registerCloseFn(close: (val: boolean) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }
}
