import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalService } from 'gentics-ui-core';
import { GenticsImagePreviewComponent, ImageTransformParams } from 'gentics-ui-image-editor';

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
    binaryProperties: BinaryField;
    binaryMediaType: string;
    field: SchemaField;
    objectUrl: string | SafeUrl = null;
    loadingPreview = false;
    scaledTransform: Partial<ImageTransformParams> = {};

    @ViewChild(GenticsImagePreviewComponent) private imagePreview: GenticsImagePreviewComponent;
    private lastParams: ImageTransformParams;
    private transformParams: ImageTransformParams | undefined;
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
        this.api.onFormWidthChange(() => {
            if (this.imagePreview) {
                this.imagePreview.resizeHandler();
            }
        });
    }

    valueChange(value: NodeFieldType | null | undefined): void {
        this.binaryProperties = value && { ...value as BinaryField };
        if (!this.binaryProperties || !this.binaryProperties.mimeType) {
            this.objectUrl = null;
            return;
        }
        const type = this.getMimeType(this.binaryProperties.mimeType);
        this.binaryMediaType = type;

        if (this.binaryProperties.file) {
            this.objectUrl = this.blobService.createObjectURL(this.binaryProperties.file);
            if (type === 'image' || type === 'audio' || type === 'video') {
                this.loadingPreview = true;
            }
        } else {
            this.objectUrl = this.getBinaryUrl(this.binaryProperties);
            if (type === 'audio' || type === 'video') {
                this.loadingPreview = true;
            }
        }
    }

    formWidthChange(width: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = width <= SMALL_SCREEN_LIMIT;
    }

    onFilesSelected(files: File[]): void {
        const file = files[0];
        this.api.setValue(this.binaryFieldFromFile(file));
        this.scaledTransform = {};
        this.transformParams = undefined;
    }

    onImageLoad(): void {
        this.loadingPreview = false;
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
                if (newFile) {
                    this.api.setValue(this.binaryFieldFromFile(newFile));
                    // We defer updating the scaledTransform value until after the preview image has loaded,
                    // otherwise the parameters will be overwritten by defaults. This only needs to be done
                    // when working with new files (and consequently binary objectUrls) since the image load
                    // event does not re-fire for urls which have already been loaded once.
                    this.lastParams = params;
                } else {
                    const value = this.api.getValue();
                    this.scaledTransform = this.calculateScaledTransformParams(this.binaryProperties, params);
                    this.api.setValue({ ...value, ...{ transform: params } });
                }
                this.transformParams = params;
                this.changeDetector.markForCheck();
            });
    }

    /**
     * Creates a BinaryField object from a File which is to be uploaded.
     */
    private binaryFieldFromFile(file: File): BinaryField {
        return {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            file
        };
    }

    /**
     * Scales the ImageTransformParams from editing an image down to the correct proportions to fit the size-constrained
     * version which is used as a preview.
     */
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

    /**
     * Returns the constrained dimensions of the image as defined by the maxImageWidth & maxImageHeight fields. Also
     * returns the ratio by which the natural dimensions have been scaled down.
     */
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
    private getMimeType(mimeType: string): 'image' | 'video' | 'audio' | string | null {
        if (!mimeType) {
            return null;
        }
        return (mimeType.split('/')[0] as string).toLowerCase();
    }
}
