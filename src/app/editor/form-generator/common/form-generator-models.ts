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
 * The function used to send an updated value of a field back up to the FormGenerator.
 */
export type UpdateFunction = {
    (path: SchemaFieldPath, value: NodeFieldType): void;
};

/**
 * All UI components for the various field types (string, list, date etc.) must implement this interface.
 * Custom microschema components should also use this interface in order to communicate back to this app.
 */
export interface MeshFieldComponent {
    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void;
    valueChange(value: NodeFieldType): void;
}
