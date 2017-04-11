import { Component, HostBinding, Injector } from '@angular/core';
import { MeshFieldComponent, SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { NodeFieldType } from '../../../../common/models/node.model';
import { SchemaField } from '../../../../common/models/schema.model';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'base-field'
})
export abstract class BaseFieldComponent implements MeshFieldComponent {
    @HostBinding('class.mesh-field')
    readonly isMeshField = true;

    abstract initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void;
    abstract valueChange(value: NodeFieldType): void;
}
