import { Component, ViewContainerRef } from '@angular/core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType, NodeFieldMicronode } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { Observable } from 'rxjs';
import { Microschema } from '../../../../common/models/microschema.model';

@Component({
    selector: 'micronode-field',
    templateUrl: 'micronode-field.component.html',
    styleUrls: ['micronode-field.scss']
})
export class MicronodeFieldComponent implements SchemaFieldControl {

    path: SchemaFieldPath;
    field: SchemaField;
    value: NodeFieldMicronode;
    private update: UpdateFunction;
    private fieldGenerator: FieldGenerator;

    constructor(viewContainerRef: ViewContainerRef, fieldGeneratorService: FieldGeneratorService) {
        this.fieldGenerator = fieldGeneratorService.create(viewContainerRef, (path: SchemaFieldPath, value: NodeFieldType) => { this.update(path, value); });
    }

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldMicronode, update: UpdateFunction): void {
        this.value = value;
        this.update = update;
        this.field = field;
        this.path = path;
        this.createDefaultMicronodeComponent();
    }

    valueChange(value: NodeFieldMicronode): void {
        this.value = value;
        this.createDefaultMicronodeComponent();
    }

    createDefaultMicronodeComponent(): void {

        mockGetMicroschemaByUuid(this.value.microschema.uuid)
            .subscribe(microschema => {
                microschema.fields.forEach(field => {
                    const value = this.value.fields[field.name];
                    const controlType = getControlType(field.type);
                    if (controlType) {
                        this.fieldGenerator.attachField(
                            this.path.concat(['fields', field.name]),
                            field,
                            value,
                            controlType
                        );
                    }
                });
            });
    }
}

/**
 * TODO: this will be a real call to the API of course...
 */
function mockGetMicroschemaByUuid(uuid: string): Observable<Microschema> {
    let returnVal = {
        uuid: uuid,
        version: 1,
        description: 'Microschema for Geolocations',
        name: 'geolocation',
        fields: [
            {
                name: 'longitude',
                label: 'Longitude',
                required: true,
                type: 'number' as 'number'
            },
            {
                name: 'latitude',
                label: 'Latitude',
                required: true,
                type: 'number' as 'number'
            },
            {
                name: 'addresses',
                label: 'Addresses',
                type: 'list',
                listType: 'string'
            }
        ]
    } as Microschema;
    return Observable.of(returnVal);
}


