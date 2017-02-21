import { AfterViewInit, Component, ComponentRef, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ISortableEvent } from 'gentics-ui-core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { Microschema } from '../../../../common/models/microschema.model';
import { ListableNodeFieldType, NodeFieldList, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { initializeListValue } from '../../common/initialize-list-value';
import { mockGetMicroschemaByName } from '../../common/mock-get-microschema';
import { Observable, Subscription } from 'rxjs';
import { FieldControlGroupService } from '../../providers/field-control-group/field-control-group.service';

@Component({
    selector: 'list-field',
    templateUrl: './list-field.component.html',
    styleUrls: ['./list-field.scss']
})
export class ListFieldComponent implements SchemaFieldControl, AfterViewInit, OnDestroy {

    path: SchemaFieldPath;
    field: SchemaField;
    value: NodeFieldList<ListableNodeFieldType>;
    @ViewChildren('listItem', { read: ViewContainerRef })
    listItems: QueryList<ViewContainerRef>;
    @ViewChild('listContainer', { read: ElementRef })
    listContainer: ElementRef;
    listHeight: string = 'auto';
    updating: boolean = false;

    private componentRefs: Array<ComponentRef<SchemaFieldControl>> = [];
    private update: UpdateFunction;
    private fieldGenerator: FieldGenerator;
    private subscription: Subscription;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private fieldControlGroupService: FieldControlGroupService,
                private viewContainerRef: ViewContainerRef) {}

    ngAfterViewInit(): void {
        const updateFn = (path: SchemaFieldPath, value: NodeFieldType) => this.update(path, value);
        this.fieldGenerator = this.fieldGeneratorService.create(this.viewContainerRef, updateFn);
        // Instantiating the dynamic child components inside the ngAfterViewInit hook will lead to
        // change detection errors, hence the setTimeout. See https://github.com/angular/angular/issues/10131
        this.subscription = this.listItems.changes.subscribe((val) => {
            console.log(`listItems.changes`, val.toArray());
            setTimeout(() => {
                this.createListItems();
                setTimeout(() => {
                    this.listHeight = 'auto';
                    this.updating = false;
                }, 100);
            });
        });

        this.listItems.notifyOnChanges();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.componentRefs.forEach(componentRef => componentRef.destroy());
    }

    trackByFn(index): number {
        return index;
    }

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldList<ListableNodeFieldType>, update: UpdateFunction): void {
        this.value = value;
        this.update = update;
        this.field = field;
        this.path = path;
    }

    valueChange(value: NodeFieldList<ListableNodeFieldType>): void {
        console.log(`listField valueChange()`);
        this.listHeight = this.listContainer.nativeElement.offsetHeight + 'px';
        this.updating = true;
        this.value = Array.from(Array(0).keys()) as any;

        setTimeout(() => {
            this.value = value;
        });
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
            this.update(this.path, this.value.concat(newItem));
        });
    }

    createListItems(): void {
        this.componentRefs.forEach(componentRef => componentRef.destroy());
        this.componentRefs = [];
        const fieldType = this.field.listType as any;
        const controlType = getControlType(fieldType);
        const controlContainer = this.fieldControlGroupService.getControlContainerAtPath(this.path);
        controlContainer.clearListItems();

        if (controlType && this.fieldGenerator && this.listItems) {
            console.log(`creating list items`);
            this.listItems.toArray().forEach((viewContainerRef, index) => {
                const pseudoField = {
                    name: `${this.field.name} ${index}`,
                    type: fieldType
                };
                const value = this.value[index];
                const newContainer = controlContainer.addListItemControl(pseudoField, value);
                const componentRef = this.fieldGenerator.attachField(
                    this.path.concat(index),
                    pseudoField,
                    value,
                    controlType,
                    viewContainerRef
                );

                newContainer.registerControlInstance(componentRef.instance);
                this.componentRefs.push(componentRef);
            });
        }
    }
}
