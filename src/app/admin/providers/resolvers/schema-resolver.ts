import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Schema } from '../../../common/models/schema.model';
import { BreadcrumbTextFunction } from '../../components/admin-breadcrumbs/admin-breadcrumbs.component';
import { AdminSchemaEffectsService } from '../effects/admin-schema-effects.service';

@Injectable()
export class SchemaResolver implements Resolve<Schema | undefined> {
    constructor(private adminSchemaEffects: AdminSchemaEffectsService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<Schema> | undefined {
        const uuid = route.paramMap.get('uuid');

        if (uuid === 'new') {
            this.adminSchemaEffects.newSchema();
        } else if (uuid) {
            return this.adminSchemaEffects.openSchema(uuid).then(schema => {
                if (!schema) {
                    // throw
                    throw new Error(`Could not find a schema with the uuid "${uuid}"`);
                }
                return schema;
            });
        }
    }
}

export const schemaBreadcrumbFn: BreadcrumbTextFunction = (route, state, entities) => {
    const schemaUuid = state.adminSchemas.schemaDetail;
    if (!schemaUuid) {
        return 'admin.new_schema';
    } else {
        return entities.selectSchema(schemaUuid).map(schema => `${schema.name}`);
    }
};
