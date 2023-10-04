import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { combineLatest, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { SanitizerService } from 'src/app/core/providers/sanitizer/sanitizer.service';

import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { Project } from '../../../common/models/project.model';
import { Schema } from '../../../common/models/schema.model';
import { SchemaResponse } from '../../../common/models/server-models';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined, simpleDeepEquals } from '../../../common/util/util';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { ProjectAssignments } from '../../../state/models/admin-schemas-state.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { MarkerData } from '../monaco-editor/monaco-editor.component';

@Component({
    templateUrl: './schema-detail.component.html',
    styleUrls: ['./schema-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaDetailComponent implements OnInit, OnDestroy {
    projects: Project[];

    activeId$ = new BehaviorSubject<string>('');

    filterTerm: string;

    filterInput = new FormControl('');

    projects$: Observable<Project[]>;
    allProjects$: Observable<Project[]>;

    schema$: Observable<SchemaResponse>;
    version: string;

    projectAssignments?: ProjectAssignments;

    uuid$: Observable<string>;

    get schemaJson(): string {
        return this.schemaJson$.getValue();
    }
    set schemaJson(v: string) {
        if (!v) {
            return;
        }
        this.schemaJson$.next(v);
    }
    schemaJson$ = new BehaviorSubject<string>('{}');

    /** To check if has been edited by user */
    schemaJsonOriginal: string;

    get schemaHasChanged(): boolean {
        try {
            const a = stripSchemaFields(JSON.parse(this.schemaJsonOriginal));
            const b = stripSchemaFields(JSON.parse(this.schemaJson));
            return !simpleDeepEquals(a, b);
        } catch (error) {
            return false;
        }
    }

    /** Indicator wheter form is valid or not */
    isValid = false;
    /** Indicator whether form is about creating a new node instead updating existing */
    isNew$ = new BehaviorSubject<boolean>(true);
    /** indiocate component is in delete mode */
    doesDelete = false;

    // TODO load json schema from mesh instead of static file
    schema = require('./schema.schema.json');

    errors: MarkerData[] = [];

    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;

    private subscription: Subscription;

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        public adminProjectEffects: AdminProjectEffectsService,
        private schemaEffects: AdminSchemaEffectsService,
        private route: ActivatedRoute,
        private router: Router,
        protected modal: ModalService,
        protected i18n: I18nService,
        private sanitizer: SanitizerService
    ) {}

    ngOnInit() {
        this.schema$ = this.route.data.pipe(
            map(data => data.schema),
            tap((schema: Schema) => {
                this.isNew$.next(!schema);
            })
        );

        this.subscription = this.schema$.subscribe(schema => {
            this.schemaJson$.next(schema ? JSON.stringify(stripSchemaFields(schema), undefined, 4) : `{}`);
        });

        this.schema$
            .pipe(
                filter(schema => !!schema),
                take(1)
            )
            .toPromise()
            .then(schema => {
                // keep original to compare
                this.schemaJsonOriginal = JSON.stringify(stripSchemaFields(schema));
                this.version = schema.version;
                this.schemaEffects
                    .loadEntityAssignments('schema', schema.uuid)
                    .then(assignments => (this.projectAssignments = assignments));
            });

        this.adminProjectEffects.loadProjects();

        this.filterInput.valueChanges.pipe(debounceTime(100)).subscribe(term => {
            setQueryParams(this.router, this.route, { q: term });
        });

        observeQueryParam(this.route.queryParamMap, 'q', '').subscribe(filterTerm => {
            this.adminProjectEffects.setFilterTerm(filterTerm);
            this.filterInput.setValue(filterTerm, { emitEvent: false });
        });

        this.allProjects$ = this.state
            .select(state => state.adminProjects.projectList)
            .pipe(map(uuids => uuids.map(uuid => this.entities.getProject(uuid)).filter(notNullOrUndefined)));

        const filterTerm$ = this.state.select(state => state.adminProjects.filterTerm);

        this.projects$ = combineLatest(this.allProjects$, filterTerm$).pipe(
            map(([projects, filterTerm]) => {
                this.filterTerm = filterTerm;
                return projects
                    .filter(project => fuzzyMatch(filterTerm, project.name) !== null)
                    .sort((pro1, pro2) => {
                        return pro1.name < pro2.name ? -1 : 1;
                    });
            })
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onErrorChange(errors: MarkerData[]) {
        this.errors = errors;
    }

    save() {
        const changedSchema = JSON.parse(this.schemaJson);
        // update original to compare
        this.schemaJsonOriginal = JSON.stringify(changedSchema);

        if (this.isNew$.getValue() === true) {
            this.schemaEffects.createSchema(changedSchema).then((schema: SchemaResponse) => {
                this.isNew$.next(false);
                this.router.navigate(['admin', 'schemas', schema.uuid]);
                this.version = schema.version;

                // open modal asking whether user wants schema to assign to project
                this.modal
                    .dialog({
                        title: this.i18n.translate('admin.assign_schema') + '?',
                        body: this.i18n.translate('admin.assign_schema_confirmation', {
                            name: this.sanitizer.sanitizeHTML(schema.name)
                        }),
                        buttons: [
                            {
                                type: 'secondary',
                                flat: true,
                                shouldReject: true,
                                label: this.i18n.translate('common.no_button')
                            },
                            { type: 'secondary', label: this.i18n.translate('common.yes_button') }
                        ]
                    })
                    .then(modal => modal.open())
                    .then(() => {
                        // switching to project assignmnt tab
                        this.activeId$.next('tab3');
                    });
            });
        } else {
            this.schema$.pipe(take(1)).subscribe(schema => {
                this.schemaEffects.updateSchema({ ...schema, ...changedSchema }).then(schemaNew => {
                    if (schemaNew) {
                        this.version = schemaNew.version;
                    }
                });
            });
        }
    }

    delete() {
        this.schema$
            .pipe(
                take(1),
                switchMap(schema => this.schemaEffects.deleteSchema(schema.uuid))
            )
            .subscribe(() => {
                this.doesDelete = true;
                this.router.navigate(['admin', 'schemas']);
            });
    }

    onAssignmentChange(project: Project, isChecked: boolean) {
        if (isChecked) {
            this.schema$
                .pipe(take(1))
                .subscribe(schema => this.schemaEffects.assignEntityToProject('schema', schema.uuid, project.name));
        } else {
            this.schema$
                .pipe(take(1))
                .subscribe(schema => this.schemaEffects.removeEntityFromProject('schema', schema.uuid, project.name));
        }

        if (this.projectAssignments) {
            this.projectAssignments[project.uuid] = isChecked;
        }
    }
}

const updateFields: Array<keyof SchemaResponse> = [
    'name',
    'description',
    'fields',
    'displayField',
    'segmentField',
    'urlFields',
    'container',
    'autoPurge',
    'noIndex',
    'elasticsearch'
];

function stripSchemaFields(schema: SchemaResponse): any {
    return updateFields.reduce((obj, key) => ({ ...obj, [key]: schema[key] || null }), {});
}
