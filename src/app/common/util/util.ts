import { NodeFieldBinary } from '../models/node.model';

// Pure functions for utility

/**
 * Retrieves all values of an object as an array.
 * @param object Any object
 */
export function hashValues<T>(object: { [key: string]: T } | { [key: number]: T }): T[] {
    return Object.keys(object).map(key => object[key]);
}

/**
 * Checks if the provided field is an image field.
 */
export function isImageField(field: NodeFieldBinary): boolean {
    return field && field.mimeType.startsWith('image/');
}

/**
 * Checks if a value is not null or undefined.
 * @example
 *     appState.select(state => state.possiblyUndefinedValue)
 *         .filter(notNullOrUndefined)
 */
export function notNullOrUndefined<T extends string | number | boolean | object>(input: T | null | undefined): input is T;
export function notNullOrUndefined(input: boolean[]): input is boolean[];
export function notNullOrUndefined(input: number[]): input is number[];
export function notNullOrUndefined(input: string[]): input is string[];
export function notNullOrUndefined(input: any): boolean {
    return input != null;
}

/**
 * Checks if all values of an array are equal (by reference).
 * @example
 *     appState.select(state => state.possiblyUndefinedValue)
 *         .distinctUntilChanged(arrayContentsEqual)
 */
export function arrayContentsEqual<T>(a: T[], b: T[]): boolean {
    return a === b || a && b && a.length === b.length && a.every((value, index) => b[index] === value);
}


/**
 * Returns the extension of a filename.
 */
export function filenameExtension(filename: string): string {
    const index = filename.lastIndexOf('.');
    if (index < 0) {
        return '';
    } else {
        return filename.substring(index);
    }
}

/**
 * Creates an query string from the provided object.
 * Uses all properties from the object that are not undefined or null.
 * This will prepend an '?' if at least one valid property is found.
 *
 * TODO Add url encode or use angular URLSearchParams
 */
export function queryString(obj: any): string {
    let qs = Object.keys(obj).reduce<string[]>((query, key) => {
        const val = obj[key];
        if (val !== undefined && val !== null) {
            query.push(`${key}=${val}`);
        }
        return query;
    }, []).join('&');

    if (qs.length > 0) {
        qs = '?' + qs;
    }
    return qs;
}

/**
 * Creates an object out of an array, which has elements with uuids. These uuids are used
 * for the keys of the object.
 * This is useful for transforming a list response from mesh to a format suitable to the state.
 */
export function uuidHash<T extends { uuid: string }>(elements: T[]): {[uuid: string]: T} {
    return elements.reduce((hash, element) => {
        hash[element.uuid] = element;
        return hash;
    }, {});
}

export function noop() {}
