import { FormControl } from '@angular/forms';

import {
    BinaryField,
    FieldMap,
    ListNodeFieldType,
    MeshNode,
    MicronodeFieldMap,
    MicronodeFieldType,
    NodeFieldType
} from '../models/node.model';
import { FieldMapFromServer, GraphQLResponse } from '../models/server-models';

type Supplier<T> = () => T;

// Pure functions for utility

/**
 * Retrieves all values of an object as an array.
 * @param object Any object
 */
export function hashValues<T>(object: { [key: string]: T }): T[] {
    return Object.keys(object).map(key => object[key]);
}

/**
 * Checks if the provided field is an image field.
 */
export function isImageField(field: BinaryField): boolean {
    return field && field.mimeType.startsWith('image/');
}

/**
 * Checks if a value is not null or undefined.
 * @example
 *     appState.select(state => state.possiblyUndefinedValue)
 *         .filter(notNullOrUndefined)
 */
export function notNullOrUndefined<T extends string | number | boolean | object>(
    input: T | null | undefined
): input is T {
    return input != null;
}

/**
 * Checks if all values of an array are equal (by reference).
 * @example
 *     appState.select(state => state.possiblyUndefinedValue)
 *         .distinctUntilChanged(arrayContentsEqual)
 */
export function arrayContentsEqual<T>(a: T[], b: T[]): boolean {
    return a === b || (a && b && a.length === b.length && a.every((value, index) => b[index] === value));
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
    let qs = Object.keys(obj)
        .reduce<string[]>((query, key) => {
            const val = obj[key];
            if (val !== undefined && val !== null) {
                query.push(`${key}=${val}`);
            }
            return query;
        }, [])
        .join('&');

    if (qs.length > 0) {
        qs = '?' + qs;
    }
    return qs;
}

/**
 * Concatenates two or more arrays and de-duplicates and duplicate values.
 *
 * @example
 * concatUnique([1, 2, 4, 6], [2, 4, 0, 7]);
 * // => [1, 2, 4, 6, 0, 7]
 */
export function concatUnique<T>(first: T[], ...rest: T[][]): T[] {
    const all = [first, ...rest].reduce((acc, curr) => acc.concat(curr), []);
    return Array.from(new Set(all));
}

/**
 * Creates an object out of an array, which has elements with uuids. These uuids are used
 * for the keys of the object.
 * This is useful for transforming a list response from mesh to a format suitable to the state.
 */
export function uuidHash<T extends { uuid: string }>(elements: T[]): { [uuid: string]: T } {
    return elements.reduce(
        (hash, element) => {
            hash[element.uuid] = element;
            return hash;
        },
        {} as { [uuid: string]: T }
    );
}

export function noop() {}
export function id<T>(obj: T): T {
    return obj;
}

export type Primitive = string | number | boolean;
export interface SimpleObject {
    [key: string]: SimpleObject | Primitive | SimpleArray;
}
export type SimpleArray = Array<SimpleObject | Primitive>;
export type SimpleDeepEqualsType =
    | Primitive
    | SimpleObject
    | SimpleArray
    | NodeFieldType
    | ListNodeFieldType
    | MicronodeFieldType
    | MicronodeFieldMap;

/**
 * An simple object equality function designed for primitives (string, number, boolean), plain objects, arrays, or any combination thereof.
 */
export function simpleDeepEquals<T extends SimpleDeepEqualsType>(o1?: T, o2?: T): boolean {
    if (isPrimitiveValue(o1) || isPrimitiveValue(o2)) {
        return o1 === o2;
    }

    if (!o1 || !o2) {
        return o1 === o2;
    }

    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let i = keys1.length - 1; i >= 0; i--) {
        const key = keys1[i] as keyof SimpleDeepEqualsType;
        if (!simpleDeepEquals(o1[key], o2[key])) {
            return false;
        }
    }

    return true;
}

function isPrimitiveValue(arg: any): boolean {
    return typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean' || arg === null;
}

function isObject(item: any): item is object {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects. Objects should be simple (bags key-values or arrays) - no circular references or functions, class instances etc.
 * Array values are overwritten rather than merged.
 * Based on: https://stackoverflow.com/a/34749873/772859
 */
export function simpleMergeDeep(target: { [key: string]: any }, ...sources: { [key: string]: any }[]): any {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!(target as any)[key]) {
                    Object.assign(target, { [key]: {} });
                }
                simpleMergeDeep((target as any)[key], source[key]);
            } else {
                const value = Array.isArray(source[key]) ? source[key].slice(0) : source[key];
                Object.assign(target, { [key]: value });
            }
        }
    }

    return simpleMergeDeep(target, ...sources);
}

/**
 * Clone a simple object (no functions, no circular references, no class instances)
 *
 * Apparently the fastest way to do this in JS, since the JSON methods are implemented in
 * native code and will be faster than any recursive JS-based approach. See https://stackoverflow.com/a/5344074/772859
 */
