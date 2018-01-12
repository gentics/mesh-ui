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
        let askUserToSave: Promise<boolean>;
        
        console.log('We have an open node', this.state.now.editor.openNode);

        if (this.state.now.editor.openNode) {
            askUserToSave = this.navigationService.clearDetail().navigate();
        } else {
            askUserToSave = Promise.resolve(true);
        }

        askUserToSave.then(show => {
            console.log('should we show? ', show);
            if (show) {
                const {currentProject, currentNode, language} = this.state.now.list;
                this.navigationService.createNode(currentProject, schema.uuid, currentNode, language).navigate();
            }
        });
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
