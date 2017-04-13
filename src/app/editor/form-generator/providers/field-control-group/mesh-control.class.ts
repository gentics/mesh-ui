import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { MeshFieldComponent, SchemaFieldPath } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';

export const ROOT_TYPE = 'root';
export const ROOT_NAME = 'root';

class RootFieldDefinition {
    type = ROOT_TYPE;
    name = ROOT_NAME;
    required = false;
}

/**
 * A MeshControl is a wrapper around a MeshFieldComponent, and is responsible for propagating calls to the
 * MeshFieldComponent.valueChange() method whenever the associated value changes. MeshControls can be nested
 * by use of the addChild() method, which allows the implementation of complex types such as lists and
 * micronodes.
 */
export class MeshControl {
    meshField: MeshFieldComponent;
    children = new Map<string | number, MeshControl>();
    fieldDef: SchemaField | RootFieldDefinition;
    private lastValue;

    get isValid(): boolean {
        const required = this.fieldDef.required === true;
        const selfValid = !required || (required && !!this.lastValue);
        const childrenValid = Array.from(this.children.values())
            .reduce((valid, control) => !valid ? false : control.isValid, true);
        return selfValid && childrenValid;
    }

    constructor();
    constructor(fieldDef: SchemaField, initialValue: any, meshFieldInstance?: MeshFieldComponent);
    constructor(fieldDef?: SchemaField, initialValue?: any, meshFieldInstance?: MeshFieldComponent) {
        this.lastValue = initialValue;
        this.fieldDef = fieldDef === undefined ? new RootFieldDefinition() : fieldDef;
        if (meshFieldInstance) {
            this.registerMeshFieldInstance(meshFieldInstance);
        }
    }

    registerMeshFieldInstance(meshFieldInstance: MeshFieldComponent): void {
        this.meshField = meshFieldInstance;
    }

    /**
     * Runs the `valueChange()` function for this control's MeshFieldComponent, and optionally checks recursively for all descendants.
     */
    checkValue(value: NodeFieldType, recursive: boolean = false) {
        if (this.meshField) {
            (this.meshField as BaseFieldComponent).valueChange(value, this.lastValue);
        }
        this.lastValue = value;

        if (recursive && 0 < this.children.size) {
            const isMicronode = this.fieldDef.type === 'micronode';
            const valueContainer = isMicronode && value && value.hasOwnProperty('fields') ? (value as NodeFieldMicronode).fields : value;
            if (valueContainer) {
                this.children.forEach((meshControl, key) => {
                    meshControl.checkValue(valueContainer[key], true);
                });
            }
        }
    }

    /**
     * Remove all child MeshControls.
     */
    clearChildren(): void {
        this.children.clear();
    }

    /**
     * Adds a new MeshControl as a child of this one.
     */
    addChild(field: SchemaField, initialValue: any, control?: MeshFieldComponent): MeshControl {
        const useStringIndex = this.fieldDef.type === 'micronode' || this.fieldDef.type === ROOT_TYPE;
        const meshControl = new MeshControl(field, initialValue, control);
        const key = useStringIndex ? field.name : this.children.size;
        this.children.set(key, meshControl);
        return meshControl;
    }

    /**
     * Given a path (e.g. ['locations', 0, 'longitude']), returns the associated MeshControl if one exists.
     */
    getMeshControlAtPath(path: SchemaFieldPath): MeshControl | undefined {
        let pointer: MeshControl | undefined = this;
        const isMicronode = (control: MeshControl): boolean => control.fieldDef.type === 'micronode';

        path.forEach((key, index) => {
            if (pointer) {
                if (isMicronode(pointer)) {
                    // skip the "fields" key, since it simply refers to the contents of the micronode group.
                    if (key !== 'fields') {
                        if (!pointer.children.get(key)) {
                            pointer = undefined;
                        } else {
                            pointer = pointer.children.get(key);
                        }
                    } else if (index === path.length - 1) {
                        pointer = undefined;
                    }
                } else {
                    pointer = pointer.children.get(key);
                }
            }
        });
        return pointer;
    }
}
