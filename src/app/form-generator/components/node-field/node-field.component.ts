import { Component } from '@angular/core';

import { NodeField, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-node-field',
    templateUrl: './node-field.component.html',
    styleUrls: ['./node-field.scss']
})
export class NodeFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;
    userValue: string;

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
    }

    valueChange(value: NodeField): void {
        this.userValue = (value && value.uuid) || '';
    }

    isValidUuid(): boolean {
        return this.userValue.length === 32;
    }

    doUpdate(): void {
        this.api.setValue({ uuid: this.userValue });
    }
}
