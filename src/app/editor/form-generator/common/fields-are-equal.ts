import { NodeFieldMicronode, NodeFieldType } from '../../../common/models/node.model';
import { simpleDeepEquals } from '../../../common/util/util';

/**
 * When comparing two node fields, we use the simpleDeepEquals function except in the case of a
 * micronode field, which has a UUID which can change even when the contents of its fields (the
 * part we care about) are equal.
 */
export function fieldsAreEqual<T extends NodeFieldType>(initial?: T, current?: T): boolean {
    if (isMicronode(initial) && isMicronode(current)) {
        return simpleDeepEquals(initial.fields, current.fields);
    } else {
        return simpleDeepEquals(initial, current);
    }
}

/**
 * Returns true if the object has the shape of a micronode field.
 */
export function isMicronode(field?: NodeFieldType): field is NodeFieldMicronode {
    if (!field) {
        return false;
    }
    return field.hasOwnProperty('uuid') &&
        field.hasOwnProperty('microschema') &&
        field.hasOwnProperty('fields');
}
