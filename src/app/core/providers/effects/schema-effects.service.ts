import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';

@Injectable()
export class SchemaEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
    }

    loadSchemas() {
        this.state.actions.admin.actionStart();
        // TODO How to handle paging? Should all schemas be loaded?
        this.api.schema.getSchemas({})
            .subscribe(schemas => {
                this.state.actions.admin.loadSchemasSuccess(schemas.data);
            }, error => {
                this.state.actions.admin.actionError();
            });
    }
}
