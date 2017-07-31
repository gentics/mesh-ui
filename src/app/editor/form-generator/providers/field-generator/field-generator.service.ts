import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Type, ViewContainerRef } from '@angular/core';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import {
    ErrorCodeHash,
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
import { ApplicationStateService } from '../../../../state/providers/application-state.service';
import { FieldErrorsComponent } from '../../components/field-errors/field-errors.component';

type OnChangeFunction = (path: SchemaFieldPath, value: NodeFieldType) => void;

export interface FieldSet<T extends BaseFieldComponent> {
    field: ComponentRef<T>;
    errors: ComponentRef<FieldErrorsComponent>;
    destroy: () => void;
}

/**
 * This class is instantiated by the FieldGeneratorService, and is responsible for creating an instance of a SchemaFieldControl
 * in the correct place in the DOM.
 */
export class FieldGenerator {

    constructor(private resolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef,
                private onChange: OnChangeFunction,
                private getNodeFn: GetNodeValueFunction,
                private state: ApplicationStateService) {}

    attachField<T extends BaseFieldComponent>(
        fieldConfig: {
            path: SchemaFieldPath;
            field: SchemaField;
            value: NodeFieldType;
            fieldComponent: Type<T>;
            viewContainerRef?: ViewContainerRef;
        }): FieldSet<T> {

        const _viewContainerRef = fieldConfig.viewContainerRef || this.viewContainerRef;
        const factory = this.resolver.resolveComponentFactory(fieldConfig.fieldComponent);
        const fieldErrorsFactory = this.resolver.resolveComponentFactory(FieldErrorsComponent);
        const componentRef = _viewContainerRef.createComponent(factory);
        const errorsComponentRef = _viewContainerRef.createComponent(fieldErrorsFactory);
        const update = (path: SchemaFieldPath, val: NodeFieldType) => {
            this.onChange(path, val);
        };
        const getNodeValue = (path?: SchemaFieldPath) => this.getNodeFn(path);
        const instance = componentRef.instance;
        errorsComponentRef.instance.errors = instance.errors;
        const meshControlFieldInstance: MeshFieldControlApi = {
            path: fieldConfig.path,
            field: fieldConfig.field,
            getValue(): any {
                return fieldConfig.value;
            },
            setValue(value: any, pathOverride?: SchemaFieldPath): void {
                update(pathOverride || fieldConfig.path, value);
            },
            setError(errorCodeOrHash: string | ErrorCodeHash, errorMessage?: string | false): void {
                if (typeof errorCodeOrHash === 'string') {
                    instance.setError(errorCodeOrHash, errorMessage!);
                } else {
                    instance.setError(errorCodeOrHash);
                }
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
                const originalFormWidthChangeFn = instance.formWidthChange.bind(instance);
                instance.formWidthChange = (widthInPixels: number) => {
                    instance.isCompact = widthInPixels <= SMALL_SCREEN_LIMIT;
                    originalFormWidthChangeFn(widthInPixels);
                    cb(widthInPixels);
                };
            },
            appendDefaultStyles(parentElement: HTMLElement): void {
                const defaultStyles = require('!raw-loader!sass-loader!./default-styles.scss');
                const styleElement = document.createElement('style');
                styleElement.innerText = defaultStyles;
                parentElement.appendChild(styleElement);
            },
            uiLanguage: this.state.now.ui.currentLanguage
        };
        componentRef.instance.init(meshControlFieldInstance);
        return {
            field: componentRef,
            errors: errorsComponentRef,
            destroy: () => {
                componentRef.hostView.destroy();
                errorsComponentRef.hostView.destroy();
            }
        };
    }
}

/**
 * A factory service for creating new instances of FieldGenerator.
 */
@Injectable()
export class FieldGeneratorService {

    constructor(private resolver: ComponentFactoryResolver,
                private meshControlGroup: MeshControlGroupService,
                private state: ApplicationStateService,
                private ngZone: NgZone) {}

    create(viewContainerRef: ViewContainerRef, onChange: OnChangeFunction): FieldGenerator {
        const zoneAwareChangeFn = (path: SchemaFieldPath, value: NodeFieldType) => {
            this.ngZone.run(() => onChange(path, value));
        };
        const getNode = (path?: SchemaFieldPath) => this.meshControlGroup.getNodeValue(path);
        return new FieldGenerator(this.resolver, viewContainerRef, zoneAwareChangeFn, getNode, this.state);
    }
}
