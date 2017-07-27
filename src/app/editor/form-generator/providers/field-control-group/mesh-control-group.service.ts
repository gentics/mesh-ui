import { Injectable } from '@angular/core';
import { GetNodeValueFunction, GetNodeValueReturnType, SchemaFieldPath } from '../../common/form-generator-models';
import { MeshNode, NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import { ControlChanges, MeshControl } from './mesh-control.class';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';

/**
 * A service which represents the root of the tree of MeshControls which make up the form in the editor.
 */
@Injectable()
export class MeshControlGroupService {

    get isValid(): boolean {
        return !!this._rootControl && this.rootControl.isValid;
    }

    private get rootControl(): MeshControl<any> {
        if (!this._rootControl) {
            throw new Error('No rootControl was set. Did you forget to call MeshControlGroup.init()?');
        }
        return this._rootControl;
    }

    private _rootControl: MeshControl<any> | undefined;
    private getNodeFn: GetNodeValueFunction;

    /**
     * Creates a new MeshControl as the root control for the group. This method must be invoked before attempting
     * to use the other class methods.
     */
    init(getNodeFn: GetNodeValueFunction): void {
        this.getNodeFn = getNodeFn;
        this._rootControl = new MeshControl();
    }

    /**
     * Invokes the getNodeFn which returns the value of the node.
     */
    getNodeValue(path?: SchemaFieldPath): GetNodeValueReturnType {
        if (typeof this.getNodeFn !== 'function') {
            throw new Error('No getNodeFn was set. Did you forget to call MeshControlGroup.init()?');
        } else {
            return this.getNodeFn(path);
        }
    }

    /**
     * Returns a tree of ControlChanges for all the fields in the form.
     */
    getChanges(): ControlChanges<undefined> {
        return this.rootControl.getChanges();
    }

    /**
     * Returns a flat list of changed controls with paths and values.
     */
    getChangesByPath(): ChangesByPath[] {
        const changes = this.rootControl.getChanges();
        return getChangesByPath(changes);
    }

    isDirty(): boolean {
        if (!this._rootControl) {
            return false;
        }
        const changes = this.rootControl.getChanges();
        return checkForChanges(changes);
    }

    reset(): void {
        if (this._rootControl && this.isDirty()) {
            this.rootControl.reset();
        }
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
            const pathToTarget: SchemaFieldPath = [];
            do {
                const nextKey = path.shift();
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
     * Causes the `nodeChanged()` method to be invoked for all controls in the group.
     */
    nodeChanged(path: SchemaFieldPath, value: any, node: MeshNode): void {
        this.rootControl.nodeChanged(path, value, node);
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
    getMeshControlAtPath(path: SchemaFieldPath): MeshControl<any> | undefined {
        return this.rootControl.getMeshControlAtPath(path);
    }
}

/**
 * Recursively inspects a ControlChanges object and returns true if the root or any descendants have changed.
 */
export function checkForChanges(changes: ControlChanges<any>): boolean {
    const children: Array<ControlChanges<any>> = Object.keys(changes.children).map(k => changes.children[k]);

    if (changes.changed) {
        return true;
    } else if (0 < children.length) {
        return children.reduce((hasChanges, change) => {
            return hasChanges || checkForChanges(change);
        }, false);
    }
    return false;
}

export interface ChangesByPath {
    path: SchemaFieldPath;
    initialValue: any;
    currentValue: any;
}

/**
 * Returns a flat list of changed controls with paths and values.
 */
export function getChangesByPath(changes: ControlChanges<any>): ChangesByPath[] {
    const result: ChangesByPath[] = [];

    function check(changes: ControlChanges<any>, path: SchemaFieldPath) {
        if (changes.changed) {
            result.push({
                path,
                initialValue: changes.initialValue,
                currentValue: changes.currentValue
            });
        }
        const childrenKeys = Object.keys(changes.children);
        if (0 < childrenKeys.length) {
            childrenKeys.forEach(key => {
                check(changes.children[key], [...path, key]);
            });
        }
    }

    check(changes, []);

    return result;
}
