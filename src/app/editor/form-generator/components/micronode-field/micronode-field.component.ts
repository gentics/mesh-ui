import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MeshFieldComponent, SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { mockGetMicroschemaByUuid } from '../../common/mock-get-microschema';
import { MeshControlGroup } from '../../providers/field-control-group/mesh-control-group.service';

@Component({
    selector: 'micronode-field',
    templateUrl: 'micronode-field.component.html',
    styleUrls: ['micronode-field.scss']
})
export class MicronodeFieldComponent implements MeshFieldComponent, AfterViewInit {

    path: SchemaFieldPath;
    field: SchemaField;
    value: NodeFieldMicronode;

    @ViewChild('micronodeControlAnchor', { read: ViewContainerRef })
    private micronodeControlAnchor: ViewContainerRef;
    private update: UpdateFunction;
    private fieldGenerator: FieldGenerator;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private fieldControlGroupService: MeshControlGroup) {}

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
    }

    createDefaultMicronodeComponent(): void {
        const meshControl = this.fieldControlGroupService.getMeshControlAtPath(this.path);

        mockGetMicroschemaByUuid(this.value.microschema.uuid)
            .subscribe(microschema => {
                microschema.fields.forEach(field => {
                    const value = this.value.fields[field.name];
                    const controlType = getControlType(field.type);
                    if (controlType) {
                        const newContainer = meshControl.addChild(field, value);
                        const componentRef = this.fieldGenerator.attachField(
                            this.path.concat(['fields', field.name]),
                            field,
                            value,
                            controlType
                        );
                        newContainer.registerMeshFieldInstance(componentRef.instance);
                    }
                });
            });
    }
}
