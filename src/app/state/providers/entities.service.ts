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
import { AppState } from '../models/app-state.model';

/**
 * This service replaces the pattern of `state.select(state => state.entities.node[uuid]).subscribe(...)`, since we now have
 * a more complex nested entity state model. Instead one would write: `entities.selectNode(uuid, language, version).subscribe(...)`
 *
 * For each entity, there is a "get" and a "select" method. The former returns the entity, while the latter returns
 * an observable stream of that entity which will emit each time that entity changes.
 *
 */
@Injectable()
export class EntitiesService {

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

    getProject(uuid: string): Project | undefined {
        return this.getProjectFromState(this.state.now, uuid);
    }

    selectProject(uuid: string): Observable<Project> {
        return this.selectWithFilter(state => this.getProjectFromState(state, uuid));
    }

    private getProjectFromState(state: AppState, uuid: string): Project | undefined {
        return getNestedEntity<'project'>(
            state.entities.project,
            this.discriminator.project,
            { uuid },
            this.config.FALLBACK_LANGUAGE
        );
    }

    getNode(uuid: string, language?: string, version?: string): MeshNode | undefined {
        return this.getNodeFromState(this.state.now, uuid, language, version);
    }

    selectNode(uuid: string, language?: string, version?: string): Observable<MeshNode> {
        return this.selectWithFilter(state => this.getNodeFromState(state, uuid, language, version));
    }

    private getNodeFromState(state: AppState, uuid: string, language?: string, version?: string): MeshNode | undefined {
        return getNestedEntity<'node'>(
            state.entities.node,
            this.discriminator.node,
            { uuid, language, version },
            this.config.FALLBACK_LANGUAGE
        );
    }

    getUser(uuid: string): User | undefined {
        return this.getUserFromState(this.state.now, uuid);
    }

    selectUser(uuid: string): Observable<User> {
        return this.selectWithFilter(state => this.getUserFromState(state, uuid));
    }

    private getUserFromState(state: AppState, uuid: string): User | undefined {
        return getNestedEntity<'user'>(
            state.entities.user,
            this.discriminator.user,
            { uuid },
            this.config.FALLBACK_LANGUAGE
        );
    }

    getSchema(uuid: string, version?: any): Schema | undefined {
        return this.getSchemaFromState(this.state.now, uuid, version);
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectSchema(uuid: string, version?: any): Observable<Schema> {
        return this.selectWithFilter(state => this.getSchemaFromState(state, uuid, version));
    }

    getAllSchemas(): Schema[] {
        return this.getAllSchemasFromState(this.state.now);
    }

    selectAllSchemas(): Observable<Schema[]> {
        return this.state.select(state => this.getAllSchemasFromState(state));
    }

    private getAllSchemasFromState(state: AppState): Schema[] {
        return Object.keys(state.entities.schema).map(uuid => this.getSchemaFromState(state, uuid)!);
    }

    private getSchemaFromState(state: AppState, uuid: string, version?: any): Schema | undefined {
        return getNestedEntity<'schema'>(
            state.entities.schema,
            this.discriminator.schema,
            { uuid, version },
            this.config.FALLBACK_LANGUAGE
        );
    }

    getMicroschema(uuid: string, version?: any): Microschema | undefined {
        return this.getMicroschemaFromState(this.state.now, uuid, version);
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectMicroschema(uuid: string, version?: any): Observable<Microschema> {
        return this.selectWithFilter(state => this.getMicroschemaFromState(state, uuid, version));
    }

    getAllMicroschemas(): Microschema[] {
        return this.getAllMicroschemasFromState(this.state.now);
    }

    selectAllMicroschemas(): Observable<Microschema[]> {
        return this.state.select(state => this.getAllMicroschemasFromState(state));
    }

    private getAllMicroschemasFromState(state: AppState): Microschema[] {
        return Object.keys(state.entities.microschema).map(uuid => this.getMicroschemaFromState(state, uuid)!);
    }

    private getMicroschemaFromState(state: AppState, uuid: string, version?: any): Microschema | undefined {
        return getNestedEntity<'microschema'>(
            state.entities.microschema,
            this.discriminator.microschema,
            { uuid, version },
            this.config.FALLBACK_LANGUAGE
        );
    }

    /**
     * Applies the selectorFn to the AppState and filters out any undefined values.
     */
    private selectWithFilter<T>(selectorFn: (state: AppState) => T | undefined): Observable<T> {
        return this.state.select(selectorFn)
            .filter(entity => entity !== undefined) as Observable<T>;
    }
}
