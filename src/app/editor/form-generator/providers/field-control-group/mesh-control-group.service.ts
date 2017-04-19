import { Injectable } from '@angular/core';
import { SchemaFieldPath } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import { MeshControl } from './mesh-control.class';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';

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

    /**
     * Creates a new MeshControl as the root control for the group. This method must be invoked before attempting
     * to use the other class methods.
     */
    init(): void {
        this._rootControl = new MeshControl();
    }

    /**
     * Add a control to the root of the group.
     */
    addControl(field: SchemaField, initialValue: any, meshField: BaseFieldComponent): void {
        this.rootControl.addChild(field, initialValue, meshField);
    }

    /**
     * Initiates a check of the values for the MeshControls in the group.
     * If the `propertyChanged` path is specified, then only the controls along that path will be checked.
     * Otherwise all controls in the group will be checked.
     */
    checkValue(values: { [p: string]: NodeFieldType }, propertyChanged?: SchemaFieldPath): void {
        if (propertyChanged) {
            const path = propertyChanged.slice();
            let value = values as any;
            let pathToTarget: SchemaFieldPath = [];
            do {
                let nextKey = path.shift();
                if (nextKey !== undefined) {
                    value = value[nextKey];
                    pathToTarget.push(nextKey);
                    const meshControl = this.getMeshControlAtPath(pathToTarget);
                    if (meshControl) {
                        meshControl.checkValue(value, false);
                    }
                }
            } while (0 < path.length);
        } else {
            this.rootControl.children.forEach((meshControl, key) => {
                if (values.hasOwnProperty(key)) {
                    meshControl.checkValue(values[key], true);
                }
            });
        }
    }

    /**
     * Causes the `formWidthChanged()` method to be invoked for all controls in the group.
     */
    formWidthChanged(widthInPixels: number): void {
        this.rootControl.formWidthChanged(widthInPixels);
    }

    /**
     * Returns the MeshControl at the given path in the tree.
     */
    getMeshControlAtPath(path: SchemaFieldPath): MeshControl | undefined {
        return this.rootControl.getMeshControlAtPath(path);
    }
}
