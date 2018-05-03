import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';

import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';

/**
 * A modal for the user to confirm navigation despite unsaved changes.
 */
@Component({
    selector: 'confirm-navigation-modal',
    templateUrl: './confirm-navigation-modal.tpl.html',
    styleUrls: ['./confirm-navigation-modal.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmNavigationModalComponent implements IModalDialog, OnInit {
    closeFn: (result: boolean) => void;
    cancelFn: (val?: any) => void;
    nodeEditor: NodeEditorComponent;
    changes: Array<{ path: string; oldValue: string; newValue: string; }> = [];
    displayLimit = 10;
    additionalChangesCount: number = 0;

    constructor(private i18n: I18nService) {}

    ngOnInit(): void {

        if (this.nodeEditor.formGenerator) {
            this.changes = this.nodeEditor.formGenerator.getChangesByPath()
                .map(change => {
                    const path = change.path.join(' › ');
                    const oldValue = this.getInitialValueString(change.initialValue);
                    const newValue = this.getCurrentValueString(change.currentValue);
                    return {path, oldValue, newValue};
                });
        }

        if (this.nodeEditor.tagsBar) {
            const tagChanges = this.nodeEditor.tagsBar.changesSinceLastSave();
            if (tagChanges.deletedTags.length) {
                this.changes.push({
                    path: this.i18n.translate('modal.removed_tags'),
                    oldValue: tagChanges.deletedTags.join(', '),
                    newValue: ''
                });
            }

            if (tagChanges.newTags.length) {
                this.changes.push({
                    path: this.i18n.translate('modal.added_tags'),
                    oldValue: '',
                    newValue: tagChanges.newTags.join(', ')
                });
            }
        }

        if (this.displayLimit < this.changes.length) {
            this.additionalChangesCount = this.changes.length - this.displayLimit;
        }
    }

    saveAndClose(): void {
        this.nodeEditor.saveNode(false);
        this.closeFn(true);
    }

    registerCloseFn(close: (val: boolean) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    private getInitialValueString(initialValue: any): string {
        return typeof initialValue !== 'object' ? initialValue.toString() : '';
    }

    private getCurrentValueString(currentValue: any): string {
        if (typeof currentValue !== 'object') {
            return currentValue.toString();
        } else if (currentValue.file) {
            return this.i18n.translate('modal.new_file_selected_label');
        } else if (currentValue.transform) {
            return this.i18n.translate('modal.image_edited_label');
        } else {
            return this.i18n.translate('modal.list_changed_label');
        }
    }
}
