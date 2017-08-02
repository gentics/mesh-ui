import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { AdminEffectsService } from '../../providers/effects/admin-effects.service';
import { Observable, Subscription } from 'rxjs';
import { ProjectAssignments } from '../../../state/models/admin-state.model';
import difference from 'lodash/difference';

interface Assignment {
    projectUuid: string;
    assigned: boolean;
    projectName: string;
}

@Component({
    templateUrl: './schema-assignment.component.html',
    selector: 'schema-assignment',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaAssignmentComponent implements OnChanges, OnDestroy {
    @Input() type: 'schema' | 'microschema';
    @Input() uuid: string;

    assignments$: Observable<Assignment[]>;

    assignedProjects: string[] = [];

    subscription: Subscription;

    constructor(private state: ApplicationStateService,
                private admin: AdminEffectsService) {
        const stateAssignments$ = state.select(state => state.admin.assignedToProject).filter(Boolean);

        this.assignments$ = stateAssignments$.map(assignments => Object.keys(assignments).map(uuid => ({
            projectUuid: uuid,
            assigned: assignments[uuid],
            projectName: state.now.entities.project[uuid].name
        })));

        this.subscription = stateAssignments$.map(assignments => Object.keys(assignments).filter(uuid => assignments[uuid]))
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
            this.admin.assignEntityToProject(this.type, this.uuid, this.state.now.entities.project[projectAdded].name);
        } else if (changedProjectUuids.length < this.assignedProjects.length) {
            const projectRemoved = difference(this.assignedProjects, changedProjectUuids)[0];
            this.admin.removeEntityFromProject(this.type, this.uuid, this.state.now.entities.project[projectRemoved].name);
        }
        this.assignedProjects = changedProjectUuids;
    }

    load(): void {
        if (this.type && this.uuid) {
            this.admin.loadEntityAssignments(this.type, this.uuid);
        }
    }
}
