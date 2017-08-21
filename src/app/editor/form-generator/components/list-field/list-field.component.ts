import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    OnDestroy,
    OnInit,
    Optional,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';
import { ISortableEvent, ISortableGroupOptions } from 'gentics-ui-core';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { ListTypeFieldType, SchemaField } from '../../../../common/models/schema.model';
import { Microschema } from '../../../../common/models/microschema.model';
import { ListField, ListNodeFieldType, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService, FieldSet } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { initializeListValue } from '../../common/initialize-list-value';
import { Observable, Subscription } from 'rxjs';
import { MeshControlGroupService } from '../../providers/field-control-group/mesh-control-group.service';
import { BaseFieldComponent, FIELD_FULL_WIDTH, FIELD_HALF_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { MicronodeFieldComponent } from '../micronode-field/micronode-field.component';
import { ApplicationStateService } from '../../../../state/providers/application-state.service';
import { EntitiesService } from '../../../../state/providers/entities.service';

function randomId(): string {
    return Math.random().toString(36).substring(5);
}

@Component({
    selector: 'list-field',
    templateUrl: './list-field.component.html',
    styleUrls: ['./list-field.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFieldComponent extends BaseFieldComponent implements AfterViewInit, OnDestroy, OnInit  {

    api: MeshFieldControlApi;
    field: SchemaField;
    value: ListField<ListNodeFieldType>;
    @ViewChildren('listItem', { read: ViewContainerRef })
    listItems: QueryList<ViewContainerRef>;
    @ViewChild('listContainer', { read: ElementRef })
    listContainer: ElementRef;
    @HostBinding('class.micronode-list')
    isMicronodeList: boolean = false;
    listHeight: string = 'auto';
    updating: boolean = false;
    groupId: string = randomId();
    removeGroupId: string = randomId();
    dragging: boolean = false;
    hoverRemoveArea: boolean = false;
    mainGroup: ISortableGroupOptions = {
        name: this.groupId,
        pull: e => e.options.group.name === this.removeGroupId ? 'clone' : true,
        put: true,
        revertClone: false
    };
    get disableScrollTarget(): boolean {
        return this.isCompact || !!this.micronodeField;
    }

    private fieldSets: Array<FieldSet<BaseFieldComponent>> = [];
    private fieldGenerator: FieldGenerator;
    private subscription: Subscription;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private meshControlGroup: MeshControlGroupService,
                private viewContainerRef: ViewContainerRef,
                private state: ApplicationStateService,
                private entities: EntitiesService,
                changeDetector: ChangeDetectorRef,
                public elementRef: ElementRef,
                @Optional() private micronodeField?: MicronodeFieldComponent
    ) {
        super(changeDetector);

    }

    ngOnInit(): void {
        this.isMicronodeList = this.field.listType === 'micronode';
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
                    this.changeDetector.markForCheck();
                }, 100);
            });
        });

        this.listItems.notifyOnChanges();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.fieldSets.forEach(componentRef => componentRef.destroy());
    }

    onMove = (e): boolean => {
        this.hoverRemoveArea = e.to.classList.contains('remove-area');
        this.changeDetector.markForCheck();
        return true;
    }

    trackByFn(index): number {
        return index;
    }

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue() as ListField<ListNodeFieldType>;
        this.api = api;
        this.field = api.field;
    }

    valueChange(newValue: ListField<ListNodeFieldType>, oldValue: ListField<ListNodeFieldType>): void {
        if (newValue !== oldValue) {
            this.listHeight = this.listContainer.nativeElement.offsetHeight + 'px';
            this.updating = true;
            this.value = Array.from(Array(0).keys()) as any;

            setTimeout(() => {
                this.value = newValue;
                this.changeDetector.markForCheck();
            });
        }
    }

    formWidthChange(widthInPixels: number): void {
        if (this.isMicronodeList) {
            this.setWidth(FIELD_FULL_WIDTH);
        } else {
            if (widthInPixels < SMALL_SCREEN_LIMIT) {
                this.setWidth(FIELD_FULL_WIDTH);
            } else {
                this.setWidth(FIELD_HALF_WIDTH);
            }
        }
        this.isCompact = widthInPixels <= SMALL_SCREEN_LIMIT;
    }

    dragEnd(e: ISortableEvent): void {
        this.dragging = false;
        if (!this.updating) {
            this.reorderList(e);
        }
        this.changeDetector.markForCheck();
    }

    deleteItem(e: ISortableEvent): void {
        const newValue = this.value.slice(0);
        newValue.splice(e.oldIndex, 1);
        this.api.setValue(newValue);
    }

    addNewElement(e: ISortableEvent): void {
        const el = e.item as HTMLElement;
        const microschemaName = el.dataset['microschemaName'];
        this.addItem(microschemaName, e.newIndex);
    }

    addItem(microschemaName?: string, index?: number): void {
        let lookup: Observable<Microschema | undefined>;
        const insertIndex = typeof index === 'number' ? index : this.value.length;
        if (typeof microschemaName === 'string') {
            lookup = this.entities.selectAllMicroschemas()
                .map(microschemas => microschemas.find(microschema => microschema.name === microschemaName));
        } else {
            lookup = Observable.of(undefined);
        }

        lookup.take(1).subscribe(result => {
            const newItem = initializeListValue(this.field, result);
            const newValue = Array.isArray(this.value) ? this.value.slice() : [];
            newValue.splice(insertIndex, 0, newItem);
            this.api.setValue(newValue);
        });
    }

    createListItems(): void {
        this.fieldSets.forEach(fieldSet => fieldSet.destroy());
        this.fieldSets = [];
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
                    const fieldSet = this.fieldGenerator.attachField({
                        path: this.api.path.concat(index),
                        field: pseudoField,
                        value,
                        fieldComponent: controlType,
                        viewContainerRef
                    });
                    fieldSet.field.instance.isListItem = true;
                    newContainer.registerMeshFieldInstance(fieldSet.field.instance);
                    this.fieldSets.push(fieldSet);
                });
            }
            this.changeDetector.markForCheck();
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
