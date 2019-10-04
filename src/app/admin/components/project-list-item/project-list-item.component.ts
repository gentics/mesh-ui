import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService, Notification } from 'gentics-ui-core';
import { Subscription } from 'rxjs';

import { Project } from '../../../common/models/project.model';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';

@Component({
    selector: 'mesh-project-list-item',
    templateUrl: './project-list-item.component.html',
    styleUrls: ['./project-list-item.scss']
})
export class ProjectListItemComponent implements OnInit, OnDestroy {
    @Input() projectUuid: string;

    project: Project;

    private subscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private notification: Notification,
        private modal: ModalService,
        private i18n: I18nService,
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private adminProjectEffects: AdminProjectEffectsService
    ) {}

    ngOnInit(): void {
        this.subscription = this.entities
            .selectProject(this.projectUuid)
            .subscribe(project => (this.project = { ...project }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * Only focuses on project input
     */
    edit(): void {
        const element: HTMLElement = this.elementRef.nativeElement;
        const input = element.querySelector('input');
        if (input) {
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }
    }

    /**
     * Shows confirmation dialog, then deletes the project.
     */
    delete(): void {
        this.modal
            .dialog({
                title: this.i18n.translate('modal.delete_project_title'),
                body: this.i18n.translate('modal.delete_project_body', { name: this.project.name }),
                buttons: [
                    { label: this.i18n.translate('common.cancel_button'), type: 'secondary', shouldReject: true },
                    { label: this.i18n.translate('common.delete_button'), type: 'alert', returnValue: true }
                ]
            })
            .then(modal => modal.open())
            .then(() => this.adminProjectEffects.deleteProject(this.projectUuid));
    }

    /**
     * Updates the project.
     * Happens on input blur
     */
    update(event: string): void {
        // TODO actually update
        // TODO maybe not check state but something different because it might get updated later (after api call is done)
        // TODO Implement as soon as double firing of this event is fixed
        if (this.state.now.entities.project[this.projectUuid].name !== this.project.name) {
            this.notification.show({ message: 'update' });
        }
    }
}
