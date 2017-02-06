import {
    Component, Input, ViewContainerRef, OnChanges, SimpleChanges,
    ComponentRef
} from '@angular/core';
import { Schema, SchemaField } from '../../../../common/models/schema.model';
import { MeshNode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';

export type SchemaFieldPath = Array<string | number>;

export type UpdateFunction = {
    (path: SchemaFieldPath, value: NodeFieldType): void;
}

export interface SchemaFieldControl {
    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void;
    valueChange(value: NodeFieldType): void;
}

@Component({
    selector: 'form-generator',
    templateUrl: 'form-generator.component.html',
    styleUrls: ['form-generator.scss']
})
export class FormGeneratorComponent implements OnChanges {
    @Input() schema: Schema;
    @Input() node: MeshNode;

    private componentRefs: ComponentRef<SchemaFieldControl>[] = [];
    private fieldGenerator: FieldGenerator;

    constructor(viewContainerRef: ViewContainerRef, fieldGeneratorService: FieldGeneratorService) {
        const updateFn = (path: string[], value: NodeFieldType) => {
            this.onChange(path, value);
        };

        this.fieldGenerator = fieldGeneratorService.create(viewContainerRef, updateFn);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['schema']) {
            this.generateForm();
        }
    }

    generateForm(): void {
        this.componentRefs.forEach(componentRef => componentRef.hostView.destroy());
        this.componentRefs = [];

        this.schema.fields.forEach(field => {
            const value = this.node.fields[field.name];
            const controlType = getControlType(field.type);
            if (controlType) {
                const componentRef = this.fieldGenerator.attachField([field.name], field, value, controlType);
                if (componentRef) {
                    this.componentRefs.push(componentRef);
                }
            }
        });
    }

    private onChange(path: string[], value: any): void {
        const clone: MeshNode = JSON.parse(JSON.stringify(this.node));
        console.log(`updating:`, path, 'with value:', value);
        this.updateAtPath(clone.fields, path, value);
        console.log(`new node.fields value:`, clone.fields);
    }


    /**
     * Given an object, update the value specified by the `path` array with the given value.
     */
    private updateAtPath(object: any, path: any[], value: any): any {
        let pointer = this.getPointerByPath(object, path);
        return pointer[path[path.length - 1]] = value;
    }

    /**
     * Given an object and a path e.g. ['foo', 'bar'], return the a pointer to
     * the object.foo.bar property.
     */
    private getPointerByPath(object: any, path: any[]): any {
        let pointer = object;
        for (let i = 0; i < path.length - 1; i++) {
            let key = path[i];
            if (!pointer[key]) {
                pointer[key] = {};
            }
            pointer = pointer[key];
        }
        return pointer;
    }
}
