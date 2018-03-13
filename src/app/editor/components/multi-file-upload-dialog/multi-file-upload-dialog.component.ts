import { Component, OnInit } from '@angular/core';
import { IModalDialog } from 'gentics-ui-core';
import { BlobService } from '../../providers/blob.service';
import { SafeUrl } from '@angular/platform-browser';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Schema } from '../../../common/models/schema.model';

@Component({
    selector: 'mesh-multi-file-upload-dialog',
    templateUrl: './multi-file-upload-dialog.component.html',
    styleUrls: ['./multi-file-upload-dialog.component.scss']
})
export class MultiFileUploadDialogComponent implements IModalDialog, OnInit {

    closeFn: (val: any) => void;
    cancelFn: (val: any) => void;

    files: File[];

    availableSchemas: Schema[] = [];

    constructor(
        private blobService: BlobService,
        private state: ApplicationStateService,
    ) { }

    ngOnInit() {
        this.state.select(state => state.entities.schema)
        .take(1)
        .subscribe((schemas) => {
            Object.keys(schemas).forEach(key => {
                const schema = schemas[key];
                const latestVersionNumber:string  = Object.keys(schema).pop();
                const latestSchema: Schema = schema[latestVersionNumber];

                if (latestSchema.fields.some(field => field.type === 'binary') // Has some binaries.
                && latestSchema.fields.some(field => field.type !== 'binary' && field.required === true) === false) { // Does not have required fields that are NOT binaries.
                    this.availableSchemas.push(latestSchema);
                }
            });
        });
    }

    registerCloseFn(close: (val: any) => void): void {
        this.closeFn = close;
    }

    registerCancelFn(cancel: (val: any) => void): void {
        this.cancelFn = cancel;
    }

    getBinaryMediaType(file: File): string {
        const mimeType: string = file.type;
        if (!mimeType) {
            return null;
        }
        const type = (mimeType.split('/')[0] as string).toLowerCase();
        return type;
    }

    getObjectURL(file: File): SafeUrl {
        return this.blobService.createObjectURL(file);
    }

}
