import { t } from 'testcafe';

export namespace assert {
    /**
     * Asserts that the condition is true for all members of the array.
     * @param actual
     * @param asserter
     */
    export async function forAll<T>(actual: T[], asserter: (item: T) => Promise<any>): Promise<any>;
    /**
     * Asserts that the condition is true for all values of the object.
     * @param actual
     * @param asserter
     */
    export async function forAll<T>(actual: T, asserter: (item: T[keyof T]) => Promise<any>): Promise<any>;
    export async function forAll(actual: any, asserter: (item: any) => Promise<any>) {
        const values = Object.keys(actual).map(key => actual[key]);
        for (const value of values) {
            await asserter(value);
        }
    }

    /**
     * Asserts that the value is empty. An empty value is either undefined, null, an empty array or an empty object.
     * @param actual
     * @param message
     */
    export async function isEmpty(actual: any, message?: string) {
        await t
            .expect(
                actual === undefined ||
                    actual === null ||
                    (Array.isArray(actual) && actual.length === 0) ||
                    (typeof actual === 'object' && Object.keys(actual).length === 0)
            )
            .ok(message || `Expected actual to be empty`);
    }

    /**
     * Fails the test.
     * @param message
     */
    export async function fail(message?: string) {
        await t.expect(false).ok(message || 'Test failed');
    }
}
