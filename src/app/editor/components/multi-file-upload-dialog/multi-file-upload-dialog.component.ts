import { Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { SafeUrl, SafeScript } from '@angular/platform-browser';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

import { BlobService } from '../../providers/blob.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { MeshNode, BinaryField } from '../../../common/models/node.model';
import { initializeNode } from '../../form-generator/common/initialize-node';
import { EditorEffectsService } from '../../providers/editor-effects.service';

interface FileWithBlob {
    file: BinaryField;
    blob: SafeUrl;
    mediaType: string;
}
@Component({
    selector: 'mesh-multi-file-upload-dialog',
    templateUrl: './multi-file-upload-dialog.component.html',
    styleUrls: ['./multi-file-upload-dialog.component.scss'],
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
export class MultiFileUploadDialogComponent implements IModalDialog, OnInit {

    closeFn: (val: any) => void;
    cancelFn: (val: any) => void;

    files: File[]; // Initialy passed from the dialog opener. Afterwards filesWithBlobs will be used
    parentUuid: string;
    language: string;
    project: string;

    // We cache the blobs of images/videos/audios so it does not get rerendered everytime.
    private filesWithBlobs: FileWithBlob[];
    private availableSchemas: Schema[] = [];

    private selectedSchema: Schema = null;
    private selectedField: SchemaField = null;
    private schemaFields: SchemaField[] = [];

    constructor(
        private blobService: BlobService,
        private state: ApplicationStateService,
        private editorEffects: EditorEffectsService,
    ) { }

    ngOnInit() {
        this.state.select(state => state.entities.schema)
        .take(1)
        .subscribe((schemas) => {
            Object.keys(schemas).forEach(key => {
                const schema = schemas[key];
                const latestVersionNumber: string  = Object.keys(schema).pop();
                const latestSchema: Schema = schema[latestVersionNumber];

                if (latestSchema.fields.some(field => field.type === 'binary') // Has some binaries.
                && latestSchema.fields.some(field => field.type !== 'binary'
                && field.required === true) === false) { // Does not have required fields that are NOT binaries.
                    this.availableSchemas.push(latestSchema);
                }
            });
        });

        this.filesWithBlobs = this.files.map(file => this.addBlobToFile(file));
    }

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    save(): void {
        this.filesWithBlobs.map(fileWithBlobs => {
            const node = initializeNode(this.selectedSchema, this.parentUuid, this.language);
            node.fields[this.selectedField.name] = fileWithBlobs.file;
            this.editorEffects.saveNewNode(this.project, node as MeshNode, null);
        });
    }

    onDropFiles(files: File[]) {
        files = files.filter(droppedFile => // Filter out the duplicates by filename and the filesize.
            this.filesWithBlobs.some(filesWithBlob =>
                filesWithBlob.file.fileName === droppedFile.name &&
                filesWithBlob.file.fileSize === droppedFile.size) === false);

        this.filesWithBlobs = [...this.filesWithBlobs, ...files.map(file => this.addBlobToFile(file))];
    }

    addBlobToFile(file: File): FileWithBlob {
        return {
            file: { fileName: file.name, fileSize: file.size, mimeType: file.type, file } as BinaryField,
            blob: this.blobService.createObjectURL(file),
            mediaType: this.getBinaryMediaType(file)
        };
    }

    onFileRemoved(fileToRemove: FileWithBlob) {
        this.filesWithBlobs = this.filesWithBlobs.filter(file => file !== fileToRemove);
    }

    onSchemaChange(schema: Schema) {
        this.selectedSchema = schema;
        this.schemaFields =  this.selectedSchema.fields.filter(field => field.type === 'binary');
    }

    onFieldSelected(field: SchemaField) {
        this.selectedField = field;
    }

    private getBinaryMediaType(file: File): string {
        const mimeType: string = file.type;
        if (!mimeType) {
            return null;
        }
        const type = (mimeType.split('/')[0] as string).toLowerCase();
        return type;
    }
}
