import { NodeFieldType } from '../../../common/models/node.model';
import { SchemaField } from '../../../common/models/schema.model';

/**
 * An object path to a value contained in a MeshNode's fields.
 * E.g.
 * - ['firstName']                  = a top-level field named "firstName"
 * - ['addresses', 2]               = the third item in a list field named "addresses"
 * - ['locations', 0, 'longitude']  = the "longitude" field of a the first micronode in a list of micronodes named "locations"
 */
export type SchemaFieldPath = Array<string | number>;

/**
 * A callback function invoked by the onValueChange() method.
 */
export type ValueChangeCallback = (newValue: NodeFieldType, oldValue?: NodeFieldType) => void;

export type FormWidthChangeCallback = (widthInPixels: number) => void;

export interface MeshFieldControlApi {
    /**
     * The object path to this field in the schema.
     */
    path: SchemaFieldPath;
    /**
     * The field definition object as defined in the schema.
     */
    field: SchemaField;
    /**
     * Returns the current value of the field.
     */
    getValue: () => any;
    /**
     * The function used to send an updated value of a field back up to the FormGenerator.
     * By default, the path will be pre-configured and is not required, but can be specified to override
     * the pre-configured value. This is really intended to be used for container types i.e. list and
     * micronode.
     */
    setValue: (value: NodeFieldType, path?: SchemaFieldPath) => void;
    /**
     * Sets the validity of the control.
     */
    setValid: (isValid: boolean) => void;
    /**
     * Takes a callback function which will be invoked whenever the field value or the value of a
     * descendant field changes.
     */
    onValueChange: (callback: ValueChangeCallback) => void;
    /**
     * Sets the css width of the host component.
     */
    setWidth: (width: string) => void;
    /**
     * Sets the css height of the host component.
     */
    setHeight: (width: string) => void;
    /**
     * Takes a callback function which will be invoked whenever the width of the form changes.
     */
    onFormWidthChange: (callback: FormWidthChangeCallback) => void;
}
