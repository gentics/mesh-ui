import { AfterViewInit, Component, ComponentRef, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { ISortableEvent } from 'gentics-ui-core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { Microschema } from '../../../../common/models/microschema.model';
import { ListableNodeFieldType, NodeFieldList, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { initializeListValue } from '../../common/initialize-list-value';
import { mockGetMicroschemaByName } from '../../common/mock-get-microschema';
import { Observable } from 'rxjs';

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
    componentRefs: Array<ComponentRef<SchemaFieldControl>> = [];
    private update: UpdateFunction;
    private fieldGenerator: FieldGenerator;

    constructor(private fieldGeneratorService: FieldGeneratorService, private viewContainerRef: ViewContainerRef) {}

    ngAfterViewInit(): void {
        const updateFn = (path: SchemaFieldPath, value: NodeFieldType) => this.update(path, value);
        this.fieldGenerator = this.fieldGeneratorService.create(this.viewContainerRef, updateFn);
        // Instantiating the dynamic child components inside the ngAfterViewInit hook will lead to
        // change detection errors, hence the setTimeout. See https://github.com/angular/angular/issues/10131
        setTimeout(() => this.createListItems());
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

    addItem(microschemaName: string): void {
        let lookup: Observable<Microschema | undefined>;
        if (microschemaName !== undefined) {
            lookup = mockGetMicroschemaByName(microschemaName);
        } else {
            lookup = Observable.of(undefined);
        }

        lookup.take(1).subscribe(result => {
            const newItem = initializeListValue(this.field, result);
            const newItemPath = this.path.concat(this.value.length);
            this.update(newItemPath, newItem);
        });
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
}
