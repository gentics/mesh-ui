import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { BREADCRUMBS_BAR_PORTAL_ID } from '../../../common/constants';
import { Project } from '../../../common/models/project.model';
import { MicroschemaResponse } from '../../../common/models/server-models';
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
    templateUrl: './microschema-detail.component.html',
    styleUrls: ['microschema-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaDetailComponent implements OnInit, OnDestroy {
    // TODO Disable save button when editor is pristine
    // TODO Show message on save when schema has not changed
    projects: Project[];

    filterTerm: string;

    filterInput = new FormControl('');

    projects$: Observable<Project[]>;
    allProjects$: Observable<Project[]>;

    microschema$: Observable<MicroschemaResponse>;
    version: string;

    projectAssignments: ProjectAssignments;

    uuid$: Observable<string>;

    get microschemaJson(): string {
        return this.microschemaJson$.getValue();
    }
    set microschemaJson(v: string) {
        if (!v) {
            return;
        }
        this.microschemaJson$.next(v);
    }
    microschemaJson$ = new BehaviorSubject<string>('{}');
    // TODO load json schema from mesh instead of static file

    /** To check if has been edited by user */
    microschemaJsonOriginal: string;

    get schemaHasChanged(): boolean {
        try {
            const a = JSON.parse(this.microschemaJsonOriginal);
            const b = JSON.parse(this.microschemaJson);
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

    microschema = require('./microschema.schema.json');

    errors: MarkerData[] = [];

    BREADCRUMBS_BAR_PORTAL_ID = BREADCRUMBS_BAR_PORTAL_ID;

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
        private router: Router
    ) {}

    ngOnInit() {
        this.microschema$ = this.route.data.map(data => data.microschema).do(microschema => {
            this.isNew$.next(!microschema);
        });

        this.subscription = this.microschema$.subscribe(microschema => {
            this.microschemaJson = microschema
                ? JSON.stringify(stripMicroschemaFields(microschema), undefined, 4)
                : `{}`;
        });

        this.microschema$
            .filter(microschema => !!microschema)
            .take(1)
            .toPromise()
            .then(microschema => {
                // keep original to compare
                this.microschemaJsonOriginal = JSON.stringify(microschema);
                this.version = microschema.version;
                this.schemaEffects
                    .loadEntityAssignments('microschema', microschema.uuid)
                    .then(assignments => (this.projectAssignments = assignments));
            });

        this.adminProjectEffects.loadProjects();

        this.filterInput.valueChanges.debounceTime(100).subscribe(term => {
            setQueryParams(this.router, this.route, { q: term });
        });

        observeQueryParam(this.route.queryParamMap, 'q', '').subscribe(filterTerm => {
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
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onErrorChange(errors: MarkerData[]) {
        this.errors = errors;
    }

    save() {
        if (this.errors.length === 0) {
            const changedSchema = JSON.parse(this.microschemaJson);
            this.microschemaJsonOriginal = JSON.stringify(stripMicroschemaFields(changedSchema));
            if (this.isNew$.getValue()) {
                this.schemaEffects.createMicroschema(changedSchema).then((microschema: MicroschemaResponse) => {
                    this.isNew$.next(false);
                    this.router.navigate(['admin', 'microschemas', microschema.uuid]);
                    this.version = microschema.version;
                });
            } else {
                this.microschema$.take(1).subscribe(microschema => {
                    this.schemaEffects.updateMicroschema({ ...microschema, ...changedSchema }).then(microschemaNew => {
                        if (microschemaNew) {
                            this.version = microschemaNew.version;
                        }
                    });
                });
            }
        }
    }

    delete() {
        this.microschema$
            .take(1)
            .switchMap(microschema => this.schemaEffects.deleteMicroschema(microschema.uuid))
            .subscribe(() => {
                this.doesDelete = true;
                this.router.navigate(['admin', 'microschemas']);
            });
    }

    onAssignmentChange(project: Project, isChecked: boolean) {
        if (isChecked) {
            this.microschema$
                .take(1)
                .subscribe(microschema =>
                    this.schemaEffects.assignEntityToProject('microschema', microschema.uuid, project.name)
                );
        } else {
            this.microschema$
                .take(1)
                .subscribe(microschema =>
                    this.schemaEffects.removeEntityFromProject('microschema', microschema.uuid, project.name)
                );
        }

        this.projectAssignments[project.uuid] = isChecked;
    }
}

const updateFields: Array<keyof MicroschemaResponse> = ['name', 'description', 'fields'];

function stripMicroschemaFields(microschema: MicroschemaResponse): any {
    return updateFields.reduce((obj, key) => ({ ...obj, [key]: microschema[key] }), {});
}
