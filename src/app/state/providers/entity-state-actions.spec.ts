import { MeshNode } from '../../common/models/node.model';
import { User } from '../../common/models/user.model';
import { EntityState } from '../models/entity-state.model';

import { getNestedEntity, mergeEntityState } from './entity-state-actions';

describe('EntityStateActions', () => {
    describe('mergeEntityState()', () => {
        const empty: EntityState = {
            group: {},
            microschema: {},
            node: {},
            project: {},
            schema: {},
            user: {},
            tag: {},
            tagFamily: {}
        };

        it('adds new entities to the output hash', () => {
            const before = empty;
            const after = mergeEntityState(before, {
                user: [
                    {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    }
                ]
            });
            expect(after).not.toBe(before);
            expect(after).not.toEqual(before);
            expect(after.user).toEqual({
                'admin-uuid': {
                    uuid: 'admin-uuid',
                    username: 'admin'
                } as User
            });
        });

        it('does not change the old state', () => {
            const before = empty;
            const after = mergeEntityState(before, {
                user: [
                    {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    }
                ]
            });

            expect(before).toEqual({
                group: {},
                microschema: {},
                node: {},
                project: {},
                schema: {},
                user: {},
                tag: {},
                tagFamily: {}
            });
        });

        it('reuses references of unchanged objects', () => {
            const before = {
                ...empty,
                user: {
                    'admin-uuid': {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    } as User
                }
            };
            const after = mergeEntityState(before, {
                user: [
                    {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    }
                ]
            });

            expect(after.user).toBe(before.user);
        });

        describe('reusing object references', () => {
            let before: EntityState;
            let after: EntityState;

            beforeAll(() => {
                before = {
                    ...empty,
                    user: {
                        'admin-uuid': {
                            uuid: 'admin-uuid',
                            username: 'admin',
                            groups: [
                                {
                                    name: 'firstGroup',
                                    uuid: 'first-group-uuid'
                                }
                            ]
                        } as User
                    }
                };
                after = mergeEntityState(before, {
                    user: [
                        {
                            uuid: 'admin-uuid',
                            username: 'admin',
                            groups: [
                                {
                                    name: 'firstGroup',
                                    uuid: 'first-group-uuid'
                                },
                                {
                                    name: 'secondGroup',
                                    uuid: 'second-group-uuid'
                                }
                            ]
                        }
                    ]
                });
            });

            it('creates new objects of changed object properties', () => {
                expect(after).not.toBe(before);
                expect(after.user).not.toBe(before.user);
                expect(after.user['admin-uuid']).not.toBe(before.user['admin-uuid']);
                expect(before.user['admin-uuid'].groups).toEqual([
                    {
                        name: 'firstGroup',
                        uuid: 'first-group-uuid'
                    }
                ]);
                expect(after.user['admin-uuid'].groups).toEqual([
                    {
                        name: 'firstGroup',
                        uuid: 'first-group-uuid'
                    },
                    {
                        name: 'secondGroup',
                        uuid: 'second-group-uuid'
                    }
                ]);
            });

            it('reuses references of unchanged object properties', () => {
                const isSameReference = before.user['admin-uuid'].groups[0] === after.user['admin-uuid'].groups[0];
                expect(isSameReference).toBe(true);
            });

            it('keeps entity properties not provided in the changes object', () => {
                // { a: 5, b: 7 } plus { a: 5 } should be the first reference
                const isSameReference = before.user['admin-uuid'].groups[0] === after.user['admin-uuid'].groups[0];
                expect(isSameReference).toBe(true);
            });
        });

        describe('strictness', () => {
            const changes = {
                node: [
                    {
                        uuid: 'node-uuid',
                        language: 'en'
                        // version is missing
                    }
                ]
            };

            it('throws when missing uuid and strict = true', () => {
                const before = empty;
                function doMergeStrict() {
                    mergeEntityState(before, { node: [{ version: 'en' }] } as any, true);
                }
                expect(doMergeStrict).toThrow();
            });

            it('throws when missing uuid and strict = false', () => {
                const before = empty;
                function doMergeStrict() {
                    mergeEntityState(before, { node: [{ version: 'en' }] } as any, false);
                }
                expect(doMergeStrict).toThrow();
            });

            it('throws on incomplete discriminator and strict = true', () => {
                const before = empty;
                function doMergeStrict() {
                    mergeEntityState(before, changes, true);
                }
                expect(doMergeStrict).toThrow();
            });

            it('does not throw on incomplete discriminator and strict = false', () => {
                const before = empty;
                function doMergeStrict() {
                    mergeEntityState(before, changes, false);
                }
                expect(doMergeStrict).not.toThrow();
            });
        });

        describe('entity-specific merges', () => {
            it('adds a new node', () => {
                const before = empty;
                const after = mergeEntityState(before, {
                    node: [
                        {
                            uuid: 'node-uuid',
                            language: 'en',
                            version: '0.1'
                        }
                    ]
                });
                expect(after.node).toEqual({
                    'node-uuid': {
                        en: {
                            0.1: {
                                uuid: 'node-uuid',
                                language: 'en',
                                version: '0.1'
                            } as MeshNode
                        }
                    }
                });
            });

            it('modifies an existing node', () => {
                const before = {
                    ...empty,
                    node: {
                        'node-uuid': {
                            en: {
                                0.1: {
                                    uuid: 'node-uuid',
                                    language: 'en',
                                    version: '0.1',
                                    edited: 'yesterday'
                                } as MeshNode
                            }
                        }
                    }
                };
                const after = mergeEntityState(before, {
                    node: [
                        {
                            uuid: 'node-uuid',
                            language: 'en',
                            version: '0.1',
                            edited: 'today'
                        }
                    ]
                });
                expect(after.node).toEqual({
                    'node-uuid': {
                        en: {
                            0.1: {
                                uuid: 'node-uuid',
                                language: 'en',
                                version: '0.1',
                                edited: 'today'
                            } as MeshNode
                        }
                    }
                });
            });

            it('adds a new version of a node', () => {
                const before = {
                    ...empty,
                    node: {
                        'node-uuid': {
                            en: {
                                0.1: {
                                    uuid: 'node-uuid',
                                    language: 'en',
                                    version: '0.1',
                                    edited: 'yesterday'
                                } as MeshNode
                            }
                        }
                    }
                };
                const after = mergeEntityState(before, {
                    node: [
                        {
                            uuid: 'node-uuid',
                            language: 'en',
                            version: '0.2',
                            edited: 'today'
                        }
                    ]
                });
                expect(after.node).toEqual({
                    'node-uuid': {
                        en: {
                            0.1: {
                                uuid: 'node-uuid',
                                language: 'en',
                                version: '0.1',
                                edited: 'yesterday'
                            } as MeshNode,
                            0.2: {
                                uuid: 'node-uuid',
                                language: 'en',
                                version: '0.2',
                                edited: 'today'
                            } as MeshNode
                        }
                    }
                });
            });
        });
    });

    describe('getNestedEntity()', () => {
        const node1: any = { uuid: 'nodeUuid1', language: 'en', version: '0.1' };
        const node2: any = { uuid: 'nodeUuid1', language: 'en', version: '0.2' };
        const node3: any = { uuid: 'nodeUuid1', language: 'en', version: '2.5' };
        const node4: any = { uuid: 'nodeUuid1', language: 'de', version: '0.1' };
        const node5: any = { uuid: 'nodeUuid1', language: 'de', version: '1.1' };

        const state: EntityState = {
            group: {},
            microschema: {},
            node: {
                nodeUuid1: {
                    en: {
                        0.1: node1,
                        0.2: node2,
                        2.5: node3
                    },
                    de: {
                        0.1: node4,
                        1.1: node5
                    }
                }
            },
            project: {},
            schema: {},
            user: {},
            tag: {},
            tagFamily: {}
        };

        it('should return exact entity when all discriminators present in source', () => {
            const source = {
                uuid: 'nodeUuid1',
                language: 'de',
                version: '0.1'
            } as any;
            const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source);

            expect(result).toBe(node4);
        });

        it('should return most recent version when a version is not present in source', () => {
            const source = {
                uuid: 'nodeUuid1',
                language: 'en'
            } as any;
            const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source);

            expect(result).toBe(node3);
        });

        describe('language handling', () => {
            it('should return undefined if no language supplied', () => {
                const source = {
                    uuid: 'nodeUuid1'
                } as any;
                const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source);

                expect(result).toBeUndefined();
            });

            it('should return undefined if language string does not match any available', () => {
                const source = {
                    uuid: 'nodeUuid1',
                    language: 'bad'
                } as any;
                const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source);

                expect(result).toBeUndefined();
            });

            it('should accept array for language and use it as a fallback sequence', () => {
                const source = {
                    uuid: 'nodeUuid1'
                } as any;
                const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, [
                    'bad',
                    'de',
                    'en'
                ]);

                expect(result).toBe(node5);
            });

            it('language fallbacks take precedence over the language key in the source object', () => {
                const source = {
                    uuid: 'nodeUuid1',
                    language: 'en'
                } as any;
                const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, [
                    'bad',
                    'de',
                    'en'
                ]);

                expect(result).toBe(node5);
            });

            it('empty language fallbacks do not take precedence over the language key in the source object', () => {
                const source = {
                    uuid: 'nodeUuid1',
                    language: 'en'
                } as any;
                const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, []);

                expect(result).toBe(node3);
            });

            it('should return undefined if language fallback does not match any available', () => {
                const source = {
                    uuid: 'nodeUuid1'
                } as any;
                const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, ['bad', 'badder']);

                expect(result).toBeUndefined();
            });
        });
    });
});
