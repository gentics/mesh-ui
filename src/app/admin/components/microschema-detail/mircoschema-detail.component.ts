import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Project } from '../../../common/models/project.model';
import { ProjectResponse } from '../../../common/models/server-models';
import { MicroschemaResponse } from '../../../common/models/server-models';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
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
    templateUrl: './microschema-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaDetailComponent implements OnInit, OnDestroy {
    // TODO Disable save button when editor is pristine
    // TODO Show message on save when schema has not changed
    projects: Project[];

    filterTerm: string;

    filterInput = new FormControl('');

    private destroy$ = new Subject<void>();

    projects$: Observable<Project[]>;

    arrayList: string[] = [];

    microschema$: Observable<MicroschemaResponse>;
    version$: Observable<string>;

    projectAssignments: ProjectAssignments;

    uuid$: Observable<string>;

    microschemaJson = '';
    // TODO load json schema from mesh instead of static file
    schema = require('./microschema.schema.json');

    errors: MarkerData[] = [];
    isNew = true;

    loading$: Observable<boolean>;

    subscription: Subscription;

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private modal: ModalService,
        private i18n: I18nService,
        public adminProjectEffects: AdminProjectEffectsService,
        private schemaEffects: AdminSchemaEffectsService,
        private route: ActivatedRoute,
        private router: Router,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.microschema$ = this.route.data.map(data => data.microschema).do(microschema => {
            this.isNew = !microschema;
        });

        this.version$ = this.microschema$.map(it => it.version);

        this.subscription = this.microschema$.subscribe(microschema => {
            this.microschemaJson = microschema
                ? JSON.stringify(stripMicroschemaFields(microschema), undefined, 4)
                : `{}`;
            this.ref.detectChanges();
        });

        this.microschema$
            .take(1)
            .toPromise()
            .then(microschema => this.schemaEffects.loadEntityAssignments('microschema', microschema.uuid))
            .then(assignments => (this.projectAssignments = assignments));

        this.adminProjectEffects.loadProjects();

        this.filterInput.valueChanges
            .debounceTime(100)
            .takeUntil(this.destroy$)
            .subscribe(term => {
                setQueryParams(this.router, this.route, { q: term });
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
            .takeUntil(this.destroy$)
            .subscribe(filterTerm => {
                this.adminProjectEffects.setFilterTerm(filterTerm);
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        const allProjects$ = this.state
            .select(state => state.adminProjects.projectList)
            .map(uuids => uuids.map(uuid => this.entities.getProject(uuid)).filter(notNullOrUndefined));

        const filterTerm$ = this.state.select(state => state.adminProjects.filterTerm);

        this.projects$ = combineLatest(allProjects$, filterTerm$).map(([projects, filterTerm]) => {
            this.filterTerm = filterTerm;
            return projects.filter(project => fuzzyMatch(filterTerm, project.name) !== null).sort((pro1, pro2) => {
                return pro1.name < pro2.name ? -1 : 1;
            });
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    onErrorChange(errors: MarkerData[]) {
        this.errors = errors;
        this.ref.detectChanges();
    }

    save() {
        if (this.errors.length === 0) {
            const changedSchema = JSON.parse(this.microschemaJson);
            if (this.isNew) {
                this.schemaEffects.createMicroschema(changedSchema).then(microschema => {
                    if (microschema) {
                        this.router.navigate(['admin', 'microschemas', microschema.uuid]);
                    }
                });
            } else {
                this.microschema$.take(1).subscribe(microschema => {
                    this.schemaEffects.updateMicroschema({ ...microschema, ...changedSchema });
                });
            }
        }
    }

    delete() {
        this.microschema$
            .take(1)
            .switchMap(microschema => this.schemaEffects.deleteMicroschema(microschema.uuid))
            .subscribe(() => this.router.navigate(['admin', 'microschemas']));
    }

    onAssignmentChange(project: Project, isChecked: boolean) {
        if (isChecked) {
            this.microschema$
                .take(1)
                .map(microschema =>
                    this.schemaEffects.assignEntityToProject('microschema', microschema.uuid, project.name)
                )
                .subscribe();
        } else {
            this.microschema$
                .take(1)
                .map(microschema =>
                    this.schemaEffects.removeEntityFromProject('microschema', microschema.uuid, project.name)
                )
                .subscribe();
        }

        this.projectAssignments[project.uuid] = isChecked;
    }
}

const updateFields: Array<keyof MicroschemaResponse> = ['name', 'description', 'fields'];

function stripMicroschemaFields(microschema: MicroschemaResponse): any {
    return updateFields.reduce((obj, key) => ({ ...obj, [key]: microschema[key] }), {});
}
