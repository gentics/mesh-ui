import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { MeshFieldComponent, SchemaFieldPath } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';

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

    checkValue(value: NodeFieldType) {
        if (value !== this.lastValue) {
            console.log(`running valueChange() on field ${this.fieldDef.name}`);
            if (this.meshField) {
                this.meshField.valueChange(value);
            }
            this.lastValue = value;
        }

        if (0 < this.children.size) {
            const isMicronode = this.fieldDef.type === 'micronode';
            const valueContainer = isMicronode && value.hasOwnProperty('fields') ? (value as NodeFieldMicronode).fields : value;
            this.children.forEach((meshControl, key) => {
                meshControl.checkValue(valueContainer[key]);
            });
        }
    }

    clearChildren(): void {
        this.children.clear();
    }

    addChild(field: SchemaField, initialValue: any, control?: MeshFieldComponent): MeshControl {
        const useStringIndex = this.fieldDef.type === 'micronode' || this.fieldDef.type === ROOT_TYPE;
        const meshControl = new MeshControl(field, initialValue, control);
        const key = useStringIndex ? field.name : this.children.size;
        this.children.set(key, meshControl);
        return meshControl;
    }

    getMeshControlAtPath(path: SchemaFieldPath): MeshControl {
        let pointer: MeshControl = this;
        const isMicronode = (control: MeshControl): boolean => control.fieldDef.type === 'micronode';

        for (let key of path) {
            if (isMicronode(pointer)) {
                // skip the "fields" key, since it simply refers to the contents of the micronode group.
                if (key !== 'fields') {
                    if (!pointer.children.get(key)) {
                        throw new Error(`Path [${path.join(', ')}] not valid`);
                    }
                    pointer = pointer.children.get(key) as MeshControl;
                }
            } else {
                pointer = pointer.children.get(key) as MeshControl;
            }
        }
        return pointer as MeshControl;
    }
}
