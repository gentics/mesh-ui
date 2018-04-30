import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MeshFieldControlApi, SchemaFieldPath } from '../../common/form-generator-models';
import { NodeFieldMicronode, NodeFieldType } from '../../../common/models/node.model';
import { FieldGenerator, FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { getControlType } from '../../common/get-control-type';
import { MeshControlGroupService } from '../../providers/field-control-group/mesh-control-group.service';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';

@Component({
    selector: 'micronode-field',
    templateUrl: 'micronode-field.component.html',
    styleUrls: ['micronode-field.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicronodeFieldComponent extends BaseFieldComponent implements AfterViewInit {

    api: MeshFieldControlApi;
    value: NodeFieldMicronode;

    @ViewChild('micronodeControlAnchor', { read: ViewContainerRef })
    private micronodeControlAnchor: ViewContainerRef;
    private fieldGenerator: FieldGenerator;

    constructor(changeDetector: ChangeDetectorRef,
                private fieldGeneratorService: FieldGeneratorService,
                private state: ApplicationStateService,
                private entities: EntitiesService,
                private meshControlGroup: MeshControlGroupService) {
        super(changeDetector);
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

    formWidthChange(widthInPixels: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = widthInPixels <= SMALL_SCREEN_LIMIT;
    }

    createDefaultMicronodeComponent(): void {
        const meshControl = this.meshControlGroup.getMeshControlAtPath(this.api.path);

        if (meshControl && this.value && this.value.microschema) {
            const microschema = this.entities.getMicroschema(this.value.microschema.uuid);
            if (microschema) {
                microschema.fields.forEach(field => {
                    const value = this.value.fields[field.name];
                    const controlType = getControlType(field);
                    if (controlType) {
                        const newContainer = meshControl.addChild(field, value);
                        const componentRef = this.fieldGenerator.attachField({
                            path: this.api.path.concat(['fields', field.name]),
                            field,
                            value,
                            readOnly: this.api.readOnly,
                            fieldComponent: controlType
                        }).field;
                        newContainer.registerMeshFieldInstance(componentRef.instance);
                    }
                });
                this.changeDetector.markForCheck();
            }
        }
    }
}
