import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { difference } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

interface Assignment {
    projectUuid: string;
    assigned: boolean;
    projectName: string;
}

@Component({
    templateUrl: './schema-assignment.component.html',
    selector: 'mesh-schema-assignment',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaAssignmentComponent implements OnChanges, OnDestroy, OnInit {
    @Input() type: 'schema' | 'microschema';
    @Input() uuid: string;

    assignments$: Observable<Assignment[]>;

    assignedProjects: string[] = [];

    subscription: Subscription;

    constructor(private state: ApplicationStateService, private adminSchemaEffects: AdminSchemaEffectsService) {}

    ngOnInit() {
        const stateAssignments$ = this.state.select(state => state.adminSchemas.assignedToProject).filter(Boolean);

        this.assignments$ = stateAssignments$.map(assignments =>
            Object.keys(assignments).map(uuid => ({
                projectUuid: uuid,
                assigned: assignments[uuid],
                projectName: this.state.now.entities.project[uuid].name
            }))
        );

        this.subscription = stateAssignments$
            .map(assignments => Object.keys(assignments).filter(uuid => assignments[uuid]))
            .subscribe(uuids => {
                this.assignedProjects = uuids;
            });
    }

    ngOnChanges() {
        this.load();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    assign(changedProjectUuids: string[]) {
        /*
         * The select input should not be updated by the state anymore, because
         * it could be disruptive for the user if they rapidly assign projects
         */
        this.subscription.unsubscribe();
        if (changedProjectUuids.length > this.assignedProjects.length) {
            const projectAdded = difference(changedProjectUuids, this.assignedProjects)[0];
            this.adminSchemaEffects.assignEntityToProject(
                this.type,
                this.uuid,
                this.state.now.entities.project[projectAdded].name
            );
        } else if (changedProjectUuids.length < this.assignedProjects.length) {
            const projectRemoved = difference(this.assignedProjects, changedProjectUuids)[0];
            this.adminSchemaEffects.removeEntityFromProject(
                this.type,
                this.uuid,
                this.state.now.entities.project[projectRemoved].name
            );
        }
        this.assignedProjects = changedProjectUuids;
    }

    load(): void {
        if (this.type && this.uuid) {
            this.adminSchemaEffects.loadEntityAssignments(this.type, this.uuid);
        }
    }
}
