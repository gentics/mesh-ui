import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType, BinaryField, MeshNode } from '../../../../common/models/node.model';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { debuglog } from 'util';
import { ApiService } from '../../../../core/providers/api/api.service';
import { ResourceLoader } from '@angular/compiler';
import { setTimeout } from 'timers';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'binary-field',
    templateUrl: './binary-field.component.html',
    styleUrls: ['./binary-field.scss']
})
export class BinaryFieldComponent extends BaseFieldComponent {
    field: SchemaField;
    //binaryProperties: Array<{ key: string; value: any }> = [];
    binaryProperties: Object;
    api: MeshFieldControlApi;
    //binaryUrl: Promise<string> = null;
    binaryUrl: string | SafeUrl = null;


    constructor(private meshUIAPI: ApiService,
                private sanitizer: DomSanitizer,
                protected changeDetector: ChangeDetectorRef) {

        super(changeDetector);
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
    }

    valueChange(value: NodeFieldType): void {
        //this.binaryProperties = Object.keys(value || {}).map(key => ({ key, value: value[key] }));
        this.binaryProperties = value === null ? null : { ...value as Object };
        if (this.binaryProperties === null || !!this.binaryProperties['mimeType'] === false) {
            this.binaryUrl = null;
            return;
        }

        if (this.binaryProperties['file']) {
            const url = window.URL.createObjectURL(this.binaryProperties['file']);
            this.binaryUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        } else {
            const node: MeshNode = this.api.getNodeValue() as MeshNode;
            const url = this.meshUIAPI.project.getBinaryFileUrl(node.project.name, node.uuid, this.api.field.name);
            this.binaryUrl = url;
        }
    }

    /**
     * returns a 'type' part of the mimeType header
     * image/jpeg => image
     * video/ogg => video
     */
    getBinaryMediaType(): string {

        const mimeType: string = this.binaryProperties['mimeType'];
        if (!!mimeType === false) {
            return null;
        }

        const type = (mimeType.split('/')[0] as string).toLowerCase();
        return type;
    }

    get binaryPropertiesAsArray(): Array<{ key: string; value: any }> {
        return Object.keys(this.binaryProperties || {})
            .filter(key => key !== 'file')
            .map(key => ({ key, value: this.binaryProperties[key] }));
    }

    formWidthChange(width: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = width <= SMALL_SCREEN_LIMIT;
    }

    onFilesSelected(files: any[]): void {
        const file = files[0];
        this.api.setValue({fileName: file.name, fileSize: file.size, mimeType: file.type, file} as BinaryField)
    }
}
