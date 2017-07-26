import { mergeEntityState } from './entity-state-actions';
import { EntityState } from '../models/entity-state.model';
import { User } from '../../common/models/user.model';

describe('EntityStateActions', () => {

    describe('mergeEntityState()', () => {

        const empty: EntityState = {
            node: {},
            project: {},
            schema: {},
            user: {},
            microschema: {}
        };

        it('adds new entities to the output hash', () => {
            const before = empty;
            const after = mergeEntityState(before, {
                user: {
                    'admin-uuid': {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    }
                }
            });

            expect(after).not.toBe(before);
            expect(after).not.toEqual(before);
            expect(after.user).toEqual({
                'admin-uuid': {
                    uuid: 'admin-uuid',
                    username: 'admin'
                } as Partial<User> as User
            });
        });

        it('does not change the old state', () => {
            const before = empty;
            const after = mergeEntityState(before, {
                user: {
                    'admin-uuid': {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    }
                }
            });

            expect(before).toEqual({
                node: {},
                project: {},
                schema: {},
                user: {},
                microschema: {}
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
                user: {
                    'admin-uuid': {
                        uuid: 'admin-uuid',
                        username: 'admin'
                    }
                }
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
                    user: {
                        'admin-uuid': {
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
                    }
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

    });

});
