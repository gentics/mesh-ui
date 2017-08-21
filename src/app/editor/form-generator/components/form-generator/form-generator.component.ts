import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    SimpleChange,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { SplitViewContainer } from 'gentics-ui-core';
import { Schema } from '../../../../common/models/schema.model';
import { MeshNode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService, FieldSet } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { ChangesByPath, MeshControlGroupService } from '../../providers/field-control-group/mesh-control-group.service';
import { SchemaFieldPath } from '../../common/form-generator-models';
import { BaseFieldComponent, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

/**
 * Generates a form based on a schema and populates with data from the node.
 */
@Component({
    selector: 'form-generator',
    templateUrl: 'form-generator.component.html',
    styleUrls: ['form-generator.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormGeneratorComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() schema: Schema;
    @Input() node: MeshNode;

    @HostBinding('class.compact')
    isCompact: boolean = false;

    @HostBinding('class.invisible')
    isInvisible: boolean = false;

    /**
     * True if all form controls are valid.
     */
    get isValid(): boolean {
        return this.meshControlGroup.isValid;
    }

    /**
     * Becomes true once a change is made to one of the form controls.
     */
    get isDirty(): boolean {
        return this.meshControlGroup.isDirty();
    }

    @ViewChild('formContainer', { read: ElementRef })
    private formContainer: ElementRef;
    @ViewChild('formRoot', { read: ViewContainerRef })
    private formRoot: ViewContainerRef;
    private fieldSets: Array<FieldSet<BaseFieldComponent>> = [];
    private fieldGenerator: FieldGenerator;
    private formGenerated$ = new Subject<void>();
    private windowResize$ = new Subject<void>();
    private containerResizeSub: Subscription;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private meshControlGroup: MeshControlGroupService,
                private changeDetector: ChangeDetectorRef,
                @Optional() private splitViewContainer: SplitViewContainer) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.schema || this.nodeHasChanged(changes.node)) {
            this.generateForm();
        }
    }

    ngAfterViewInit(): void {
        const updateFn = (path: string[], value: NodeFieldType) => {
            this.onChange(path, value);
        };
        this.fieldGenerator = this.fieldGeneratorService.create(this.formRoot, updateFn);
        this.generateForm();

        this.containerResizeSub = Observable
            .merge(
                this.windowResize$,
                this.formGenerated$,
                this.splitViewContainer && this.splitViewContainer.splitDragEnd || [])
            .startWith(true)
            .debounceTime(200)
            .map(() => this.formContainer.nativeElement.offsetWidth)
            .subscribe(widthInPixels => {
                this.meshControlGroup.formWidthChanged(widthInPixels);
                this.isCompact = widthInPixels <= SMALL_SCREEN_LIMIT;
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy(): void {
        if (this.containerResizeSub) {
            this.containerResizeSub.unsubscribe();
        }
    }

    @HostListener('window:resize')
    resizeHandler(): void {
        this.windowResize$.next();
    }

    generateForm(): void {
        if (this.fieldGenerator && this.schema && this.node) {
            this.isInvisible = true;
            this.fieldSets.forEach(fieldSet => fieldSet.destroy());
            this.fieldSets = [];

            this.meshControlGroup.init((path?: SchemaFieldPath) => {
                if (!path) {
                    return this.clone(this.node);
                } else {
                    const pointer = this.getPointerByPath(this.node.fields, path);
                    const value = pointer[path[path.length - 1]];
                    return value ? this.clone(value) : undefined;
                }
            });

            this.schema.fields.forEach(field => {
                const value = this.node.fields[field.name];
                const controlType = getControlType(field);
                if (controlType) {
                    const fieldSet = this.fieldGenerator.attachField({
                        path: [field.name],
                        field,
                        value,
                        fieldComponent: controlType
                    });
                    if (fieldSet) {
                        this.fieldSets.push(fieldSet);
                    }
                    this.meshControlGroup.addControl(field, value, fieldSet.field.instance);
                }
            });

            this.formGenerated$.next();

            const initialWidth = this.formContainer.nativeElement.offsetWidth;
            this.meshControlGroup.formWidthChanged(initialWidth);
            this.changeDetector.markForCheck();

            setTimeout(() => {
                this.isInvisible = false;
                this.changeDetector.markForCheck();
            }, 200);
        }
    }

    /**
     * Resets the isDirty state of the component.
     */
    setPristine(node: MeshNode): void {
        // --- TODO: fix typings ---
        this.meshControlGroup.reset(node.fields as any);
    }

    /**
     * Returns a list of fields which have changed, including the object path to that field, and the old and new values.
     */
    getChangesByPath(): ChangesByPath[] {
        return this.meshControlGroup.getChangesByPath();
    }

    /**
     * Returns true if the input node has changed to a different uuid or language.
     */
    private nodeHasChanged(nodeChanges?: SimpleChange): boolean {
        if (!nodeChanges) {
            return false;
        }
        if (!nodeChanges.previousValue) {
            return true;
        }
        return nodeChanges.previousValue.uuid !== nodeChanges.currentValue.uuid ||
            nodeChanges.previousValue.language !== nodeChanges.currentValue.language;
    }

    private onChange(path: SchemaFieldPath, value: any): void {
        this.updateAtPath(this.node.fields, path, value);

        // --- TODO: fix typings ---
        this.meshControlGroup.checkValue(this.node.fields as any, path);
        // --- TODO: fix typings ---

        this.meshControlGroup.nodeChanged(path, value, this.node);
        this.changeDetector.markForCheck();
    }

    /**
     * Given an object, update the value specified by the `path` array with the given value.
     * Note: this method mutates the object passed in.
     */
    private updateAtPath(object: any, path: Array<string | number>, value: any): any {
        const pointer = this.getPointerByPath(object, path);
        return pointer[path[path.length - 1]] = this.clone(value);
    }

    /**
     * Given an object and a path e.g. ['foo', 'bar'], return the a pointer to
     * the object.foo.bar property.
     */
    private getPointerByPath(object: any, path: Array<string | number>): any {
        let pointer = object;
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
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
