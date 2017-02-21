import { Injectable } from '@angular/core';
import { SchemaFieldControl, SchemaFieldPath } from '../../components/form-generator/form-generator.component';
import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';

export class FieldControlContainer {
    control: SchemaFieldControl;
    listItems?: FieldControlContainer[];
    micronodeItems?: FieldControlGroup;

    private lastValue;
    private checkValueInternal: (value: NodeFieldType) => void;

    constructor(private field: SchemaField, initialValue: any, control?: SchemaFieldControl) {
        this.lastValue = initialValue;
        if (control) {
            this.registerControlInstance(control);
        }
    }

    registerControlInstance(control: SchemaFieldControl): void {
        this.control = control;

        this.checkValue = (value: NodeFieldType) => {
            if (value !== this.lastValue) {
                console.log(`running valueChange() on field ${this.field.name}`);
                this.control.valueChange(value);
                this.lastValue = value;
            }

            if (this.listItems) {
                this.listItems.forEach((item, index) => item.checkValue(value[index]));
            }

            if (this.micronodeItems) {
                this.micronodeItems.checkValue((value as NodeFieldMicronode).fields);
            }
        };
    }

    clearListItems(): void {
        this.listItems = [];
    }

    addListItemControl(field: SchemaField, initialValue: any, control?: SchemaFieldControl): FieldControlContainer {
        if (!this.listItems) {
            this.listItems = [];
        }
        const newContainer = new FieldControlContainer(field, initialValue, control);
        this.listItems.push(newContainer);
        return newContainer;
    }

    addMicronodeItemControl(field: SchemaField, initialValue: any, control?: SchemaFieldControl): FieldControlContainer {
        if (!this.micronodeItems) {
            this.micronodeItems = new FieldControlGroup();
        }
        return this.micronodeItems.addControl(field, initialValue, control);
    }

    checkValue(value: NodeFieldType): void {
        if (typeof this.checkValueInternal === 'function') {
            this.checkValueInternal(value);
        }
    }
}

export class FieldControlGroup {

    private controls: { [name: string]: FieldControlContainer } = {};

    addControl(field: SchemaField, initialValue: any, control?: SchemaFieldControl): FieldControlContainer {
        const newContainer = new FieldControlContainer(field, initialValue, control);
        this.controls[field.name] = newContainer;
        return newContainer;
    }

    checkValue(values: { [fieldName: string]: NodeFieldType; }): void {
        for (let fieldName in values) {
            if (values.hasOwnProperty(fieldName) && this.controls[fieldName]) {
                const target = this.controls[fieldName];
                target.checkValue(values[fieldName]);
            }
        }
    }

    getControlContainerAtPath(path: SchemaFieldPath): FieldControlContainer {
        let pointer: FieldControlContainer | FieldControlGroup = this;
        for (let i = 0; i < path.length; i++) {
            let key = path[i];

            if (pointer instanceof FieldControlGroup) {
                if (!pointer.controls[key]) {
                    throw new Error(`Path [${path.join(', ')}] not valid`);
                }
                pointer = pointer.controls[key];
            } else if (pointer instanceof FieldControlContainer) {
                if (typeof key === 'number' && pointer.listItems) {
                    pointer = pointer.listItems[key];
                } else if (pointer.micronodeItems) {
                    // skip the "fields" key, since it simply refers to the contents of the
                    // micronode group.
                    if (key !== 'fields') {
                        pointer = pointer.micronodeItems.controls[key];
                    }
                }
            }
        }
        return pointer as FieldControlContainer;
    }
}

@Injectable()
export class FieldControlGroupService {

    private rootGroup: FieldControlGroup;

    init(): void {
        this.rootGroup = new FieldControlGroup();
    }

    addControl(field: SchemaField, initialValue: any, control: SchemaFieldControl): void {
        this.rootGroup.addControl(field, initialValue, control);
    }

    checkValue(values: { [p: string]: NodeFieldType }): void {
        this.rootGroup.checkValue(values);
    }

    getControlContainerAtPath(path: SchemaFieldPath): FieldControlContainer {
        return this.rootGroup.getControlContainerAtPath(path);
    }
}
