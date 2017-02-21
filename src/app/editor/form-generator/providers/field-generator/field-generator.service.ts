import { Injectable, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaFieldControl, SchemaFieldPath } from '../../components/form-generator/form-generator.component';

type OnChangeFunction = {
    (path: SchemaFieldPath, value: NodeFieldType): void;
};

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
        componentRef.instance.initialize(path, this.clone(field), this.clone(value), update);
        return componentRef;
    }

    /**
     * Simple deep-clone of an object.
     */
    private clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}

@Injectable()
export class FieldGeneratorService {

    constructor(private resolver: ComponentFactoryResolver) {}

    create(viewContainerRef: ViewContainerRef, onChange: OnChangeFunction): FieldGenerator {
        return new FieldGenerator(this.resolver, viewContainerRef, onChange);
    }

}
