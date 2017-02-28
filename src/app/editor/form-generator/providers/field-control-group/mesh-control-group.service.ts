import { Injectable } from '@angular/core';
import { MeshFieldComponent, SchemaFieldPath } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import { MeshControl } from './mesh-control.class';

@Injectable()
export class MeshControlGroup {

    _rootControl: MeshControl;

    init(): void {
        this._rootControl = new MeshControl();
    }

    addControl(field: SchemaField, initialValue: any, meshField: MeshFieldComponent): void {
        this._rootControl.addChild(field, initialValue, meshField);
    }

    checkValue(values: { [p: string]: NodeFieldType }): void {
        this._rootControl.children.forEach((meshControl, key) => {
            if (values.hasOwnProperty(key)) {
                meshControl.checkValue(values[key]);
            }
        });
    }

    getMeshControlAtPath(path: SchemaFieldPath): MeshControl {
        return this._rootControl.getMeshControlAtPath(path);
    }
}
