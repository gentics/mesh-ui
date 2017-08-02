import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApplicationStateService } from './application-state.service';
import { MeshNode } from '../../common/models/node.model';
import { EntityDiscriminators, getDiscriminator, getNestedEntity } from './entity-state-actions';
import { ConfigService } from '../../core/providers/config/config.service';
import { Project } from '../../common/models/project.model';
import { User } from '../../common/models/user.model';
import { Schema } from '../../common/models/schema.model';
import { Microschema } from '../../common/models/microschema.model';

/**
 * This service replaces the pattern of `state.select(state => state.entities.node[uuid]).subscribe(...)`, since we now have
 * a more complex nested entity state model.
 *
 * Instead one would write: `entitySelect.selectNode(uuid, language, version).subscribe(...)`
 */
@Injectable()
export class EntitySelectService {

    discriminator: { [K in keyof EntityDiscriminators]: EntityDiscriminators[K]; } = {
        project: [],
        node: [],
        user: [],
        schema: [],
        microschema: []
    };

    constructor(private state: ApplicationStateService,
                private config: ConfigService) {
        Object.keys(this.discriminator).forEach((key: keyof EntityDiscriminators) => {
            this.discriminator[key] = getDiscriminator(key);
        });
    }

    selectProject(uuid: string): Observable<Project> {
        return this.state.select(state => {
            return getNestedEntity<'project'>(
                state.entities.project,
                this.discriminator.project,
                { uuid },
                this.config.FALLBACK_LANGUAGE
            );
        });
    }

    selectNode(uuid: string, language?: string, version?: string): Observable<MeshNode> {
        return this.state.select(state => {
            return getNestedEntity<'node'>(
                state.entities.node,
                this.discriminator.node,
                { uuid, language, version },
                this.config.FALLBACK_LANGUAGE
            );
        });
    }

    selectUser(uuid: string): Observable<User> {
        return this.state.select(state => {
            return getNestedEntity<'user'>(
                state.entities.user,
                this.discriminator.user,
                { uuid },
                this.config.FALLBACK_LANGUAGE
            );
        });
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectSchema(uuid: string, version?: any): Observable<Schema> {
        return this.state.select(state => {
            return getNestedEntity<'schema'>(
                state.entities.schema,
                this.discriminator.schema,
                { uuid, version },
                this.config.FALLBACK_LANGUAGE
            );
        });
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectMicroschema(uuid: string, version?: any): Observable<Microschema> {
        return this.state.select(state => {
            return getNestedEntity<'microschema'>(
                state.entities.microschema,
                this.discriminator.microschema,
                { uuid, version },
                this.config.FALLBACK_LANGUAGE
            );
        });
    }
}
