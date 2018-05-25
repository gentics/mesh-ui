import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Schema } from '../../../common/models/schema.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';

export interface SchemaDisplayProperties {
    name: string;
    description: string;
    icon: string;
    uuid: string;
}

@Component({
    selector: 'mesh-create-node-button',
    templateUrl: 'create-node-button.component.html',
    styleUrls: ['create-node-button.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNodeButtonComponent {
    @Input() disabled: boolean;
    schemas$: Observable<SchemaDisplayProperties[]>;

    constructor(
        private entities: EntitiesService,
        private navigationService: NavigationService,
        private state: ApplicationStateService
    ) {
        this.schemas$ = entities
            .selectAllSchemas()
            .map(schemas => schemas.sort(this.nameSort).map(this.getSchemaDisplayProperties));
    }

    itemClick(schema: SchemaDisplayProperties): void {
        const { currentProject, currentNode, language } = this.state.now.list;
        if (currentProject && currentNode) {
            this.navigationService.createNode(currentProject, schema.uuid, currentNode, language).navigate();
            this.state.actions.editor.focusEditor();
        }
    }

    private nameSort(a: Schema, b: Schema): number {
        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    }

    private getSchemaDisplayProperties(schema: Schema): SchemaDisplayProperties {
        return {
            name: schema.name,
            description: schema.description || '',
            icon: schema.container ? 'folder' : 'view_quilt',
            uuid: schema.uuid
        };
    }
}
