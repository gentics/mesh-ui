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
 * Returns the extension of a filename.
 */
export function filenameExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
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
        let val = obj[key];
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
