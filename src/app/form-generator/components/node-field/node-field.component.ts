import { ChangeDetectorRef, Component, Input, NgModule } from '@angular/core';

import { MeshNode, NodeField, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { PageResult } from '../../../shared/components/node-browser/interfaces';
import { EntitiesService } from '../../../state/providers/entities.service';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-node-field',
    templateUrl: './node-field.component.html',
    styleUrls: ['./node-field.scss']
})
export class NodeFieldComponent extends BaseFieldComponent {
    @Input() node: MeshNode;
    @Input() listLanguage: string;

    routerLink: any[] | null = null;

    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;
    userValue: string;
    displayName: string;
    schemaName: string;
    breadcrumbPath: string;
    fullName: string;
    isContainer: boolean;

    constructor(
        changeDetector: ChangeDetectorRef,
        private navigationService: NavigationService,
        private entities: EntitiesService
    ) {
        super(changeDetector);
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.valueChange(api.getValue());

        if (this.node.container) {
            this.routerLink = this.navigationService
                .list(this.node.project.name!, this.node.uuid, this.listLanguage)
                .commands();
        } else {
            this.routerLink = this.navigationService
                .detail(this.node.project.name!, this.node.uuid, this.node.language)
                .commands();
        }

        console.log(this.routerLink);
    }

    valueChange(value: NodeField): void {
        this.userValue = (value && value.uuid) || '';
        this.entities.getNode(this.userValue, { strictLanguageMatch: false });
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

        console.log(allowedSchemas);

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
                this.isContainer = results[0].isContainer;
                this.breadcrumbPath = results[0].breadcrumb[results[0].breadcrumb.length - 1].path;
                this.fullName =
                    'Schema name: ' +
                    this.schemaName +
                    '\nNode name: ' +
                    this.displayName +
                    '\nPath: ' +
                    this.breadcrumbPath;
                this.changeDetector.detectChanges();
            });
    }

    editNode(): void {
        this.navigationService.detail(this.node.project.name!, this.node.uuid, this.node.language).navigate();
    }

    removeNode(): void {
        this.breadcrumbPath = this.schemaName = '';
        this.fullName = this.displayName = this.userValue = '';
    }
}
