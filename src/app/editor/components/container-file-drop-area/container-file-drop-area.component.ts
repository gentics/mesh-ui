import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ModalService } from 'gentics-ui-core';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { MultiFileUploadDialogComponent } from '../multi-file-upload-dialog/multi-file-upload-dialog.component';

@Component({
    selector: 'mesh-container-file-drop-area',
    templateUrl: './container-file-drop-area.component.html',
    styleUrls: ['./container-file-drop-area.component.scss'],
    animations: [
        trigger('overlayVisible', [
            transition(':enter', [style({ opacity: 0 }), animate('100ms')]),

            transition(':leave', [animate('100ms', style({ opacity: 0 }))])
        ])
    ]
})
export class ContainerFileDropAreaComponent {
    disabled = false;
    draggingFileOnPage: boolean;
    draggingFileOnThis: boolean;
    constructor(private modalService: ModalService, private state: ApplicationStateService) {}

    public openModalDialog(files: File[]) {
        this.disabled = true; // Keep this area disabled while the modal is open
        this.modalService
            .fromComponent(
                MultiFileUploadDialogComponent,
                {
                    closeOnOverlayClick: false,
                    width: '90%',
                    onClose: (reason: any): void => {
                        this.disabled = false;
                    }
                },
                {
                    files,
                    parentUuid: this.state.now.list.currentNode,
                    language: this.state.now.ui.currentLanguage,
                    project: this.state.now.list.currentProject
                }
            )
            .then(modal => modal.open())
            .then(result => {
                this.disabled = false;
            });
    }
}
