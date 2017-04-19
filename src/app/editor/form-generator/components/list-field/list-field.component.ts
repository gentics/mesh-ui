import { AfterViewInit, Component, ComponentRef, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ISortableEvent, ISortableGroupOptions } from 'gentics-ui-core';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { ListTypeFieldType, SchemaField } from '../../../../common/models/schema.model';
import { Microschema } from '../../../../common/models/microschema.model';
import { ListableNodeFieldType, NodeFieldList, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { initializeListValue } from '../../common/initialize-list-value';
import { mockGetMicroschemaByName } from '../../common/mock-get-microschema';
import { Observable, Subscription } from 'rxjs';
import { MeshControlGroup } from '../../providers/field-control-group/mesh-control-group.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

function randomId(): string {
    return Math.random().toString(36).substring(5);
}

@Component({
    selector: 'list-field',
    templateUrl: './list-field.component.html',
    styleUrls: ['./list-field.scss']
})
export class ListFieldComponent extends BaseFieldComponent implements AfterViewInit, OnDestroy  {

    api: MeshFieldControlApi;
    field: SchemaField;
    value: NodeFieldList<ListableNodeFieldType>;
    @ViewChildren('listItem', { read: ViewContainerRef })
    listItems: QueryList<ViewContainerRef>;
    @ViewChild('listContainer', { read: ElementRef })
    listContainer: ElementRef;
    listHeight: string = 'auto';
    updating: boolean = false;
    groupId: string = randomId();
    removeGroupId: string = randomId();
    displayRemoveArea: boolean = false;
    hoverRemoveArea: boolean = false;
    mainGroup: ISortableGroupOptions = {
        name: this.groupId,
        pull: (e) => e.options.group.name === this.removeGroupId ? 'clone' : true,
        put: false,
        revertClone: false
    };

    private componentRefs: Array<ComponentRef<BaseFieldComponent>> = [];
    private fieldGenerator: FieldGenerator;
    private subscription: Subscription;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private meshControlGroup: MeshControlGroup,
                private viewContainerRef: ViewContainerRef) {
        super();
    }

    ngAfterViewInit(): void {
        const updateFn = (path: SchemaFieldPath, value: NodeFieldType) => this.api.setValue(value, path);
        this.fieldGenerator = this.fieldGeneratorService.create(this.viewContainerRef, updateFn);
        // Instantiating the dynamic child components inside the ngAfterViewInit hook will lead to
        // change detection errors, hence the setTimeout. See https://github.com/angular/angular/issues/10131
        this.subscription = this.listItems.changes.subscribe((val) => {
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

    onMove = (e): boolean => {
        this.hoverRemoveArea = e.to.classList.contains('remove-area');
        return true;
    }

    trackByFn(index): number {
        return index;
    }

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue() as NodeFieldList<ListableNodeFieldType>;
        this.api = api;
        this.field = api.field;
    }

    valueChange(newValue: NodeFieldList<ListableNodeFieldType>, oldValue: NodeFieldList<ListableNodeFieldType>): void {
        if (newValue !== oldValue) {
            this.listHeight = this.listContainer.nativeElement.offsetHeight + 'px';
            this.updating = true;
            this.value = Array.from(Array(0).keys()) as any;

            setTimeout(() => {
                this.value = newValue;
            });
        }
    }

    formWidthChange(widthInPixels: number): void {
        if (this.field.listType === 'micronode') {
            this.setWidth('100%');
        } else {
            if (widthInPixels < 800) {
                this.setWidth('100%');
            } else {
                this.setWidth('42%');
            }
        }
    }

    dragStart(): void {
        this.displayRemoveArea = true;
    }

    dragEnd(e: ISortableEvent): void {
        this.displayRemoveArea = false;
        if (!this.updating) {
            this.reorderList(e);
        }
    }

    deleteItem(e: ISortableEvent): void {
        const spliced = this.value.slice(0);
        spliced.splice(e.oldIndex, 1);
        this.api.setValue(spliced);
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
            this.api.setValue(this.value.concat(newItem));
        });
    }

    createListItems(): void {
        this.componentRefs.forEach(componentRef => componentRef.destroy());
        this.componentRefs = [];
        const fieldType = this.field.listType as ListTypeFieldType;
        const controlType = getControlType({ type: fieldType } as any);
        const meshControl = this.meshControlGroup.getMeshControlAtPath(this.api.path);
        if (meshControl) {
            this.removeSortableGeneratedItems();
            meshControl.clearChildren();

            if (controlType && this.fieldGenerator && this.listItems) {
                this.listItems.toArray().forEach((viewContainerRef, index) => {
                    const pseudoField = {
                        name: ``,
                        type: fieldType
                    };
                    const value = this.value[index];
                    const newContainer = meshControl.addChild(pseudoField, value);
                    const componentRef = this.fieldGenerator.attachField(
                        this.api.path.concat(index),
                        pseudoField,
                        value,
                        controlType,
                        viewContainerRef
                    );

                    newContainer.registerMeshFieldInstance(componentRef.instance);
                    this.componentRefs.push(componentRef);
                });
            }
        }
    }

    private reorderList(e: ISortableEvent): void {
        if (!this.updating) {
            const sorted = e.sort(this.value);
            this.api.setValue(sorted);
        }
    }

    /**
     * When deleting an item, Sortablejs will clone the list item back into the list asyncronously, so that when we update from the
     * actual model, there is this unwanted clone in the DOM. In this method we look for any of these items and remove them.
     */
    private removeSortableGeneratedItems(): void {
        const listContainer = this.listContainer.nativeElement as HTMLElement;
        const addedBySortable = Array.from(listContainer.querySelectorAll('[draggable]'));
        addedBySortable.forEach((el: HTMLElement) => {
            if (el.parentElement) {
                el.parentElement.removeChild(el);
            }
        });
    }
}
