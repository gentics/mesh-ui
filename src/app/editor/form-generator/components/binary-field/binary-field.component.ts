import { ChangeDetectorRef, Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalService } from 'gentics-ui-core';
import { ImageTransformParams } from 'gentics-ui-image-editor';

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
    scaledTransform: Partial<ImageTransformParams> = {};
    private lastParams: ImageTransformParams;
    private transformParams: ImageTransformParams;
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

    onImageLoad(): void {
        this.loadingImagePreview = false;
        if (this.binaryProperties.file && this.lastParams) {
            this.scaledTransform = this.lastParams;
            this.lastParams = undefined;
        }
    }

    editImage(): void {
        const node = this.api.getNodeValue() as MeshNode;
        let imageUrl: string | SafeUrl;
        const newFile = this.binaryProperties.file;
        if (newFile) {
            imageUrl = this.blobService.createObjectURL(this.binaryProperties.file);
        } else {
            imageUrl = this.apiService.project.getBinaryFileUrl(node.project.name, node.uuid, this.api.field.name);
        }

        this.modalService.fromComponent(ImageEditorModalComponent, null, { imageUrl, params: this.transformParams })
            .then(modal => modal.open())
            .then(params => {
                const value = this.api.getValue();
                const newValue = { ...value, ...{ transform: params } };
                if (newFile) {
                    newValue.file = newFile;
                    // We defer updating the scaledTransform value until after the preview image has loaded,
                    // otherwise the parameters will be overwritten by defaults. This only needs to be done
                    // when working with new files (and consequently binary objectUrls) since the image load
                    // event does not re-fire for urls which have already been loaded once.
                    this.lastParams = params;
                } else {
                    this.scaledTransform = this.calculateScaledTransformParams(this.binaryProperties, params);
                }
                this.transformParams = params;
                this.changeDetector.markForCheck();
                this.api.setValue(newValue);
            });
    }

    private calculateScaledTransformParams(imageField: BinaryField, params: ImageTransformParams): ImageTransformParams {
        const { ratio } = this.getConstrainedDimensions(imageField);
        const round = val => Math.round(val);
        return {
            width: round(params.width * ratio),
            height: round(params.height * ratio),
            scaleX: params.scaleX,
            scaleY: params.scaleY,
            cropRect: {
                startX: round(params.cropRect.startX * ratio),
                startY: round(params.cropRect.startY * ratio),
                width: round(params.cropRect.width * ratio),
                height: round(params.cropRect.height * ratio)
            },
            focalPointX: params.focalPointX,
            focalPointY: params.focalPointY
        };
    }

    private getBinaryUrl(binaryField: BinaryField): string {
        const node = this.api.getNodeValue() as MeshNode;
        let binaryUrl = this.apiService.project.getBinaryFileUrl(node.project.name, node.uuid, this.api.field.name);
        if (this.binaryMediaType === 'image') {
            binaryUrl += this.getDimensionQueryParams(binaryField);
        }
        return binaryUrl;
    }

    private getDimensionQueryParams(imageField: BinaryField): string {
        const { width, height } = this.getConstrainedDimensions(imageField);
        return`?w=${Math.round(width)}&h=${Math.round(height)}`;
    }

    private getConstrainedDimensions(imageField: BinaryField): { width: number; height: number; ratio: number; } {
        let ratio = 1;
        let width = imageField.width;
        let height = imageField.height;

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

        return { width, height, ratio };
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
