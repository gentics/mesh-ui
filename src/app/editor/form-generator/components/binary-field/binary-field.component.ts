import { Component } from '@angular/core';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../base-field/base-field.component';

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
        this.binaryProperties = Object.keys(value).map(key => ({ key, value: value[key] }));
    }

    onFilesSelected(files: any[]): void {
        this.api.update(files[0]);
    }
}
