import { ChangeDetectorRef, Component } from '@angular/core';

import { MeshNode, NodeField, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { FilePreviewComponent } from '../../../shared/components/file-preview/file-preview.component';
import { PageResult } from '../../../shared/components/node-browser/interfaces';
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
    userValue: string | null;
    displayName: string;
    schemaName: string;
    breadcrumbPath: string;
    fullName: string;

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
        if (this.userValue) {
            return this.userValue.length === 32;
        } else {
            return false;
        }
    }

    selectNode(): void {
        const node = this.api.getNodeValue() as MeshNode;
        const allowedSchemas = this.api.field.allow;

        this.api
            .openNodeBrowser({
                startNodeUuid: node.parentNode ? node.parentNode.uuid : node.uuid,
                projectName: node.project.name!,
                titleKey: 'editor.select_node',
                selectablePredicate: node => {
                    if (allowedSchemas) {
                        return allowedSchemas.indexOf(node.schema.name) > -1;
                    }
                }
            })
            .then((results: PageResult[]) => {
                this.userValue = results[0].uuid;
                this.displayName = results[0].displayName;
                this.schemaName = results[0].schema.name;
                this.breadcrumbPath = results[0].breadcrumb[results[0].breadcrumb.length - 1].path;
                this.fullName =
                    'Node name: ' +
                    this.displayName +
                    '\nSchema name: ' +
                    this.schemaName +
                    '\nUUID: ' +
                    this.userValue +
                    '\nPath: ' +
                    this.breadcrumbPath;
                this.changeDetector.detectChanges();
            });
    }

    removeNode(): void {
        this.breadcrumbPath = this.schemaName = '';
        this.fullName = this.displayName = this.userValue = '';
    }
}
