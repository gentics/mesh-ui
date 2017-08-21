import { getNestedEntity, mergeEntityState } from './entity-state-actions';
import { EntityState } from '../models/entity-state.model';
import { User } from '../../common/models/user.model';
import { MeshNode } from '../../common/models/node.model';

describe('EntityStateActions', () => {

    describe('mergeEntityState()', () => {

        const empty: EntityState = {
            microschema: {},
            node: {},
            project: {},
            schema: {},
            user: {}
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
                user: [{
                    uuid: 'admin-uuid',
                    username: 'admin'
                }]
            });

            expect(before).toEqual({
                microschema: {},
                node: {},
                project: {},
                schema: {},
                user: {}
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
                user: [{
                    uuid: 'admin-uuid',
                    username: 'admin'
                }]
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
                    user: [{
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
                    }]
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
                    mergeEntityState(before, { node: [{ version: 'en' }] }, true);
                }
                expect(doMergeStrict).toThrow();
            });

            it('throws when missing uuid and strict = false', () => {
                const before = empty;
                function doMergeStrict() {
                    mergeEntityState(before, { node: [{ version: 'en' }] }, false);
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
                        }}
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
                        }}
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
            user: {}
        };

        it('should return exact entity when all discriminators present in source', () => {
            const source = {
                uuid: 'nodeUuid1',
                language: 'de',
                version: '0.1'
            } as any;
            const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, 'en');

            expect(result).toBe(node4);
        });

        it('should return most recent version when a version is not present in source', () => {
            const source = {
                uuid: 'nodeUuid1',
                language: 'en'
            } as any;
            const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, 'en');

            expect(result).toBe(node3);
        });

        it('should return most recent version of fallback language when no language or version present in source', () => {
            const source = {
                uuid: 'nodeUuid1'
            } as any;
            const result = getNestedEntity(state.node, ['uuid', 'language', 'version'], source, 'de');

            expect(result).toBe(node5);
        });
    });
});
