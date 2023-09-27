import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalService } from 'gentics-ui-core';
import { GenticsImagePreviewComponent, ImageTransformParams } from 'gentics-ui-image-editor';

import { BinaryField, MeshNode, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { ApiService } from '../../../core/providers/api/api.service';
import { BlobService } from '../../../core/providers/blob/blob.service';
import { getConstrainedDimensions } from '../../../shared/common/get-constrained-dimensions';
import { getFileType } from '../../../shared/common/get-file-type';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { ImageEditorModalComponent } from '../image-editor-modal/image-editor-modal.component';

type ImageBinary = BinaryField & { width: number; height: number };

@Component({
    selector: 'mesh-binary-field',
    templateUrl: './binary-field.component.html',
    styleUrls: ['./binary-field.scss']
})
export class BinaryFieldComponent extends BaseFieldComponent {
    public api: MeshFieldControlApi;
    binaryProperties?: BinaryField;
    binaryMediaType: string | null;
    field: SchemaField;
    objectUrl: string | SafeUrl | null = null;
    loadingPreview = false;
    scaledTransform: Partial<ImageTransformParams> = {};

    @ViewChild(GenticsImagePreviewComponent, { static: false }) private imagePreview: GenticsImagePreviewComponent;
    private lastParams?: ImageTransformParams;
    private transformParams: ImageTransformParams | undefined;
    private readonly maxImageWidth = 750;
    private readonly maxImageHeight = 800;

    constructor(
        private apiService: ApiService,
        private blobService: BlobService,
        private modalService: ModalService,
        protected changeDetector: ChangeDetectorRef
    ) {
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

    valueChange(value?: BinaryField): void {
        if (value) {
            this.binaryProperties = { ...value };
        }
        if (!this.binaryProperties || !this.binaryProperties.mimeType) {
            this.objectUrl = null;
            return;
        }
        const type = getFileType(this.binaryProperties.mimeType, this.binaryProperties.fileName);
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
        if (this.binaryProperties && this.binaryProperties.file && this.lastParams) {
//            this.scaledTransform = {
//                ...this.lastParams,
//                ...{
//                    focalPointX: this.lastParams.focalPointX,
//                    focalPointY: this.lastParams.focalPointY
//                }
//            };
            this.lastParams = undefined;
        }
    }

    editImage(): void {
        const node = this.api.getNodeValue() as MeshNode;
        const imageField = this.binaryProperties as ImageBinary;
        let imageUrl: string | SafeUrl;
        const newFile = imageField.file;
        if (newFile) {
            imageUrl = this.blobService.createObjectURL(newFile);
        } else {
            imageUrl = this.apiService.project.getBinaryFileUrl(
                node.project.name!,
                node.uuid,
                this.api.field.name,
                node.language!,
                node.version
            );
        }

        this.modalService
            .fromComponent(ImageEditorModalComponent, undefined, {
                imageUrl
//                , params: {
//                    ...this.transformParams,
//                    // set focalpoint data if exist
//                    ...(imageField.focalPoint &&
//                        ({
//                            focalPointX: imageField.focalPoint.x,
//                            focalPointY: imageField.focalPoint.y
//                        } as any))
//                }
            })
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
                    //this.scaledTransform = this.calculateScaledTransformParams(imageField, params);
                    this.api.setValue({
                        ...value
//                        // update focalpoint data
//                        , focalPoint: {
//                            x: params.focalPointX,
//                            y: params.focalPointY
//                        },
//                        transform: params
                    });
                }
//              this.transformParams = params;
                this.changeDetector.markForCheck();
            });
    }

    deleteBinary() {
        this.api.setValue(null);
        this.scaledTransform = {};
        this.transformParams = undefined;
        this.binaryProperties = undefined;
        this.binaryMediaType = null;
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
    private calculateScaledTransformParams(
        imageField: ImageBinary,
        params: ImageTransformParams
    ): ImageTransformParams {
        const { ratio } = getConstrainedDimensions(
            imageField.width,
            imageField.height,
            this.maxImageWidth,
            this.maxImageHeight
        );
        const round = (val: number) => Math.round(val);
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
        if (this.binaryMediaType === 'image' && binaryField.width !== undefined && binaryField.height !== undefined) {
            const { width, height } = getConstrainedDimensions(
                binaryField.width,
                binaryField.height,
                this.maxImageWidth,
                this.maxImageHeight
            );
            return this.apiService.project.getBinaryFileUrl(
                node.project.name!,
                node.uuid,
                this.api.field.name,
                node.language!,
                undefined,
                { w: width, h: height }
            );
        } else {
            return this.apiService.project.getBinaryFileUrl(
                node.project.name!,
                node.uuid,
                this.api.field.name,
                node.language!
            );
        }
    }
}
