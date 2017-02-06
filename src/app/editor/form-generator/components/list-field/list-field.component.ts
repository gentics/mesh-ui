import {
    AfterViewInit, Component, ComponentRef, ViewChildren,
    ViewContainerRef, QueryList
} from '@angular/core';
import { ISortableEvent } from 'gentics-ui-core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { ListableNodeFieldType, NodeFieldList, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';

@Component({
    selector: 'list-field',
    templateUrl: './list-field.component.html',
    styleUrls: ['./list-field.scss']
})
export class ListFieldComponent implements SchemaFieldControl, AfterViewInit {

    path: SchemaFieldPath;
    field: SchemaField;
    value: NodeFieldList<ListableNodeFieldType>;
    @ViewChildren('listItem', { read: ViewContainerRef }) listItems: QueryList<ViewContainerRef>;
    componentRefs: ComponentRef<SchemaFieldControl>[] = [];
    private update: UpdateFunction;
    private fieldGenerator: FieldGenerator;

    constructor(private fieldGeneratorService: FieldGeneratorService, private viewContainerRef: ViewContainerRef) {}

    ngAfterViewInit(): void {
        const updateFn = (path: SchemaFieldPath, value: NodeFieldType) => this.update(path, value);
        this.fieldGenerator = this.fieldGeneratorService.create(this.viewContainerRef, updateFn);
        this.createListItems();
    }

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldList<ListableNodeFieldType>, update: UpdateFunction): void {
        this.value = value;
        this.update = update;
        this.field = field;
        this.path = path;
        this.createListItems();
    }

    valueChange(value: NodeFieldList<ListableNodeFieldType>): void {
        this.value = value;
        this.createListItems();
    }

    reorderList(e: ISortableEvent): void {
        const sorted = e.sort(this.value);
        this.update(this.path, sorted);
    }

    addItem(): void {
        const newItem = this.createListItems();
    }

    createListItems(): void {
        const fieldType = this.field.listType as any;
        const controlType = getControlType(fieldType);
        if (controlType && this.fieldGenerator && this.listItems) {
            this.listItems.toArray().forEach((viewContainerRef, index) => {

                const value = this.value[index];
                this.fieldGenerator.attachField(
                    this.path.concat(index),
                    {
                        name: `${this.field.name} ${index}`,
                        type: fieldType
                    },
                    value,
                    controlType,
                    viewContainerRef
                );
            });
        }
    }

    private createNewListItem(): any {
        // 'node' | 'boolean' | 'string' | 'number' | 'date' | 'html' | 'micronode' | 'binary'
        switch (this.field.listType) {
            case 'html':
            case 'string':
                return '';
            case 'node':
            case 'boolean':
                return false;
            case 'number':
                return this.field.min || 0;
            case 'date':
                return new Date().toISOString();
            case 'micronode':
            case 'binary':
        }
    }
}
