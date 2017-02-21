import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { SchemaFieldControl, SchemaFieldPath, UpdateFunction } from '../form-generator/form-generator.component';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { mockGetMicroschemaByUuid } from '../../common/mock-get-microschema';
import { FieldControlGroupService } from '../../providers/field-control-group/field-control-group.service';

@Component({
    selector: 'micronode-field',
    templateUrl: 'micronode-field.component.html',
    styleUrls: ['micronode-field.scss']
})
export class MicronodeFieldComponent implements SchemaFieldControl, AfterViewInit {

    path: SchemaFieldPath;
    field: SchemaField;
    value: NodeFieldMicronode;

    @ViewChild('micronodeControlAnchor', { read: ViewContainerRef })
    private micronodeControlAnchor: ViewContainerRef;
    private update: UpdateFunction;
    private fieldGenerator: FieldGenerator;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private fieldControlGroupService: FieldControlGroupService) {}

    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldMicronode, update: UpdateFunction): void {
        this.value = value;
        this.update = update;
        this.field = field;
        this.path = path;
    }

    ngAfterViewInit(): void {
        const updateFn = (path: SchemaFieldPath, value: NodeFieldType) => this.update(path, value);
        this.fieldGenerator = this.fieldGeneratorService.create(this.micronodeControlAnchor, updateFn);
        // Instantiating the dynamic child components inside the ngAfterViewInit hook will lead to
        // change detection errors, hence the setTimeout. See https://github.com/angular/angular/issues/10131
        setTimeout(() => this.createDefaultMicronodeComponent());
    }

    valueChange(value: NodeFieldMicronode): void {
        this.value = value;
        // this.createDefaultMicronodeComponent();
    }

    createDefaultMicronodeComponent(): void {
        const controlContainer = this.fieldControlGroupService.getControlContainerAtPath(this.path);

        mockGetMicroschemaByUuid(this.value.microschema.uuid)
            .subscribe(microschema => {
                microschema.fields.forEach(field => {
                    const value = this.value.fields[field.name];
                    const controlType = getControlType(field.type);
                    if (controlType) {
                        const newContainer = controlContainer.addMicronodeItemControl(field, value);

                        const componentRef = this.fieldGenerator.attachField(
                            this.path.concat(['fields', field.name]),
                            field,
                            value,
                            controlType
                        );

                        newContainer.registerControlInstance(componentRef.instance);
                    }
                });
            });
    }
}
