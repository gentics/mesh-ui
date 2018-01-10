import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema } from '../../../common/models/schema.model';
import { Subscription } from 'rxjs/Subscription';

export interface SchemaDisplayProperties {
    name: string;
    description: string;
    icon: string;
    uuid: string;
}

@Component({
    selector: 'create-node-button',
    templateUrl: 'create-node-button.component.html',
    styleUrls: ['create-node-button.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNodeButtonComponent {
    schemas$: Observable<SchemaDisplayProperties[]>;

    constructor(
                private entities: EntitiesService,
                private navigationService: NavigationService,
                private state: ApplicationStateService) {

        this.schemas$ = entities.selectAllSchemas()
            .map(schemas =>
                schemas
                    .sort(this.nameSort)
                    .map(this.getSchemaDisplayProperties)
            );
    }

    itemClick(schema: SchemaDisplayProperties): void {
        const listState = this.state.now.list;
        this.navigationService.createNode(listState.currentProject, schema.uuid, listState.currentNode, listState.language).navigate();

    }

    private nameSort(a: Schema, b: Schema): number {
        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    }

    private getSchemaDisplayProperties(schema: Schema): SchemaDisplayProperties {
        return {
            name: schema.name,
            description: schema.description || '',
            icon: schema.container ? 'folder' : 'view_quilt',
            uuid: schema.uuid,
        };
    }
}
