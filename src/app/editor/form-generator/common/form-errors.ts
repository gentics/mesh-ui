import { ErrorCodeHash } from './form-generator-models';

// TODO: replace with string enum once we are on TS 2.4+
export const ErrorCode = {
    REQUIRED: 'required' as 'REQUIRED',
    MIN_VALUE: 'min_value' as 'MIN_VALUE',
    MAX_VALUE: 'max_value' as 'MAX_VALUE',
};

/**
 * Given a FormErrors key, returns a hash which can be passed directly to the
 * setError() method of a field control to set the error state.
 */
export function errorHashFor(key: keyof typeof ErrorCode, invalid: boolean = true): ErrorCodeHash {
    const value = invalid ? `editor.error_${key}` : false;
    return { [key]: value };
}
