import {
    AfterViewInit,
    Component,
    ComponentRef,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { SplitViewContainer } from 'gentics-ui-core';
import { Schema } from '../../../../common/models/schema.model';
import { MeshNode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { MeshControlGroup } from '../../providers/field-control-group/mesh-control-group.service';
import { SchemaFieldPath } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generates a form based on a schema and populates with data from the node.
 */
@Component({
    selector: 'form-generator',
    templateUrl: 'form-generator.component.html',
    styleUrls: ['form-generator.scss']
})
export class FormGeneratorComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() schema: Schema;
    @Input() node: MeshNode;

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
        return this._isDirty;
    }

    @ViewChild('formContainer', { read: ElementRef })
    private formContainer: ElementRef;
    @ViewChild('formRoot', { read: ViewContainerRef })
    private formRoot: ViewContainerRef;
    private componentRefs: Array<ComponentRef<BaseFieldComponent>> = [];
    private fieldGenerator: FieldGenerator;
    private _isDirty: boolean = false;
    private windowResize$ = new Subject<void>();
    private containerResizeSub: Subscription;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private meshControlGroup: MeshControlGroup,
                @Optional() private splitViewContainer: SplitViewContainer) {}

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

        this.containerResizeSub = this.windowResize$
            .merge(this.splitViewContainer && this.splitViewContainer.splitDragEnd || [])
            .startWith(true)
            .debounceTime(500)
            .map(() => this.formContainer.nativeElement.offsetWidth)
            .subscribe(widthInPixels => {
                this.meshControlGroup.formWidthChanged(widthInPixels);
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
            this.componentRefs.forEach(componentRef => componentRef.hostView.destroy());
            this.componentRefs = [];

            this.meshControlGroup.init();

            this.schema.fields.forEach(field => {
                const value = this.node.fields[field.name];
                const controlType = getControlType(field);
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

    /**
     * Resets the isDirty state of the component.
     */
    setPristine(): void {
        this._isDirty = false;
    }

    private onChange(path: SchemaFieldPath, value: any): void {
        this.updateAtPath(this.node.fields, path, value);
        this.meshControlGroup.checkValue(this.node.fields, path);
        this._isDirty = true;
    }

    /**
     * Given an object, update the value specified by the `path` array with the given value.
     * Note: this method mutates the object passed in.
     */
    private updateAtPath(object: any, path: any[], value: any): any {
        let pointer = this.getPointerByPath(object, path);
        console.log(`updating`, path, value);
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
