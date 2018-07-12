import { MeshNode, NodeFieldType } from '../../common/models/node.model';
import { SchemaField } from '../../common/models/schema.model';
import { UILanguage } from '../../core/providers/i18n/i18n.service';
import { NodeBrowserOptions } from '../../shared/components/node-browser/interfaces';

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

export type NodeChangeCallback = (path: SchemaFieldPath, value: any, node: MeshNode) => void;

export type GetNodeValueReturnType = MeshNode | string | number | any[] | object | undefined;
export type GetNodeValueFunction = (path?: SchemaFieldPath) => GetNodeValueReturnType;

export interface ErrorCodeHash {
    [errorCode: string]: string | false;
}
type SetErrorFunction = (errorCode: string | ErrorCodeHash, errorMessage?: string | false) => void;

export interface MeshControlErrors {
    [errorCode: string]: string;
}

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
     * Whether this field should be read only
     */
    readOnly: boolean;
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
    setValue: (value: NodeFieldType | null, path?: SchemaFieldPath) => void;
    /**
     * Sets the error state of the field.
     */
    setError: SetErrorFunction;
    /**
     * Takes a callback function which will be invoked whenever the field value or the value of a
     * descendant field changes.
     */
    onValueChange: (callback: ValueChangeCallback) => void;
    /**
     * Returns the current value of the node to which the field belongs.
     */
    getNodeValue: GetNodeValueFunction;
    /**
     * Takes a callback which will be invoked whenever any field's value in the node changes.
     */
    onNodeChange: (callback: NodeChangeCallback) => void;
    /**
     * Sets the css width of the host component.
     */
    setWidth: (width: string) => void;
    /**
     * Sets the css height of the host component.
     */
    setHeight: (width: string) => void;
    /**
     * When true, sets the `focus` class on the host component. Useful for simulating a focused
     * input label in custom controls.
     */
    setFocus: (value: boolean) => void;
    /**
     * Takes a callback which will be invoked whenever the custom control's label is clicked.
     * Intended to be used to focus the custom control.
     */
    onLabelClick: (callback: () => void) => void;
    /**
     * Takes a callback function which will be invoked whenever the width of the form changes.
     */
    onFormWidthChange: (callback: FormWidthChangeCallback) => void;
    /**
     * Appends a style block containing default css styles to the parentElement. These styles
     * allow custom controls to fit the look and feel of the built-in controls.
     */
    appendDefaultStyles: (parentElement: HTMLElement) => void;
    /**
     * The current UI language.
     */
    uiLanguage: UILanguage | undefined;

    /**
     * Opens the node browser. Returns a promise that resolves with the uuids of the chosen
     * nodes when the user has closed the dialog.
     */
    openNodeBrowser(options: NodeBrowserOptions): Promise<string[]>;
}
