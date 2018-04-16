import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { BreadcrumbTextFunction } from '../../components/admin-breadcrumbs/admin-breadcrumbs.component';
import { Schema } from '../../../common/models/schema.model';
import { AdminSchemaEffectsService } from '../effects/admin-schema-effects.service';

@Injectable()
export class SchemaResolver implements Resolve<Schema> {

    constructor(private adminSchemaEffects: AdminSchemaEffectsService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<Schema | undefined> {
        const uuid = route.paramMap.get('uuid');

        if (uuid !== 'new') {
            return this.adminSchemaEffects.openSchema(uuid)
                .then(schema => {
                    if (!schema) {
                        // throw
                        throw new Error(`Could not find a schema with the uuid "${uuid}"`);
                    }
                    return schema;
                });
        } else {
            this.adminSchemaEffects.newSchema();
        }
    }
}

export const schemaBreadcrumbFn: BreadcrumbTextFunction = (route, state, entities) =>  {
    const schemaUuid = state.adminSchemas.schemaDetail;
    if (!schemaUuid) {
        return 'admin.new_schema';
    } else {
        return entities.selectSchema(schemaUuid).map(schema => `${schema.name}`);
    }
};
