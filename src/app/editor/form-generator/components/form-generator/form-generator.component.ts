import { AfterViewInit, Component, ComponentRef, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Schema } from '../../../../common/models/schema.model';
import { MeshNode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { MeshControlGroup } from '../../providers/field-control-group/mesh-control-group.service';
import { MeshFieldComponent } from '../../common/form-generator-models';

@Component({
    selector: 'form-generator',
    templateUrl: 'form-generator.component.html',
    styleUrls: ['form-generator.scss']
})
export class FormGeneratorComponent implements OnChanges, AfterViewInit {
    @Input() schema: Schema;
    @Input() node: MeshNode;

    @ViewChild('formRoot', { read: ViewContainerRef })
    private formRoot: ViewContainerRef;
    private componentRefs: Array<ComponentRef<MeshFieldComponent>> = [];
    private fieldGenerator: FieldGenerator;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private meshControlGroup: MeshControlGroup) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['schema']) {
            this.generateForm();
        }
    }

    ngAfterViewInit(): void {
        const updateFn = (path: string[], value: NodeFieldType) => {
            this.onChange(path, value);
        };
        this.fieldGenerator = this.fieldGeneratorService.create(this.formRoot, updateFn);
        this.generateForm();
    }

    formIsValid(): boolean {
        return this.meshControlGroup.isValid;
    }

    generateForm(): void {
        if (this.fieldGenerator && this.schema && this.node) {
            this.componentRefs.forEach(componentRef => componentRef.hostView.destroy());
            this.componentRefs = [];

            this.meshControlGroup.init();

            this.schema.fields.forEach(field => {
                const value = this.node.fields[field.name];
                const controlType = getControlType(field.type);
                if (controlType) {
                    const componentRef = this.fieldGenerator.attachField([field.name], field, value, controlType);
                    if (componentRef) {
                        this.componentRefs.push(componentRef);
                    }
                    this.meshControlGroup.addControl(field, value, componentRef.instance);
                }
            });
        }
    }

    private onChange(path: string[], value: any): void {
        this.updateAtPath(this.node.fields, path, value);
        console.log(`updating:`, path, 'with value:', value);
        this.meshControlGroup.checkValue(this.node.fields);
    }

    /**
     * Given an object, update the value specified by the `path` array with the given value.
     * Note: this method mutates the object passed in.
     */
    private updateAtPath(object: any, path: any[], value: any): any {
        let pointer = this.getPointerByPath(object, path);
        return pointer[path[path.length - 1]] = this.clone(value);
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

    private clone<T>(value: T): T {
        return JSON.parse(JSON.stringify(value));
    }
}
