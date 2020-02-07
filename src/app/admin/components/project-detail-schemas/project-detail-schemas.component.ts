import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, filter, first, map, takeUntil } from 'rxjs/operators';

import { SchemaReference } from '../../../common/models/common.model';
import { Project } from '../../../common/models/project.model';
import { Schema } from '../../../common/models/schema.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { SchemaAssignments } from '../../../state/models/admin-schemas-state.model';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminProjectEffectsService } from '../../providers/effects/admin-project-effects.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

@Component({
    selector: 'mesh-project-detail-schemas',
    templateUrl: './project-detail-schemas.component.html',
    styleUrls: ['./project-detail-schemas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailSchemasComponent implements OnInit, OnDestroy {
    public project$: Observable<Project>;
    public project: Project;
    public readOnly = true;

    public form: FormGroup;
    public filterInputSchema = new FormControl('');

    public schemas$: Observable<Schema[]>;
    public allSchemas$: Observable<Schema[]>;
    public projectSchemas$: Observable<SchemaReference[] | undefined>;

    public filterTermSchema = '';

    public schemaAssignments$?: Observable<SchemaAssignments>;
    public schemaAssignments?: SchemaAssignments;

    public itemsPerPage = 10;
    public totalCount$: Observable<number | null>;

    public currentPage$ = new BehaviorSubject<number>(1);

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private entities: EntitiesService,
        private state: ApplicationStateService,
        private listEffects: ListEffectsService,
        private schemaEffects: AdminSchemaEffectsService,
        private projectEffect: AdminProjectEffectsService
    ) {}

    // ON INIT
    ngOnInit() {
        // PROJECT

        // get project from route
        this.project$ = this.route.data.pipe(
            map(data => data.project),
            filter(notNullOrUndefined)
        );

        this.project$.pipe(takeUntil(this.destroy$)).subscribe(project => {
            this.project = project;
            this.readOnly = !!project && !project.permissions.update;
            this.form = this.formBuilder.group({
                name: [project ? project.name : '', Validators.required]
            });

            // load related project data
            this.listEffects.loadSchemasForProject(project.name);
        });

        // SCHEMAS

        // if filter term is already set, update input
        this.state
            .select(state => state.adminProjects.filterTermSchemas)
            .pipe(
                filter(filterTerm => !!filterTerm),
                first()
            )
            .toPromise()
            .then(filterTerm => this.filterInputSchema.setValue(filterTerm));

        // load all schemas in frontend since there is not yet any filter query parameter available
        this.schemaEffects.setListPagination(0, 999);
        // request all schemas
        this.schemaEffects.loadSchemas();

        // filter term entered in search bar
        const filterTermSchema$ = this.state.select(state => state.adminProjects.filterTermSchemas);

        // listen to input changes and page changes
        combineLatest(this.filterInputSchema.valueChanges, this.currentPage$)
            .pipe(
                debounceTime(100),
                takeUntil(this.destroy$)
            )
            .subscribe(([filterTerm, currentPage]) => {
                const queryParams = { p: currentPage || 1 };
                if (filterTerm || filterTerm === '') {
                    Object.assign(queryParams, { q: filterTerm });
                    this.projectEffect.setSchemaFilterTerm(filterTerm);
                }
                setQueryParams(this.router, this.route, { schemas: JSON.stringify(queryParams) });
            });

        // Watch URL parameter:
        // Search query and pagination data are bookmarkable.
        observeQueryParam(this.route.queryParamMap, 'schemas', JSON.stringify({ p: this.currentPage$.getValue() }))
            .pipe(
                filter(schemaData => !!schemaData),
                takeUntil(this.destroy$)
            )
            .subscribe(schemaData => {
                // parse query and pagination information from url parameter
                const parsedData = JSON.parse(schemaData);
                const query = parsedData['q'] || null;
                const currentPage = parsedData['p'] ? parseInt(parsedData['p'], 10) : 1;

                // proceed data
                this.currentPage$.next(currentPage);
                this.listEffects.setFilterTerm(query);
                this.filterInputSchema.setValue(query);
            });

        // subscribe to all schemas
        this.allSchemas$ = this.entities.selectAllSchemas();

        // get project schemas
        this.projectSchemas$ = this.entities.selectProject(this.project.uuid).pipe(
            map(project => {
                if (!project.schemas) {
                    return [];
                }
                return project.schemas;
            })
        );

        // get schema assignments
        this.schemaAssignments$ = combineLatest(this.allSchemas$, this.projectSchemas$).pipe(
            map(([allSchemas, projectSchemas]) => {
                const schemaAssignments = {};
                allSchemas.map(schema => {
                    const match: string | undefined = projectSchemas!
                        .map(projSchema => projSchema.uuid)
                        .find(projSchemaUuid => projSchemaUuid === schema.uuid);
                    Object.assign(schemaAssignments, { [schema.uuid]: match ? true : false });
                });
                return schemaAssignments;
            })
        );

        // get schema assignments for view
        this.schemaAssignments$
            .pipe(
                filter(schema => !!schema),
                takeUntil(this.destroy$)
            )
            .subscribe(schemaAssignments => {
                this.schemaAssignments = schemaAssignments;
            });

        // all schemas filtered by search term
        this.schemas$ = combineLatest(this.allSchemas$, filterTermSchema$).pipe(
            map(([schemas, filterTerm]) => {
                this.filterTermSchema = filterTerm.toLocaleLowerCase();
                return schemas
                    .filter(project => fuzzyMatch(filterTerm, project.name) !== null)
                    .sort((pro1, pro2) => {
                        return pro1.name < pro2.name ? -1 : 1;
                    });
            })
        );

        // get schema total count from store
        this.totalCount$ = this.state.select(state => state.adminSchemas.pagination.totalItems);
    }

    // ON DESTROY
    ngOnDestroy(): void {
        setQueryParams(this.router, this.route, {});
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPageChange(newPage: number): void {
        this.currentPage$.next(newPage);
    }

    onSchemaAssignmentChange(schema: Schema, isChecked: boolean): void {
        // set view state
        if (this.schemaAssignments) {
            this.schemaAssignments[schema.uuid] = isChecked;
        }

        // request changes
        if (isChecked) {
            this.schemaEffects
                .assignEntityToProject('schema', schema.uuid, this.project.name)
                .then(() => this.listEffects.loadSchemasForProject(this.project.name));
        } else {
            this.schemaEffects
                .removeEntityFromProject('schema', schema.uuid, this.project.name)
                .then(() => this.listEffects.loadSchemasForProject(this.project.name));
        }
    }
}
