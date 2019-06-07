import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ADMIN_USER_NAME } from '../../../common/constants';
import { Microschema } from '../../../common/models/microschema.model';
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
    templateUrl: './microschema-list.component.html',
    styleUrls: ['./microschema-list.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaListComponent implements OnInit, OnDestroy {
    microschemas$: Observable<Microschema[]>;
    currentPage$: Observable<number>;
    itemsPerPage$: Observable<number>;
    totalItems$: Observable<number | null>;
    filterInput = new FormControl('');
    filterTerm = '';
    selectedItems: Microschema[] = [];
    availableLanguages: string[];
    ADMIN_USER_NAME = ADMIN_USER_NAME;

    constructor(
        private entities: EntitiesService,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private state: ApplicationStateService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private i18n: I18nService,
        private config: ConfigService
    ) {}

    ngOnInit(): void {
        this.availableLanguages = this.config.UI_LANGUAGES;

        this.microschemas$ = this.entities
            .selectAllMicroschemas()
            .map(schemas =>
                schemas.sort((a, b) => a.name.localeCompare(b.name, this.availableLanguages, { sensitivity: 'case' }))
            );

        this.adminSchemaEffects.loadMicroschemas();

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

        const allMicroschemas$ = this.state
            .select(state => state.adminSchemas.microschemaList)
            .map(uuids => uuids.map(uuid => this.entities.getMicroschema(uuid)).filter(notNullOrUndefined));
        const filterTerm$ = this.state.select(state => state.adminSchemas.filterTerm);

        this.microschemas$ = combineLatest(allMicroschemas$, filterTerm$)
            .map(([microschemas, filterTerm]) => this.filterSchemas(microschemas, filterTerm))
            .map(schemas =>
                schemas.sort((a, b) => a.name.localeCompare(b.name, this.availableLanguages, { sensitivity: 'case' }))
            );

        this.currentPage$ = this.state.select(state => state.adminSchemas.pagination.currentPage);
        this.itemsPerPage$ = this.state.select(state => state.adminSchemas.pagination.itemsPerPage);
        this.totalItems$ = this.state.select(state => state.adminSchemas.pagination.totalItems);
    }

    ngOnDestroy(): void {}

    createMicroschema() {
        this.router.navigate(['admin', 'microschemas', 'new']);
    }

    onPageChange(newPage: number): void {
        setQueryParams(this.router, this.route, { p: newPage });
    }

    deleteMicroschema(microschema: Microschema): void {
        if (!microschema.permissions.delete || microschema.name === ADMIN_USER_NAME) {
            return;
        }
        this.displayDeleteMicroschemaModal(
            { token: 'admin.delete_microschema' },
            { token: 'admin.delete_microschema_confirmation', params: { name: microschema.name } }
        ).then(() => {
            this.adminSchemaEffects.deleteMicroschema(microschema.uuid);
        });
    }

    deleteMicroschemas(selectedIndices: Microschema[]): void {
        Observable.of(selectedIndices)
            .flatMap(selectedMicroschemas => {
                const deletableMicroschemas = selectedMicroschemas.filter(
                    microschema => microschema.permissions.delete && microschema.name !== ADMIN_USER_NAME
                );
                if (deletableMicroschemas.length === 0) {
                    return Observable.empty();
                } else {
                    return this.displayDeleteMicroschemaModal(
                        {
                            token: 'admin.delete_selected_microschemas',
                            params: { count: deletableMicroschemas.length }
                        },
                        {
                            token: 'admin.delete_selected_microschemas_confirmation',
                            params: { count: deletableMicroschemas.length }
                        }
                    ).then(() => deletableMicroschemas);
                }
            })
            .subscribe((deletableMicroschemas: Microschema[]) => {
                deletableMicroschemas.forEach(microschema => {
                    this.adminSchemaEffects.deleteMicroschema(microschema.uuid);
                });
                this.selectedItems = [];
            });
    }

    private filterSchemas(microschemas: Microschema[], filterTerm: string): Microschema[] {
        this.filterTerm = filterTerm.trim();
        if (this.filterTerm === '') {
            return microschemas;
        }
        return microschemas.filter(microschema => this.microschemaMatchesTerm(microschema, this.filterTerm));
    }

    private microschemaMatchesTerm(microschema: Microschema, filterTerm: string): boolean {
        return fuzzyMatch(filterTerm, `${microschema.name}`) !== null;
    }

    private displayDeleteMicroschemaModal(
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
