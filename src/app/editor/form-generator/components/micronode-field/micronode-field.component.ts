import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { mockGetMicroschemaByUuid } from '../../common/mock-get-microschema';
import { MeshControlGroup } from '../../providers/field-control-group/mesh-control-group.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'micronode-field',
    templateUrl: 'micronode-field.component.html',
    styleUrls: ['micronode-field.scss']
})
export class MicronodeFieldComponent extends BaseFieldComponent implements AfterViewInit {

    api: MeshFieldControlApi;
    value: NodeFieldMicronode;

    @ViewChild('micronodeControlAnchor', { read: ViewContainerRef })
    private micronodeControlAnchor: ViewContainerRef;
    private fieldGenerator: FieldGenerator;

    constructor(private fieldGeneratorService: FieldGeneratorService,
                private meshControlGroup: MeshControlGroup) {
        super();
    }

    init(api: MeshFieldControlApi): void {
        this.value = api.getValue();
        this.api = api;
    }

    ngAfterViewInit(): void {
        const updateFn = (path: SchemaFieldPath, value: NodeFieldType) => this.api.setValue(value, path);
        this.fieldGenerator = this.fieldGeneratorService.create(this.micronodeControlAnchor, updateFn);
        // Instantiating the dynamic child components inside the ngAfterViewInit hook will lead to
        // change detection errors, hence the setTimeout. See https://github.com/angular/angular/issues/10131
        setTimeout(() => this.createDefaultMicronodeComponent());
    }

    valueChange(value: NodeFieldMicronode): void {
        this.value = value;
    }

    createDefaultMicronodeComponent(): void {
        const meshControl = this.meshControlGroup.getMeshControlAtPath(this.api.path);

        if (meshControl) {
            mockGetMicroschemaByUuid(this.value.microschema.uuid)
                .subscribe(microschema => {
                    microschema.fields.forEach(field => {
                        const value = this.value.fields[field.name];
                        const controlType = getControlType(field);
                        if (controlType) {
                            const newContainer = meshControl.addChild(field, value);
                            const componentRef = this.fieldGenerator.attachField(
                                this.api.path.concat(['fields', field.name]),
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
}
