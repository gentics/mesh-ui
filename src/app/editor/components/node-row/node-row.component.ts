import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IDialogConfig, ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs';

import { MeshNode } from '../../../common/models/node.model';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { NodeBrowserOptions } from '../../../shared/components/node-browser/interfaces';
import { NodeBrowserComponent } from '../../../shared/components/node-browser/node-browser.component';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Component({
    selector: 'mesh-node-row',
    templateUrl: './node-row.component.html',
    styleUrls: ['./node-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeRowComponent implements OnInit, OnChanges {
    @Input()
    node: MeshNode;

    filterTerm$: Observable<string>;

    /** Current display node language */
    currentLanguage$: Observable<string>;

    routerLink: any[] | null = null;

    displayName: string;

    constructor(
        private state: ApplicationStateService,
        private navigationService: NavigationService,
        private modalService: ModalService,
        private i18n: I18nService,
        private listEffects: ListEffectsService
    ) {
        this.currentLanguage$ = this.state.select(state => state.list.language);
    }

    ngOnInit() {
        if (this.node.container) {
            this.routerLink = this.navigationService
                .list(this.node.project.name!, this.node.uuid, this.node.language)
                .commands();
        } else {
            this.routerLink = this.navigationService
                .detail(this.node.project.name!, this.node.uuid, this.node.language)
                .commands();
        }

        this.filterTerm$ = this.state.select(state => state.list.filterTerm);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.node) {
            this.updateDisplayName();
        }
    }

    editNode(): void {
        this.navigationService
            .detail(this.node.project.name!, this.node.uuid, this.node.language)
            .navigate({ queryParamsHandling: 'preserve' });
    }

    editNodeTranslation(language: string): void {
        this.navigationService
            .detail(this.node.project.name!, this.node.uuid, language)
            .navigate({ queryParamsHandling: 'preserve' });
    }

    async copyNode() {
        this.listEffects.copyNode(this.node, await this.chooseContainerDialog(true));
    }

    async moveNode() {
        this.listEffects.moveNode(this.node, await this.chooseContainerDialog(false));
    }

    /**
     * Opens a dialog for choosing a container. Returns the uuid of the chosen container.
     */
    private chooseContainerDialog(allowSameContainer: boolean): Promise<string> {
        const selectablePredicate = allowSameContainer
            ? () => true
            : (node: any) => node.uuid !== this.node.parentNode.uuid!;

        const options: NodeBrowserOptions = {
            startNodeUuid: this.node.parentNode.uuid,
            projectName: this.node.project.name!,
            titleKey: 'list.folder_dialog_title',
            chooseContainer: true,
            selectablePredicate,
            nodeFilter: {
                schema: {
                    isContainer: true
                }
            }
        };
        return this.modalService
            .fromComponent(NodeBrowserComponent, { padding: true, width: '1000px' }, { options })
            .then(dialog => dialog.open())
            .then(result => result[0]);
    }

    deleteNode(): void {
        const dialogConfig: IDialogConfig = {
            title: this.i18n.translate('modal.delete_node_title'),
            body: this.i18n.translate('modal.delete_node_body', { name: this.node.displayName }),
            buttons: [
                { label: this.i18n.translate('common.cancel_button'), type: 'secondary', shouldReject: true },
                { label: this.i18n.translate('common.delete_button'), type: 'alert', returnValue: true }
            ]
        };

        this.modalService
            .dialog(dialogConfig)
            .then(modal => modal.open())
            .then(() => {
                this.listEffects.deleteNode(this.node, true);
            });
    }

    /**
     * Focuses the editor if the clicked node is opened already.
     * Otherwise does nothing
     */
    focusEditor() {
        if (this.node.container) {
            // Don't focus container on folder click.
            return;
        }

        this.state.actions.editor.focusEditor();
    }

    updateDisplayName() {
        this.displayName = this.node.displayName || this.node.uuid;
    }
}
