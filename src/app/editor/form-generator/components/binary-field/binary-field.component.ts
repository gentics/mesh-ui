import { Component } from '@angular/core';
import { MeshFieldComponent, SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';

@Component({
    selector: 'binary-field',
    templateUrl: './binary-field.component.html',
    styleUrls: ['./binary-field.scss']
})
export class BinaryFieldComponent implements MeshFieldComponent {
    field: SchemaField;
    binaryProperties: Array<{ key: string; value: any }> = [];
    private path: SchemaFieldPath;
    private update: UpdateFunction;

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void {
        this.update = update;
        this.field = field;
        this.path = path;
        this.valueChange(value);
    }

    valueChange(value: NodeFieldType): void {
        this.binaryProperties = Object.keys(value).map(key => ({ key, value: value[key] }));
    }

    onFilesSelected(files: any[]): void {
        this.update(this.path, files[0]);
    }
}
