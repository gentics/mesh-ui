import { ChangeDetectorRef, Component } from '@angular/core';
import { ModalService } from 'gentics-ui-core';

import { MeshNode, NodeField, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-node-field',
    templateUrl: './node-field.component.html',
    styleUrls: ['./node-field.scss']
})
export class NodeFieldComponent extends BaseFieldComponent {
    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;
    userValue: string;

    constructor(changeDetector: ChangeDetectorRef) {
        super(changeDetector);
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());
    }

    valueChange(value: NodeField): void {
        this.userValue = (value && value.uuid) || '';
    }

    isValidUuid(): boolean {
        return this.userValue.length === 32;
    }

    selectNode(): void {
        const node = this.api.getNodeValue() as MeshNode;
        this.api
            .openNodeBrowser({
                startNodeUuid: node.parentNode ? node.parentNode.uuid : node.uuid,
                projectName: node.project.name!,
                titleKey: 'editor.select_node'
            })
            .then(uuids => {
                this.userValue = uuids[0];
                this.api.setValue({ uuid: this.userValue });
                this.changeDetector.detectChanges();
            });
    }
}
