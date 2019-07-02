import { ErrorCodeHash } from './form-generator-models';

export type ErrorCode = 'required' | 'min_value' | 'max_value' | 'number';

/**
 * Given a FormErrors key, returns a hash which can be passed directly to the
 * setError() method of a field control to set the error state.
 */
export function errorHashFor(key: ErrorCode, invalid: boolean = true): ErrorCodeHash {
    const value = invalid ? `editor.error_${key}` : false;
    return { [key]: value };
}
