import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MeshNode, NodeField, NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EditorEffectsService } from '../../../editor/providers/editor-effects.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { BaseFieldComponent, FIELD_FULL_WIDTH, SMALL_SCREEN_LIMIT } from '../base-field/base-field.component';

@Component({
    selector: 'mesh-node-field',
    templateUrl: './node-field.component.html',
    styleUrls: ['./node-field.scss']
})
export class NodeFieldComponent extends BaseFieldComponent implements OnDestroy {
    @Input() node: MeshNode;

    routerLink: any[] | null = null;

    api: MeshFieldControlApi;
    value: NodeFieldType;
    field: SchemaField;
    userValue: string | undefined;
    displayName: string;
    schemaName: string;
    breadcrumbPath: string;
    isContainer: boolean;

    private destroy$ = new Subject<void>();

    constructor(
        changeDetector: ChangeDetectorRef,
        private navigationService: NavigationService,
        private entities: EntitiesService,
        private editorEffects: EditorEffectsService
    ) {
        super(changeDetector);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    init(api: MeshFieldControlApi): void {
        this.api = api;
        this.node = this.api.getNodeValue() as MeshNode;

        this.valueChange(api.getValue());
    }

    valueChange(value: NodeField): void {
        this.userValue = (value && value.uuid) || '';
        this.routerLink = this.navigationService
            .detail(this.api.project(), this.userValue!, this.node.language)
            .commands();

        if (this.userValue) {
            const node$ = this.entities.selectNode(this.userValue!, { language: this.node.language });

            node$.pipe(takeUntil(this.destroy$)).subscribe(node => {
                this.schemaName = node.schema.name;
                this.isContainer = node.container;
                this.displayName = node.displayName!;
                this.breadcrumbPath = node.project.name + node.breadcrumb.map(b => b.displayName).join(' › ');
                this.changeDetector.detectChanges();
            });

            this.editorEffects.loadNode(this.api.project(), this.userValue, this.node.language);
        }
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
                projectName: this.api.project(),
                titleKey: 'editor.select_node',
                selectablePredicate: node => {
                    if (allowedSchemas) {
                        return allowedSchemas.indexOf(node.schema.name) > -1;
                    } else {
                        return true;
                    }
                }
            })
            .then(uuids => {
                this.userValue = uuids[0];
                this.api.setValue({
                    uuid: this.userValue
                });

                this.changeDetector.detectChanges();
            });
    }

    removeNode(): void {
        this.userValue = '';

        this.api.setValue(null);
    }

    formWidthChange(width: number): void {
        this.setWidth(FIELD_FULL_WIDTH);
        this.isCompact = width <= SMALL_SCREEN_LIMIT;
    }
}
