import { Injectable, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaFieldControl, SchemaFieldPath } from '../../components/form-generator/form-generator.component';

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

    attachField<T extends SchemaFieldControl>(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, fieldComponent: Type<T>): ComponentRef<T>;
    attachField<T extends SchemaFieldControl>(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, fieldComponent: Type<T>,
                                              viewContainerRef: ViewContainerRef): ComponentRef<T>;
    attachField<T extends SchemaFieldControl>(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, fieldComponent: Type<T>,
                                              viewContainerRef?: ViewContainerRef): ComponentRef<T> {
        const _viewContainerRef = viewContainerRef || this.viewContainerRef;
        const factory = this.resolver.resolveComponentFactory(fieldComponent);
        const componentRef = _viewContainerRef.createComponent(factory);
        const update = (path: SchemaFieldPath, val: NodeFieldType) => {
            this.onChange(path, val);
        };
        componentRef.instance.initialize(path, field, value, update);
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
