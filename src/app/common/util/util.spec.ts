import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';

import {
    concatUnique,
    filenameExtension,
    isEMeshNodeStatusString,
    parseNodeStatusFilterString,
    queryString,
    simpleDeepEquals,
    simpleMergeDeep
} from './util';

describe('Utility', () => {
    describe('Filename extension', () => {
        it('returns the extension with the dot', () => {
            expect(filenameExtension('file.jpg')).toBe('.jpg');
        });

        it('returns the last part if there is more then one dot', () => {
            expect(filenameExtension('util.spec.ts')).toBe('.ts');
        });

        it('returns an empty string if there is no dot', () => {
            expect(filenameExtension('util')).toBe('');
        });

        it('returns an empty string on an empty string', () => {
            expect(filenameExtension('')).toBe('');
        });
    });

    describe('query string', () => {
        it('returns the query string with ?', () => {
            const query = {
                a: 1,
                b: '2',
                c: '3'
            };
            expect(queryString(query)).toBe('?a=1&b=2&c=3');
        });

        it('returns an empty string if all entries are undefined or null', () => {
            const query = {
                a: undefined,
                b: null
            };
            expect(queryString(query)).toBe('');
        });

        it('returns an empty string on empty object', () => {
            const query = {};
            expect(queryString(query)).toBe('');
        });
    });

    describe('simpleDeepEquals()', () => {
        it('works with primitive values', () => {
            expect(simpleDeepEquals(1, 1)).toBe(true, '1, 1');
            expect(simpleDeepEquals(1, 2)).toBe(false, '1, 2');
            expect(simpleDeepEquals('foo', 'foo')).toBe(true, '"foo", "foo"');
            expect(simpleDeepEquals('foo', 'bar')).toBe(false, '"foo", "bar"');
            expect(simpleDeepEquals(true, true)).toBe(true, 'true, true');
            expect(simpleDeepEquals(true, false)).toBe(false, 'true, false');
        });

        it('works with 1 level deep objects', () => {
            expect(simpleDeepEquals({ foo: 1 }, { foo: 1 })).toBe(true);
            expect(simpleDeepEquals({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).toBe(true);
            expect(simpleDeepEquals({ foo: 1, bar: 2 }, { foo: 1, bar: 3 } as any)).toBe(false);
        });

        it('works with arrays of primitives', () => {
            expect(simpleDeepEquals([1, 2, 3], [1, 2, 3])).toBe(true);
            expect(simpleDeepEquals([1, 2, 3], [1, 1, 3])).toBe(false);
        });

        it('works with 2 level deep objects', () => {
            expect(simpleDeepEquals({ foo: { bar: true } }, { foo: { bar: true } })).toBe(true);
            expect(simpleDeepEquals({ foo: { bar: true } }, { foo: { bar: false } } as any)).toBe(false);
        });

        it('works with arrays of objects', () => {
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 2] } }, true])).toBe(true);
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 2] } }, false] as any)).toBe(
                false
            );
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 5] } }, true] as any)).toBe(
                false
            );
            expect(simpleDeepEquals([{ foo: { bar: [1, 2] } }, true], [{ foo: { bar: [1, 2, 3] } }, true])).toBe(false);
        });
    });

    describe('simpleMergeDeep()', () => {
        it('merges two simple objects', () => {
            const o1 = { foo: 1 };
            const o2 = { bar: 2 };
            expect(simpleMergeDeep(o1, o2)).toEqual({
                foo: 1,
                bar: 2
            });
        });

        it('merges three simple objects', () => {
            const o1 = { foo: 1 };
            const o2 = { bar: 2 };
            const o3 = { baz: 3 };
            expect(simpleMergeDeep(o1, o2, o3)).toEqual({
                foo: 1,
                bar: 2,
                baz: 3
            });
        });

        describe('deep objects', () => {
            const o1 = {
                user: {
                    name: 'Joe',
                    friends: [1, 2, 3]
                }
            };
            const o2 = {
                user: {
                    age: 18,
                    friends: [1, 2, 3, 4]
                },
                parent: {
                    name: 'june'
                }
            };

            it('merges deep objects', () => {
                expect(simpleMergeDeep(o1, o2)).toEqual({
                    user: {
                        name: 'Joe',
                        age: 18,
                        friends: [1, 2, 3, 4]
                    },
                    parent: {
                        name: 'june'
                    }
                });
            });

            it('does not re-use object or array references', () => {
                const result = simpleMergeDeep(o1, o2);

                expect(result.parent).not.toBe(o2.parent);
                expect(result.user.friends).not.toBe(o2.user.friends);
            });
        });
    });

    describe('concatUnique()', () => {
        it('works with two arrays', () => {
            expect(concatUnique([1, 2, 4, 6], [2, 4, 0, 7])).toEqual([1, 2, 4, 6, 0, 7]);
        });

        it('works with three arrays', () => {
            expect(concatUnique([1, 2], [2, 4], [9, 3, 1, 4])).toEqual([1, 2, 4, 9, 3]);
        });

        it('works with empty array', () => {
            expect(concatUnique([])).toEqual([]);
        });

        it('works with empty and non-empty arrays', () => {
            expect(concatUnique([4, 34], [], [], [5], [14, 4])).toEqual([4, 34, 5, 14]);
        });
    });

    describe('parseNodeStatusFilterString()', () => {
        it('removes strings that are not in EMeshNodeStatusStrings', () => {
            expect(
                parseNodeStatusFilterString(
                    `randomStateHopefullyNeverInEMeshNodeStatusStrings,${
                        EMeshNodeStatusStrings.DRAFT
                    },randomStateHopefullyNeverInEMeshNodeStatusStrings2`
                )
            ).toEqual([EMeshNodeStatusStrings.DRAFT]);
        });

        for (let i = 0; i < Object.values(EMeshNodeStatusStrings).length - 1; i++) {
            const nodeStatuses = Object.values(EMeshNodeStatusStrings);
            it(`keeps strings that are in EMeshNodeStatusStrings (e.g. ${nodeStatuses[i]} and ${
                nodeStatuses[i + 1]
            })`, () => {
                expect(parseNodeStatusFilterString(`${nodeStatuses[i]},${nodeStatuses[i + 1]}`)).toEqual([
                    nodeStatuses[i],
                    nodeStatuses[i + 1]
                ]);
            });
        }

        it('removes duplicates', () => {
            expect(
                parseNodeStatusFilterString(`${EMeshNodeStatusStrings.DRAFT},${EMeshNodeStatusStrings.DRAFT}`)
            ).toEqual([EMeshNodeStatusStrings.DRAFT]);
        });

        it('maps a node status string that does not contain any valid statuses to an array containing all statuses', () => {
            expect(parseNodeStatusFilterString('randomStateHopefullyNeverInEMeshNodeStatusStrings')).toEqual(
                Object.values(EMeshNodeStatusStrings)
            );
        });
    });

    describe('isEMeshNodeStatusString()', () => {
        it('returns "true" if string is MeshNodeStatusString', () => {
            expect(isEMeshNodeStatusString(EMeshNodeStatusStrings.DRAFT)).toEqual(true);
        });

        it('returns "true" if string is MeshNodeStatusString', () => {
            expect(isEMeshNodeStatusString('randomStateHopefullyNeverInEMeshNodeStatusStrings')).toEqual(false);
        });
    });
});
