import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { NodeEditorComponent } from '../node-editor/node-editor.component';
import { I18nService } from '../../../core/providers/i18n/i18n.service';

/**
 * A modal for the user to
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
    changes: Array<{ path: string; oldValue: string; newValue: string; }>;
    displayLimit = 10;
    additionalChangesCount: number = 0;

    constructor(private i18n: I18nService) {}

    ngOnInit(): void {
        const listChangedLabel = this.i18n.translate('modal.list_changed_label');

        this.changes = this.nodeEditor.formGenerator.getChangesByPath()
            .map(change => {
                const path = change.path.join(' › ');
                const oldValue = typeof change.initialValue !== 'object' ? change.initialValue.toString() : '';
                const newValue = typeof change.currentValue !== 'object' ? change.currentValue.toString() : listChangedLabel;
                return { path, oldValue, newValue };
            });

        const tagChanges = this.nodeEditor.tagsBar.getChanges();
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
}