export function simpleCloneDeep<T>(target: T): T {
    return JSON.parse(JSON.stringify(target));
}

/**
 * Filter all the binary fields from the node
 */
export function getMeshNodeBinaryFields(node: MeshNode): FieldMap {
    if (!node.fields) {
        return {} as FieldMapFromServer;
    }

    return Object.keys(node.fields).reduce(
        (fields, key) => {
            const field = node.fields[key];
            if (field && (field.file && field.file instanceof File) === true) {
                fields[key] = field;
            }
            return fields;
        },
        {} as FieldMap
    );
}

export function getMeshNodeNonBinaryFields(node: MeshNode): FieldMap {
    const binaryFields = getMeshNodeBinaryFields(node);
    return Object.keys(node.fields).reduce(
        (nonBinaryFields, key) => {
            if (
                binaryFields[key] === undefined ||
                // A binary field should be included if it should be deleted
                node.fields[key] === null
            ) {
                nonBinaryFields[key] = stripNulls(node.fields[key]);
            }
            return nonBinaryFields;
        },
        {} as FieldMap
    );
}

export function stripNulls<T>(arr: T): T {
    // if it's array, delete all the nulls and return array without nulls
    // if it's not array, just return it
    if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == null) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    } else {
        return arr;
    }
}

export function stringToColor(input: string): string {
    const safeColors = [
        '#6534ff',
        '#80cbc4',
        '#f2b632',
        '#e6af4b',
        '#bcd5d1',
        '#00acc1',
        '#ba9077',
        '#9068be',
        '#9590a2',
        '#bccbde',
        '#daad86',
        '#b3c2bf',
        '#b56969',
        '#9fa8a3',
        '#676664',
        '#677077',
        '#c9d8c5',
        '#e05038',
        '#757575',
        '#b5a397',
        '#6ed3cf',
        '#7095a5',
        '#729f98',
        '#334431',
        '#00bfa5',
        '#a8b6bf',
        '#173e43',
        '#2979ff',
        '#98dafc',
        '#c7ad88',
        '#607D8B',
        '#c9c9c9',
        '#64706c',
        '#b5b5b7',
        '#b0a18e',
        '#FBC02D',
        '#c7a693',
        '#62bcfa',
        '#667467',
        '#c5d5cb',
        '#5a5c51',
        '#e62739',
        '#3fb0ac',
        '#aa863a',
        '#22264b',
        '#283018'
    ];
    const value = input.split('').reduce((prev, curr, index) => {
        return prev + Math.round(curr.charCodeAt(0) * Math.log(index + 2));
    }, 0);
    return safeColors[value % safeColors.length];
}

/**
 * Executes functions that return promises one at a time
 * @param promiseSuppliers Functions that return promises
 * @returns An array of all promise results
 */
export async function promiseConcat<T>(promiseSuppliers: Supplier<T>[]): Promise<T[]> {
    const results: T[] = [];
    for (const supplier of promiseSuppliers) {
        results.push(await supplier());
    }
    return results;
}

/**
 * Extracts the data property from a GraphQl response.
 * Throws an error if the error property is present.
 */
export function extractGraphQlResponse(response: GraphQLResponse): any {
    if (response.errors) {
        throw new Error(JSON.stringify(response, undefined, 2));
    } else {
        return response.data;
    }
}

/**
 * Creates an object with an entry for every item in the array.
 *
 * @param keyMapper A function that retrieves the key of the entry from an item
 * @param valueMapper A function that retrieves the value of the entry from an item
 * @param array The array to create the object of
 */
export function toObject<T, V>(
    keyMapper: (item: T) => string,
    valueMapper: (item: T) => V,
    array: T[]
): { [key: string]: V } {
    const obj: { [key: string]: V } = {};
    for (const item of array) {
        obj[keyMapper(item)] = valueMapper(item);
    }
    return obj;
}

/**
 * @description Checks input value to be a human-readable string (blankspaces only not allowed)
 * @param value to be examined if is human-readable string
 * */
export function isValidString(value: string | any) {
    if (value && typeof value === 'string' && value !== '' && new RegExp(/^\s+$/).test(value) === false) {
        return true;
    } else {
        return false;
    }
}

export function matchOtherValidator(otherControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {
        if (!control.parent) {
            return null;
        }

        // Initializing the validator.
        if (!thisControl) {
            thisControl = control;
            otherControl = control.parent.get(otherControlName) as FormControl;
            if (!otherControl) {
                throw new Error('matchOtherValidator(): other control is not found in parent group');
            }
            otherControl.valueChanges.subscribe(() => {
                thisControl.updateValueAndValidity();
            });
        }

        if (!otherControl) {
            return null;
        }

        if (otherControl.value !== thisControl.value) {
            return {
                matchOther: true
            };
        }

        return null;
    };
}
