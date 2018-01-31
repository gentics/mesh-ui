import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType, BinaryField, MeshNode } from '../../../../common/models/node.model';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { ApiService } from '../../../../core/providers/api/api.service';
import { BlobService } from '../../../providers/blob.service';



@Component({
    selector: 'binary-field',
    templateUrl: './binary-field.component.html',
    styleUrls: ['./binary-field.scss']
})
export class BinaryFieldComponent extends BaseFieldComponent {

    binaryProperties: BinaryField & { file?: File };
    binaryPropertiesArray: Array<{ key: string; value: any }>;
    binaryMediaType: string;
    field: SchemaField;
    objectUrl: string | SafeUrl = null;

    public api: MeshFieldControlApi;

    constructor(private apiService: ApiService,
                private blobService: BlobService,
                protected changeDetector: ChangeDetectorRef) {
        super(changeDetector);
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
    }

    valueChange(value: NodeFieldType | null | undefined): void {
        this.binaryProperties = value && { ...value as BinaryField };
        if (!this.binaryProperties || !this.binaryProperties.mimeType) {
            this.objectUrl = null;
            return;
        }

        this.binaryPropertiesArray = this.getBinaryPropertiesAsArray();
        this.binaryMediaType = this.getBinaryMediaType();

        if (this.binaryProperties.file) {
            this.objectUrl = this.blobService.createObjectURL(this.binaryProperties.file);
        } else {
            const node = this.api.getNodeValue() as MeshNode;
            this.objectUrl = this.apiService.project.getBinaryFileUrl(node.project.name, node.uuid, this.api.field.name);
        }
    }

    formWidthChange(width: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = width <= SMALL_SCREEN_LIMIT;
    }

    onFilesSelected(files: any[]): void {
        const file = files[0];
        this.api.setValue({ fileName: file.name, fileSize: file.size, mimeType: file.type, file } as BinaryField);
    }


     /**
     * returns a 'type' part of the mimeType header
     * image/jpeg => image
     * video/ogg => video
     */
    private getBinaryMediaType(): string {
        const mimeType: string = this.binaryProperties.mimeType;
        if (!mimeType) {
            return null;
        }
        const type = (mimeType.split('/')[0] as string).toLowerCase();
        return type;
    }

    private getBinaryPropertiesAsArray(): Array<{ key: string; value: any }> {
        return Object.keys(this.binaryProperties || {})
            .filter(key => key !== 'file')
            .map(key => ({ key, value: this.binaryProperties[key] }));
    }

}
