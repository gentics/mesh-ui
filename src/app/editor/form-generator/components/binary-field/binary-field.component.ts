import { ChangeDetectorRef, Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalService } from 'gentics-ui-core';
import { ImageTransformParams } from 'gentics-ui-image-editor/models';

import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { BinaryField, MeshNode, NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { ApiService } from '../../../../core/providers/api/api.service';
import { BlobService } from '../../../providers/blob.service';
import { ImageEditorModalComponent } from '../image-editor-modal/image-editor-modal.component';

@Component({
    selector: 'binary-field',
    templateUrl: './binary-field.component.html',
    styleUrls: ['./binary-field.scss']
})
export class BinaryFieldComponent extends BaseFieldComponent {

    public api: MeshFieldControlApi;
    binaryProperties: BinaryField & { file?: File };
    binaryMediaType: string;
    field: SchemaField;
    objectUrl: string | SafeUrl = null;
    loadingImagePreview = false;

    private readonly maxImageWidth = 750;
    private readonly maxImageHeight = 800;

    constructor(private apiService: ApiService,
                private blobService: BlobService,
                private modalService: ModalService,
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
        this.binaryMediaType = this.getBinaryMediaType(this.binaryProperties);

        if (this.binaryProperties.file) {
            this.objectUrl = this.blobService.createObjectURL(this.binaryProperties.file);
        } else {
            if (this.binaryMediaType === 'image') {
                this.loadingImagePreview = true;
            }
            this.objectUrl = this.getBinaryUrl(this.binaryProperties);
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

    editImage(): void {
        const node = this.api.getNodeValue() as MeshNode;
        const imageUrl = this.apiService.project.getBinaryFileUrl(node.project.name, node.uuid, this.api.field.name);

        this.modalService.fromComponent(ImageEditorModalComponent, null, { imageUrl })
            .then(modal => modal.open())
            .then(params => {
                this.objectUrl = this.getBinaryUrl(this.binaryProperties, params);
                this.loadingImagePreview = true;
                this.changeDetector.markForCheck();
            });
    }

    private getBinaryUrl(binaryField: BinaryField, transformParams?: ImageTransformParams): string {
        const node = this.api.getNodeValue() as MeshNode;
        let binaryUrl = this.apiService.project.getBinaryFileUrl(node.project.name, node.uuid, this.api.field.name);
        if (this.binaryMediaType === 'image') {
            binaryUrl += this.addImageTransformQueryParams(binaryField, transformParams);
        }
        return binaryUrl;
    }

    private addImageTransformQueryParams(imageField: BinaryField, transformParams?: ImageTransformParams): string {
        let ratio = 1;
        let cropped = false;
        let width = imageField.width;
        let height = imageField.height;

        if (transformParams) {
            width = transformParams.width;
            height = transformParams.height;
            if (transformParams.cropRect.width !== imageField.width || transformParams.cropRect.height !== imageField.height) {
                cropped = true;
            }
        }

        if (this.maxImageWidth < width) {
            ratio = this.maxImageWidth / width;
            width = this.maxImageWidth;
            height *= ratio;
        }

        if (this.maxImageHeight < height) {
            ratio = this.maxImageHeight / height;
            height = this.maxImageHeight;
            width *= ratio;
        }

        const round = num => Math.round(num);

        let queryString = `?w=${round(width)}&h=${round(height)}`;

        if (cropped) {
            const rect = transformParams.cropRect;
            queryString += `&crop=rect&rect=${round(rect.startX)},${round(rect.startY)},${round(rect.width)},${round(rect.height)}`;
        }

        return queryString;
    }

     /**
     * Returns a 'type' part of the mimeType header
     * image/jpeg => image
     * video/ogg => video
     */
    private getBinaryMediaType(binaryField: BinaryField): string | null {
        const mimeType: string = binaryField.mimeType;
        if (!mimeType) {
            return null;
        }
        return (mimeType.split('/')[0] as string).toLowerCase();
    }
}
