import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Group } from '../../common/models/group.model';
import { Microschema } from '../../common/models/microschema.model';
import { MeshNode } from '../../common/models/node.model';
import { Project } from '../../common/models/project.model';
import { Schema } from '../../common/models/schema.model';
import { TagFamily } from '../../common/models/tag-family.model';
import { Tag } from '../../common/models/tag.model';
import { User } from '../../common/models/user.model';
import { concatUnique, notNullOrUndefined } from '../../common/util/util';
import { ConfigService } from '../../core/providers/config/config.service';
import { AppState } from '../models/app-state.model';

import { ApplicationStateService } from './application-state.service';
import { getDiscriminator, getNestedEntity, EntityDiscriminators } from './entity-state-actions';

export interface NodeDiscriminatorOptions {
    /**
     * The language or array of language codes which act as fallbacks.
     * The fist language is returned if it exists, the the second and so on.
     */
    language?: string[] | string;
    /**
     * If false, then all possible languages are checked (starting with the ones supplied by the fallback option),
     * and even if none of the fallback languages exist for that node, the next non-matching language will be
     * returned.
     * Defaults to true.
     */
    strictLanguageMatch?: boolean;
    /** The version of the node being requested */
    version?: string;
}

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
    discriminator: { [K in keyof EntityDiscriminators]: EntityDiscriminators[K] } = {
        group: [],
        project: [],
        node: [],
        user: [],
        schema: [],
        microschema: [],
        tag: [],
        tagFamily: []
    };

    constructor(private state: ApplicationStateService, private config: ConfigService) {
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
        return getNestedEntity<'project'>(state.entities.project, this.discriminator.project, { uuid });
    }

    getNode(uuid: string, options: NodeDiscriminatorOptions = { strictLanguageMatch: true }): MeshNode | undefined {
        const { version, language, strictLanguageMatch } = options;
        const fallbacks = this.createFallbackArray(strictLanguageMatch, language);
        return this.getNodeFromState(this.state.now, uuid, fallbacks, version);
    }

    selectNode(uuid: string, options: NodeDiscriminatorOptions = { strictLanguageMatch: true }): Observable<MeshNode> {
        const { version, language, strictLanguageMatch } = options;
        const fallbacks = this.createFallbackArray(strictLanguageMatch, language);
        return this.selectWithFilter(state => this.getNodeFromState(state, uuid, fallbacks, version));
    }

    /**
     * Creates an array of languages to be used as fallbacks based on the input.
     * If strict === true, then the input array is returned.
     * If strict === false, then the input array is augmented with the other available
     * languages based on the app config.
     */
    private createFallbackArray(strict: boolean = false, languages?: string[] | string): string[] {
        let languageArray: string[] | undefined;
        if (typeof languages === 'string') {
            languageArray = [languages];
        } else {
            languageArray = languages;
        }
        if (strict) {
            if (!languageArray || languageArray.length === 0) {
                throw new Error('At least one language must be provided when in strictLanguageMatch is true.');
            }
            return languageArray;
        }

        const defaultFallbacks = this.config.CONTENT_LANGUAGES.sort(
            (a, b) => (a === this.config.FALLBACK_LANGUAGE ? -1 : 1)
        );

        return concatUnique(languageArray || [], defaultFallbacks);
    }

    private getNodeFromState(
        state: AppState,
        uuid: string,
        languageFallbacks?: string[],
        version?: string
    ): MeshNode | undefined {
        return getNestedEntity<'node'>(
            state.entities.node,
            this.discriminator.node,
            { uuid, version },
            languageFallbacks
        );
    }

    getUser(uuid: string): User | undefined {
        return this.getUserFromState(this.state.now, uuid);
    }

    selectUser(uuid: string): Observable<User> {
        return this.selectWithFilter(state => this.getUserFromState(state, uuid));
    }

    private getUserFromState(state: AppState, uuid: string): User | undefined {
        return getNestedEntity<'user'>(state.entities.user, this.discriminator.user, { uuid });
    }

    getSchema(uuid: string, version?: string): Schema | undefined {
        return this.getSchemaFromState(this.state.now, uuid, version);
    }

    selectSchema(uuid: string, version?: string): Observable<Schema> {
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

    private getSchemaFromState(state: AppState, uuid: string, version?: string): Schema | undefined {
        return getNestedEntity<'schema'>(state.entities.schema, this.discriminator.schema, { uuid, version });
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
        return getNestedEntity<'microschema'>(state.entities.microschema, this.discriminator.microschema, {
            uuid,
            version
        });
    }

    getTagFamily(uuid: string): TagFamily | undefined {
        return this.getTagFamilyFromState(this.state.now, uuid);
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectTagFamily(uuid: string): Observable<TagFamily> {
        return this.selectWithFilter(state => this.getTagFamilyFromState(state, uuid));
    }

    getAllTagFamilies(): TagFamily[] {
        return this.getAllTagFamiliesFromState(this.state.now);
    }

    selectAllTagFamilies(): Observable<TagFamily[]> {
        return this.state.select(state => this.getAllTagFamiliesFromState(state));
    }

    private getAllTagFamiliesFromState(state: AppState): TagFamily[] {
        return Object.values(state.tags.tagFamilies).map(uuid => this.getTagFamilyFromState(state, uuid)).filter(notNullOrUndefined);
    }

    private getTagFamilyFromState(state: AppState, uuid: string): TagFamily | undefined {
        return getNestedEntity<'tagFamily'>(state.entities.tagFamily, this.discriminator.tagFamily, { uuid });
    }

    getTag(uuid: string): Tag | undefined {
        return this.getTagFromState(this.state.now, uuid);
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectTag(uuid: string): Observable<Tag> {
        return this.selectWithFilter(state => this.getTagFromState(state, uuid));
    }

    getAllTags(): Tag[] {
        return this.getAllTagsFromState(this.state.now);
    }

    selectAllTags(): Observable<Tag[]> {
        return this.state.select(state => this.getAllTagsFromState(state));
    }

    private getAllTagsFromState(state: AppState): Tag[] {
        return Object.values(state.tags.tags).map(uuid => this.getTagFromState(state, uuid)).filter(notNullOrUndefined);
    }

    private getTagFromState(state: AppState, uuid: string): Tag | undefined {
        return getNestedEntity<'tag'>(state.entities.tag, this.discriminator.tag, { uuid });
    }

    getGroup(uuid: string): Group | undefined {
        return this.getGroupFromState(this.state.now, uuid);
    }

    // TODO: version should be of type string, it was fixed in Mesh 0.9.20
    selectGroup(uuid: string): Observable<Group> {
        return this.selectWithFilter(state => this.getGroupFromState(state, uuid));
    }

    getAllGroups(): Group[] {
        return this.getAllGroupsFromState(this.state.now);
    }

    selectAllGroups(): Observable<Group[]> {
        return this.state.select(state => this.getAllGroupsFromState(state));
    }

    private getAllGroupsFromState(state: AppState): Group[] {
        return Object.keys(state.entities.group)
            .map(uuid => this.getGroupFromState(state, uuid))
            .filter(notNullOrUndefined);
    }

    private getGroupFromState(state: AppState, uuid: string): Group | undefined {
        return getNestedEntity<'group'>(state.entities.group, this.discriminator.group, { uuid });
    }

    /**
     * Applies the selectorFn to the AppState and filters out any undefined values.
     */
    private selectWithFilter<T>(selectorFn: (state: AppState) => T | undefined): Observable<T> {
        return this.state.select(selectorFn).filter(notNullOrUndefined);
    }
}
