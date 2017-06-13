import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Type, ViewContainerRef } from '@angular/core';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import {
    FormWidthChangeCallback,
    GetNodeValueFunction,
    GetNodeValueReturnType,
    MeshFieldControlApi,
    NodeChangeCallback,
    SchemaFieldPath,
    ValueChangeCallback
} from '../../common/form-generator-models';
import { BaseFieldComponent, SMALL_SCREEN_LIMIT } from '../../components/base-field/base-field.component';
import { MeshControlGroupService } from '../field-control-group/mesh-control-group.service';

type OnChangeFunction = (path: SchemaFieldPath, value: NodeFieldType) => void;

/**
 * This class is instantiated by the FieldGeneratorService, and is responsible for creating an instance of a SchemaFieldControl
 * in the correct place in the DOM.
 */
export class FieldGenerator {

    constructor(private resolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef,
                private onChange: OnChangeFunction,
                private getNodeFn: GetNodeValueFunction) {}

    attachField<T extends BaseFieldComponent>(
        fieldConfig: {
            path: SchemaFieldPath;
            field: SchemaField;
            value: NodeFieldType;
            fieldComponent: Type<T>;
            viewContainerRef?: ViewContainerRef;
        }): ComponentRef<T> {

        const _viewContainerRef = fieldConfig.viewContainerRef || this.viewContainerRef;
        const factory = this.resolver.resolveComponentFactory(fieldConfig.fieldComponent);
        const componentRef = _viewContainerRef.createComponent(factory);
        const update = (path: SchemaFieldPath, val: NodeFieldType) => {
            this.onChange(path, val);
        };
        const getNodeValue = (path?: SchemaFieldPath) => this.getNodeFn(path);
        const instance = componentRef.instance;
        const meshControlFieldInstance: MeshFieldControlApi = {
            path: fieldConfig.path,
            field: fieldConfig.field,
            getValue(): any {
                return fieldConfig.value;
            },
            setValue(value: any, pathOverride?: SchemaFieldPath): void {
                update(pathOverride || fieldConfig.path, value);
            },
            setValid(isValid: boolean): void {
                instance.setValid(isValid);
            },
            onValueChange(cb: ValueChangeCallback): void {
                instance.valueChange = cb.bind(instance);
            },
            getNodeValue(path?: SchemaFieldPath): GetNodeValueReturnType {
                return getNodeValue(path);
            },
            onNodeChange(cb: NodeChangeCallback): void {
                instance.nodeFieldChange = cb.bind(instance);
            },
            setHeight(value: string): void {
                instance.setHeight(value);
            },
            setWidth(value: string): void {
                instance.setWidth(value);
            },
            setFocus(value: boolean): void {
                instance.setFocus(value);
            },
            onLabelClick(cb: () => void): void {
                instance.labelClick = cb.bind(instance);
            },
            onFormWidthChange(cb: FormWidthChangeCallback): void {
                instance.formWidthChange = (widthInPixels: number) => {
                    instance.isCompact = widthInPixels <= SMALL_SCREEN_LIMIT;
                    cb(widthInPixels);
                };
            },
            appendDefaultStyles(parentElement: HTMLElement): void {
                const defaultStyles = require('!raw-loader!sass-loader!./default-styles.scss');
                const styleElement = document.createElement('style');
                styleElement.innerText = defaultStyles;
                parentElement.appendChild(styleElement);
            }
        };
        componentRef.instance.init(meshControlFieldInstance);
        return componentRef;
    }
}

/**
 * A factory service for creating new instances of FieldGenerator.
 */
@Injectable()
export class FieldGeneratorService {

    constructor(private resolver: ComponentFactoryResolver,
                private meshControlGroup: MeshControlGroupService,
                private ngZone: NgZone) {}

    create(viewContainerRef: ViewContainerRef, onChange: OnChangeFunction): FieldGenerator {
        const zoneAwareChangeFn = (path: SchemaFieldPath, value: NodeFieldType) => {
            this.ngZone.run(() => onChange(path, value));
        };
        const getNode = (path?: SchemaFieldPath) => this.meshControlGroup.getNodeValue(path);
        return new FieldGenerator(this.resolver, viewContainerRef, zoneAwareChangeFn, getNode);
    }
}
