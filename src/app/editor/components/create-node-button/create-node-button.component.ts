import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EntitiesService } from '../../../state/providers/entities.service';
import { Schema } from '../../../common/models/schema.model';

export interface SchemaDisplayProperties {
    name: string;
    description: string;
    icon: string;
}

@Component({
    selector: 'create-node-button',
    templateUrl: 'create-node-button.component.html',
    styleUrls: ['create-node-button.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNodeButtonComponent {
    schemas$: Observable<SchemaDisplayProperties[]>;

    constructor(private entities: EntitiesService) {

        this.schemas$ = entities.selectAllSchemas()
            .map(schemas =>
                schemas
                    .sort(this.nameSort)
                    .map(this.getSchemaDisplayProperties)
            );
    }

    itemClick(): void {
        console.warn('Not implemented');
    }

    private nameSort(a: Schema, b: Schema): number {
        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    }

    private getSchemaDisplayProperties(schema: Schema): SchemaDisplayProperties {
        return {
            name: schema.name,
            description: schema.description || '',
            icon: schema.container ? 'folder' : 'view_quilt'
        };
    }
}
