import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ModalService, IDialogConfig } from 'gentics-ui-core';
import { MeshNode } from '../../../common/models/node.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { ApiService } from '../../../core/providers/api/api.service';

@Component({
    selector: 'app-node-row',
    templateUrl: './node-row.component.html',
    styleUrls: ['./node-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeRowComponent implements OnInit {
    @Input() node: MeshNode;
    @Input() listLanguage: string;

    routerLink: any[] = null;

    constructor(private state: ApplicationStateService,
                private navigationService: NavigationService,
                private modalService: ModalService,
                private i18n: I18nService,
                private listEffects: ListEffectsService,
                private entities: EntitiesService,
                private api: ApiService) {
    }

    ngOnInit() {
        if (this.node.container) {
            this.routerLink = this.navigationService.list(this.node.project.name, this.node.uuid, this.listLanguage).commands();
        } else {
            this.routerLink = this.navigationService.detail(this.node.project.name, this.node.uuid, this.node.language).commands();
        }
    }

    editNode(): void {
        this.navigationService.detail(this.node.project.name, this.node.uuid, this.node.language).navigate();
    }

    copyNode(): void {
        // TODO
    }

    moveNode(): void {
        // TODO
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

        this.modalService.dialog(dialogConfig)
            .then(modal => modal.open())
            .then(() => {
                this.listEffects.deleteNode(this.node, true);
            });
    }

    focusEditor() {
        this.state.actions.editor.focusEditor();
    }
}
