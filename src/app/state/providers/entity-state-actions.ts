import { Injectable } from '@angular/core';
import { deepApplyWithReuse, Immutable, StateActionBranch } from 'immutablets';

import { EntityState } from '../models/entity-state.model';
import { AppState } from '../models/app-state.model';
import { MeshNode } from '../../common/models/node.model';
import { Schema } from '../../common/models/schema.model';
import { Microschema } from '../../common/models/microschema.model';
import { Project } from '../../common/models/project.model';
import { User } from '../../common/models/user.model';
import { BaseProperties } from '../../common/models/common.model';
import { Tag } from '../../common/models/tag.model';
import { TagFamily } from '../../common/models/tag-family.model';
import { Group } from '../../common/models/group.model';

@Injectable()
@Immutable()
export class EntityStateActions extends StateActionBranch<AppState> {
    private entities: EntityState;

    constructor() {
        super({
            uses: 'entities',
            initialState: {
                entities: {
                    group: {},
                    project: {},
                    node: {},
                    user: {},
                    schema: {},
                    microschema: {},
                    tag: {},
                    tagFamily: {}
                }
            }
        });
    }
}

export interface EntityStateType {
    group: Group;
    project: Project;
    node: MeshNode;
    user: User;
    schema: Schema;
    microschema: Microschema;
    tag: Tag;
    tagFamily: TagFamily;
}


type Discriminator<T extends BaseProperties> = Array<keyof T>;
type PartialWithUuid<T extends { uuid?: string; }> = Partial<T> & { uuid: string; };

export type EntityDiscriminators = {
    [K in keyof EntityStateType]: Discriminator<EntityStateType[K]>;
};

const defaultDiscriminator: Discriminator<BaseProperties> = ['uuid'];
const schemaDiscriminator: Discriminator<Schema> = ['uuid', 'version'];
const microschemaDiscriminator: Discriminator<Schema> = ['uuid', 'version'];
const nodeDiscriminator: Discriminator<MeshNode> = ['uuid', 'language', 'version'];

/**
 * Utility function to update the entity state.
 *
 * Returns a new entity state with the passed changes applied.
 * Reuses references of objects whenever possible.
 * Arrays are not merged, and only reuse references of their elements when they are equal.
 *
 * When `strict` is set to false, then the entities in the `changes` object only need to include a uuid and
 * any missing parts of the discriminator will be guessed.
 */
export function mergeEntityState(oldState: EntityState,
                                 changes: {[K in keyof EntityState]?: Array<PartialWithUuid<EntityStateType[K]>>; },
                                 strict: boolean = true): EntityState {
    const newState = Object.assign({}, oldState);
    let anyBranchChanged = false;

    for (const key of Object.keys(changes)) {
        const oldBranch = oldState[key as keyof EntityState];
        const branchChanges = changes[key as keyof EntityState]!;

        if (!oldBranch) {
            throw new Error(`mergeEntityState: Trying to merge nonexisting entity key "${key}"`);
        }
        const discriminator = getDiscriminator(key as keyof EntityDiscriminators);
        const branch = mergeBranch(oldBranch, branchChanges, discriminator, strict);
        if (branch !== oldBranch) {
            newState[key as keyof EntityState] = branch;
            anyBranchChanged = true;
        }
    }

    return anyBranchChanged ? newState : oldState;
}

/**
 * Merge an entity branch with a set of changes.
 * Reuses references of unchanged objects.
 */
