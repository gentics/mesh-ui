import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Notification, ModalService } from 'gentics-ui-core';

import { Project } from '../../../common/models/project.model';
import { I18nService } from '../../../shared/providers/i18n/i18n.service';
import { Observable } from 'rxjs/Observable';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'project-list-item',
    templateUrl: './project-list-item.component.html',
    styleUrls: ['./project-list-item.scss']
})
export class ProjectListItemComponent implements OnInit, OnDestroy {
    @Input()
    projectUuid: string;

    project: Project;

    private subscription: Subscription;

    constructor(private elementRef: ElementRef,
                private notification: Notification,
                private modal: ModalService,
                private i18n: I18nService,
                private state: ApplicationStateService) {
    }

    ngOnInit(): void {
        this.subscription = this.state.select(state => state.entities.project[this.projectUuid])
            .subscribe(project => this.project = {...project});
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * Only focuses on project input
     */
    edit(): void {
        let element: HTMLElement = this.elementRef.nativeElement;
        let input = element.querySelector('input');
        if (input) {
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }
    }

    /**
     * Shows confirmation dialog, then deletes the project.
     */
    delete(): void {
        this.modal.dialog({
            title: this.i18n.translate('modal.delete_project_title'),
            body: this.i18n.translate('modal.delete_project_body', { name: this.project.name }),
            buttons: [
                { label: this.i18n.translate('common.cancel_button'), type: 'secondary', shouldReject: true },
                { label: this.i18n.translate('common.delete_button'), type: 'alert', returnValue: true }
            ]
        })
        .then(modal => modal.open())
        .then(() => {
            // TODO actually delete
            this.notification.show({ message: 'delete' });
        });
    }

    /**
     * Updates the project.
     * Happens on input blur
     */
    update(): void {
        // TODO actually update
        // TODO maybe not check state but something different because it might get update later (after api call is done)
        if (this.state.now.entities.project[this.projectUuid].name !== this.project.name) {
            this.notification.show({ message: 'update' });
        }
    }
}
