import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ADMIN_USER_NAME } from '../../../common/constants';
import { Schema } from '../../../common/models/schema.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
import { ConfigService } from '../../../core/providers/config/config.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    templateUrl: './schema-list.component.html',
    styleUrls: ['./schema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaListComponent implements OnInit, OnDestroy {
    schemas$: Observable<Schema[]>;
    currentPage$: Observable<number>;
    itemsPerPage$: Observable<number>;
    totalItems$: Observable<number | null>;
    filterInput = new FormControl('');
    filterTerm = '';
    selectedIndices: Schema[] = [];
    availableLanguages: string[];
    ADMIN_USER_NAME = ADMIN_USER_NAME;

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private i18n: I18nService,
        private config: ConfigService
    ) {}

    ngOnInit(): void {
        this.availableLanguages = this.config.UI_LANGUAGES;

        this.schemas$ = this.entities
            .selectAllSchemas()
            .map(schemas =>
                schemas.sort((a, b) => a.name.localeCompare(b.name, this.availableLanguages, { sensitivity: 'case' }))
            );

        this.adminSchemaEffects.loadSchemas();

        combineLatest(
            observeQueryParam(this.route.queryParamMap, 'p', 1),
            observeQueryParam(this.route.queryParamMap, 'perPage', 10)
        ).subscribe(([page, perPage]) => {
            this.adminSchemaEffects.setListPagination(page, perPage);
        });

        observeQueryParam(this.route.queryParamMap, 'q', '').subscribe(filterTerm => {
            this.adminSchemaEffects.setFilterTerm(filterTerm);
            this.filterInput.setValue(filterTerm, { emitEvent: false });
        });

        this.filterInput.valueChanges.debounceTime(300).subscribe(term => {
            setQueryParams(this.router, this.route, { q: term });
        });

        const allSchemas$ = this.state
            .select(state => state.adminSchemas.schemaList)
            .map(uuids => uuids.map(uuid => this.entities.getSchema(uuid)).filter(notNullOrUndefined));
        const filterTerm$ = this.state.select(state => state.adminSchemas.filterTerm);

        this.schemas$ = combineLatest(allSchemas$, filterTerm$)
            .map(([schemas, filterTerm]) => this.filterSchemas(schemas, filterTerm))
            .map(schemas =>
                schemas.sort((a, b) => a.name.localeCompare(b.name, this.availableLanguages, { sensitivity: 'case' }))
            );

        this.currentPage$ = this.state.select(state => state.adminSchemas.pagination.currentPage);
        this.itemsPerPage$ = this.state.select(state => state.adminSchemas.pagination.itemsPerPage);
        this.totalItems$ = this.state.select(state => state.adminSchemas.pagination.totalItems);
    }

    ngOnDestroy(): void {}

    createSchema() {
        this.router.navigate(['admin', 'schemas', 'new']);
    }

    onPageChange(newPage: number): void {
        setQueryParams(this.router, this.route, { p: newPage });
    }

    deleteSchema(schema: Schema): void {
        if (!schema.permissions.delete || schema.name === ADMIN_USER_NAME) {
            return;
        }
        this.displayDeleteSchemaModal(
            { token: 'admin.delete_schema' },
            { token: 'admin.delete_schema_confirmation', params: { name: schema.name } }
        ).then(() => {
            this.adminSchemaEffects.deleteSchema(schema.uuid);
        });
    }

    async deleteSchemas(selectedSchemas: Schema[]) {
        // check permissions
        const deletableSchemas = selectedSchemas.filter(
            schema => schema.permissions.delete && schema.name !== ADMIN_USER_NAME
        );
        // if schemas to delete exist
        if (deletableSchemas.length === 0) {
            return;
        } else {
            // prompt modal to be confirmed by user
            await this.displayDeleteSchemaModal(
                { token: 'admin.delete_selected_schemas', params: { count: deletableSchemas.length } },
                {
                    token: 'admin.delete_selected_schemas_confirmation',
                    params: { count: deletableSchemas.length }
                }
            );
            // send delete requests
            deletableSchemas.forEach(schema => {
                this.adminSchemaEffects.deleteSchema(schema.uuid);
            });
            // empty selection
            this.selectedIndices = [];
        }
    }

    private filterSchemas(schemas: Schema[], filterTerm: string): Schema[] {
        this.filterTerm = filterTerm.trim();
        if (this.filterTerm === '') {
            return schemas;
        }
        return schemas.filter(schema => this.schemaMatchesTerm(schema, this.filterTerm));
    }

    private schemaMatchesTerm(schema: Schema, filterTerm: string): boolean {
        return fuzzyMatch(filterTerm, `${schema.name}`) !== null;
    }

    private displayDeleteSchemaModal(
        title: { token: string; params?: { [key: string]: any } },
        body: { token: string; params?: { [key: string]: any } }
    ): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate(title.token, title.params) + '?',
                body: this.i18n.translate(body.token, body.params),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        shouldReject: true,
                        label: this.i18n.translate('common.cancel_button')
                    },
                    { type: 'alert', label: this.i18n.translate('admin.delete_label') }
                ]
            })
            .then(modal => modal.open());
    }
}