function mergeBranch<B extends keyof EntityState>(oldBranch: EntityState[B],
                                                  changes: Array<PartialWithUuid<EntityStateType[B]>>,
                                                  discriminator: EntityDiscriminators[B],
                                                  strict: boolean = true): EntityState[B] {
    let newBranch: EntityState[B] = Object.assign({}, oldBranch);
    let anyEntityChanged = false;

    for (const change of changes) {
        if (strict) {
            const missing = missingProperties(change, discriminator);
            if (0 < missing.length) {
                const missingString = missing.join(', ');
                const changeString = JSON.stringify(change, null, 4);
                throw new Error(`mergeBranch: Required discriminator properties not found: ${missingString} on ${changeString}`);
            }
        }
        if (!change.uuid) {
            throw new Error(`mergeBranch: Missing uuid on ${JSON.stringify(change, null, 4)}`);
        }

        const oldEntity = getNestedEntity(oldBranch, discriminator, change);
        const newEntity = oldEntity ? deepApplyWithReuse(oldEntity, change) : change as EntityStateType[B];
        if (newEntity !== oldEntity) {
            newBranch = assignNestedEntity(newBranch, discriminator, newEntity);
            anyEntityChanged = true;
        }

    }

    return anyEntityChanged ? newBranch : oldBranch;
}

/**
 * Given a key, returns the discriminator array for that type.
 */
export function getDiscriminator<K extends keyof EntityDiscriminators>(type: K): EntityDiscriminators[K] {
    switch (type) {
        case 'node':
            return nodeDiscriminator;
        case 'schema':
            return schemaDiscriminator;
        case 'microschema':
            return microschemaDiscriminator;
        default:
            return defaultDiscriminator;
    }
}

/**
 * Retrieves a deeply-nested value from the branch, the value being located at the object path
 * defined by the discriminator array.
 */
export function getNestedEntity<B extends keyof EntityState>(branch: EntityState[B],
                                                             discriminator: EntityDiscriminators[B],
                                                             source: PartialWithUuid<EntityStateType[B]>,
                                                             languageFallbacks?: string[]): EntityStateType[B] | undefined {
    // for all entities, the uuid is required
    if (!source || !source.uuid) {
        return undefined;
    }

    let o: any = branch;
    for (const k of discriminator) {
        let key = source[k as keyof typeof source];
        if (k === 'language' && Array.isArray(languageFallbacks) && 0 < languageFallbacks.length) {
            const availableLanguages = Object.keys(o);
            key = getLanguageKeyFromFallbackArray(availableLanguages, languageFallbacks);
        } else if (key === undefined) {
            // The discriminator part was not provided in the source.
            // We must choose a default from any available.
            const alternativeKeys = Object.keys(o);
            if (k === 'version') {
                // return the most recent version
                key = alternativeKeys.sort((a, b) => parseFloat(b) - parseFloat(a))[0];
            }
        }
        o = o[key];
        if (typeof o !== 'object') {
            return o;
        }
    }
    return o;
}

function getLanguageKeyFromFallbackArray(available: string[], fallbacks: string[]): string | undefined {
    for (const language of fallbacks) {
        if (-1 < available.indexOf(language)) {
            return language;
        }
    }
}

/**
 * Assigns the newValue to a deeply-nested property of the branch object. The nesting is defined by the
 * properties in the discriminator array.
 *
 * Example:
 * ```
 * const discriminator = ['uuid', 'language'];
 * const branch = {};
 * const entity = { uuid: 'abc', language: 'en', name: 'Foo' };
 *
 * assignNestedEntity(branch, discriminator, entity);
 * // => entity {
 * //       abc: {
 * //           en: { uuid: 'abc', language: 'en', name: 'Foo' }
 * //       }
 * //   };
 * ```
 */
function assignNestedEntity<B extends keyof EntityState>(branch: EntityState[B],
                                                         discriminator: EntityDiscriminators[B],
                                                         newValue: EntityStateType[B]): EntityState[B] {
    const mutateBranch: any = Object.assign({}, branch);
    let o: any = mutateBranch;
    for (const k of discriminator) {
        const key = newValue[k as keyof EntityStateType[B]];
        o[key] = k === discriminator[discriminator.length - 1] ? newValue : {};
        o = o[key];
    }

    return deepApplyWithReuse(branch, mutateBranch);
}

/**
 * Given an object and an array of required property names, returns an array of those
 * required properties which are not present on the object.
 */
function missingProperties(object: object, required: string[]): string[] {
    const missing: string[] = [];
    for (const prop of required) {
        if (!object.hasOwnProperty(prop)) {
            missing.push(prop);
        }
    }
    return missing;
}
