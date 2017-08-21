import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Schema } from '../../../common/models/schema.model';

@Injectable()
export class SchemaEffectsService {

    constructor(private api: ApiService,
                private state: ApplicationStateService) {
    }

    loadSchemas() {
        this.state.actions.admin.actionStart();
        // TODO How to handle paging? Should all schemas be loaded?
        this.api.schema.getSchemas({})
            .subscribe((response) => {
                this.state.actions.admin.loadSchemasSuccess(response.data as Schema[]);
            }, error => {
                this.state.actions.admin.actionError();
            });
    }
}
