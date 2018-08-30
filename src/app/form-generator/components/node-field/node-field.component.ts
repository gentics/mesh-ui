import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { MeshNode, NodeField, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EditorEffectsService } from '../../../editor/providers/editor-effects.service';
import { PageResult } from '../../../shared/components/node-browser/interfaces';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-node-field',
    templateUrl: './node-field.component.html',
    styleUrls: ['./node-field.scss']
})
export class NodeFieldComponent extends BaseFieldComponent {
    @Input() node: MeshNode;

    routerLink: any[] | null = null;

    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;
    userValue: string | undefined;
    displayName: string;
    schemaName: string;
    breadcrumbPath: string;
    fullName: string;
    isContainer: boolean;

    constructor(
        changeDetector: ChangeDetectorRef,
        private navigationService: NavigationService,
        private editorEffects: EditorEffectsService
    ) {
        super(changeDetector);
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.node = this.api.getNodeValue() as MeshNode;
        this.valueChange(api.getValue());
        if (this.userValue) {
            this.editorEffects.loadNode(this.node.project.name!, this.userValue, this.node.language);
        }
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
        this.node = this.api.getNodeValue() as MeshNode;

        const allowedSchemas = this.api.field.allow;

        this.api
            .openNodeBrowser({
                startNodeUuid: this.node.parentNode ? this.node.parentNode.uuid : this.node.uuid,
                projectName: this.node.project.name!,
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
                if (this.userValue) {
                    this.editorEffects.loadNode(this.node.project.name!, this.userValue, this.node.language);
                }
                this.changeDetector.detectChanges();
            });
    }

    editNode(): void {
        this.node = this.api.getNodeValue() as MeshNode;

        if (this.isContainer) {
            this.routerLink = this.navigationService
                .list(this.node.project.name!, this.userValue!, this.node.language)
                .commands();
        } else {
            this.routerLink = this.navigationService
                .detail(this.node.project.name!, this.userValue!, this.node.language)
                .commands();
        }

        this.navigationService.detail(this.node.project.name!, this.userValue!, this.node.language).navigate();
    }

    removeNode(): void {
        this.breadcrumbPath = this.schemaName = '';
        this.fullName = this.displayName = this.userValue = '';
    }
}
