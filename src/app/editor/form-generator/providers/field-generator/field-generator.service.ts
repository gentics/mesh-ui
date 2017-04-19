import { ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';

type OnChangeFunction = {
    (path: SchemaFieldPath, value: NodeFieldType): void;
};

/**
 * This class is instantiated by the FieldGeneratorService, and is responsible for creating an instance of a SchemaFieldControl
 * in the correct place in the DOM.
 */
export class FieldGenerator {

    constructor(private resolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef,
                private onChange: OnChangeFunction) {}

    attachField<T extends BaseFieldComponent>(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, fieldComponent: Type<T>): ComponentRef<T>;
    attachField<T extends BaseFieldComponent>(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, fieldComponent: Type<T>,
                                              viewContainerRef: ViewContainerRef): ComponentRef<T>;
    attachField<T extends BaseFieldComponent>(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, fieldComponent: Type<T>,
                                              viewContainerRef?: ViewContainerRef): ComponentRef<T> {

        const _viewContainerRef = viewContainerRef || this.viewContainerRef;
        const factory = this.resolver.resolveComponentFactory(fieldComponent);
        const componentRef = _viewContainerRef.createComponent(factory);
        const update = (path: SchemaFieldPath, val: NodeFieldType) => {
            this.onChange(path, val);
        };
        const instance = componentRef.instance;
        const meshControlFieldInstance: MeshFieldControlApi = {
            path,
            field,
            getValue() { return value; },
            setValue(value: any, pathOverride?: SchemaFieldPath) {
                update(pathOverride || path, value);
            },
            setValid(isValid: boolean) {
                instance.setValid(isValid);
            },
            onValueChange(cb) {
                instance.valueChange = cb.bind(instance);
            },
            setHeight(value: string) {
                instance.setHeight(value);
            },
            setWidth(value: string) {
                instance.setWidth(value);
            },
            onFormWidthChange(cb) {
                instance.formWidthChange = cb.bind(instance);
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

    constructor(private resolver: ComponentFactoryResolver) {}

    create(viewContainerRef: ViewContainerRef, onChange: OnChangeFunction): FieldGenerator {
        return new FieldGenerator(this.resolver, viewContainerRef, onChange);
    }
}
