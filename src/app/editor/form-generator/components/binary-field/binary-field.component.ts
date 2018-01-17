import { Component } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';

@Component({
    selector: 'binary-field',
    templateUrl: './binary-field.component.html',
    styleUrls: ['./binary-field.scss']
})
export class BinaryFieldComponent extends BaseFieldComponent {
    field: SchemaField;
    binaryProperties: Array<{ key: string; value: any }> = [];
    api: MeshFieldControlApi;

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
    }

    valueChange(value: NodeFieldType): void {
        this.binaryProperties = Object.keys(value || {}).map(key => ({ key, value: value[key] }));
    }

    formWidthChange(width: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = width <= SMALL_SCREEN_LIMIT;
    }

    onFilesSelected(files: any[]): void {
        this.api.setValue(files[0]);
    }
}
