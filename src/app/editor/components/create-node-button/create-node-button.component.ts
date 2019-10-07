import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { isValidString } from 'src/app/common/util/util';
import { ListEffectsService } from 'src/app/core/providers/effects/list-effects.service';

import { Schema } from '../../../common/models/schema.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

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
        private listEffects: ListEffectsService,
        private navigationService: NavigationService,
        private state: ApplicationStateService
    ) {
        this.schemas$ = this.state
            .select(state => state.list.currentProject)
            .pipe(
                filter(isValidString),
                flatMap(project => this.listEffects.loadSchemasForProject(project)),
                map(schemas => schemas.data.sort(this.nameSort).map(this.getSchemaDisplayProperties))
            );
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
