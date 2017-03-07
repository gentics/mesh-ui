import { Injectable } from '@angular/core';
import { MeshFieldComponent, SchemaFieldPath } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import { MeshControl } from './mesh-control.class';

/**
 * A service which represents the root of the tree of MeshControls which make up the form in the editor.
 */
@Injectable()
export class MeshControlGroup {

    get isValid(): boolean {
        return !!this._rootControl && this.rootControl.isValid;
    }

    private get rootControl(): MeshControl {
        if (!this._rootControl) {
            throw new Error('No rootControl was set. Did you forget to call MeshControlGroup.init()?');
        }
        return this._rootControl;
    }

    private _rootControl: MeshControl;

    init(): void {
        this._rootControl = new MeshControl();
    }

    addControl(field: SchemaField, initialValue: any, meshField: MeshFieldComponent): void {
        this.rootControl.addChild(field, initialValue, meshField);
    }

    checkValue(values: { [p: string]: NodeFieldType }): void {
        this.rootControl.children.forEach((meshControl, key) => {
            if (values.hasOwnProperty(key)) {
                meshControl.checkValue(values[key]);
            }
        });
    }

    getMeshControlAtPath(path: SchemaFieldPath): MeshControl {
        return this.rootControl.getMeshControlAtPath(path);
    }
}
