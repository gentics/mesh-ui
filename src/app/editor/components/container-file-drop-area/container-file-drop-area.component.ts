import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';
import { ModalService } from 'gentics-ui-core';
import { MultiFileUploadDialogComponent } from '../multi-file-upload-dialog/multi-file-upload-dialog.component';

@Component({
    selector: 'mesh-container-file-drop-area',
    templateUrl: './container-file-drop-area.component.html',
    styleUrls: ['./container-file-drop-area.component.scss'],
    animations: [
        trigger('overlayVisible', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('100ms')
            ]),

            transition(':leave', [
                animate('100ms', style({ opacity: 0 }))
            ]),
        ])
    ]
})
export class ContainerFileDropAreaComponent {

    constructor(
        private modalService: ModalService
    ) { }

    public onDropFiles(files: File[]) {
        console.log('Files are', files);
        this.modalService.fromComponent(
            MultiFileUploadDialogComponent,
            {
                closeOnOverlayClick: false,
                width: '90%'
            },
            {
                files
            }
        )
        .then(modal => modal.open())
        .then(() => {
           // Success
        });
    }
}
