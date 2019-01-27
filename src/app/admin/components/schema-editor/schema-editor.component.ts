import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Microschema } from '../../../common/models/microschema.model';
import { ListTypeFieldType, Schema, SchemaField, SchemaFieldType } from '../../../common/models/schema.model';
import { FieldSchemaFromServer, SchemaUpdateRequest } from '../../../common/models/server-models';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

/**
 * Schema Builder for UI-friendly assembly of a new schema at app route /admin/schemas/new
 */
@Component({
    selector: 'mesh-schema-editor',
    templateUrl: './schema-editor.component.html',
    styleUrls: ['./schema-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('statusAnim', [
            transition(':enter', [style({ opacity: 0 }), animate('0.2s', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('0.2s', style({ opacity: 0 }))])
        ]),
        trigger('ngForAnimParent', [transition(':enter, :leave', [query('@ngForAnimChild', [animateChild()])])]),
        trigger('ngForAnimChild', [
            transition('void => *', [
                style({
                    opacity: 0,
                    height: '0',
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0'
                }),
                animate(
                    '0.2s ease',
                    style({
                        opacity: 1,
                        height: '*',
                        'padding-top': '*',
                        'padding-bottom': '*',
                        'margin-top': '*',
                        'margin-bottom': '*'
                    })
                )
            ]),
            transition('* => void', [
                style({
                    opacity: 1,
                    height: '*',
                    'padding-top': '*',
                    'padding-bottom': '*',
                    'margin-top': '*',
                    'margin-bottom': '*'
                }),
                animate(
                    '0.2s ease',
                    style({
                        opacity: 0,
                        height: '0',
                        'padding-top': '0',
                        'padding-bottom': '0',
                        'margin-top': '0',
                        'margin-bottom': '0'
                    })
                )
            ])
        ])
    ]
})
export class SchemaEditorComponent implements OnInit, OnDestroy {
    // PROPERTIES //////////////////////////////////////////////////////////////////////////////

    /** Primary data object */
    get schema(): string {
        return this._schema && JSON.stringify(this._schema, undefined, 4);
    }
    @Input()
    set schema(value: string) {
        if (!value) {
            return;
        }
        this._schema = JSON.parse(value);
        // if formGroup initiated, fill it with provided data
        if (this.formGroup instanceof FormGroup) {
            this.formGroup.patchValue(this.schemaAsFormValue(this._schema));
        }
    }
    @Output() schemaChange = new EventEmitter<string>();
    protected _schema: SchemaUpdateRequest | Schema;

    /** Schema form */
    formGroup: FormGroup;

    /** Emitting on Create/Save */
    @Output() save = new EventEmitter<void>();

    /** All schemas of current Mesh instance */
    allSchemas$: Observable<Schema[]>;

    /** All microschemas of current Mesh instance */
    allMicroschemas$: Observable<Microschema[]>;

    /** Stored values of schema.fields[].allow */
    allowValues: Array<Set<string>> = [];

    /** Providing data for Schema Field List Type dropdown list */
    schemaFieldListTypes: Array<{ value: SchemaFieldType; label: string }> = [
        {
            value: 'boolean',
            label: 'Boolean'
        },
        {
            value: 'date',
            label: 'Date'
        },
        {
            value: 'micronode',
            label: 'Micronode'
        },
        {
            value: 'node',
            label: 'Node'
        },
        {
            value: 'number',
            label: 'Number'
        },
        {
            value: 'html',
            label: 'HTML'
        },
        {
            value: 'string',
            label: 'String'
        }
    ];

    /** Providing data for Schema Field Type dropdown list */
    schemaFieldTypes: Array<{ value: SchemaFieldType; label: string }> = [
        ...this.schemaFieldListTypes,
        {
            value: 'binary',
            label: 'Binary'
        },
        {
            value: 'list',
            label: 'List'
        }
    ];

    /** Convenience getter for form fields array */
    get schemaFields(): FormArray {
        return this.formGroup.get('fields') as FormArray;
    }

    /** Providing data for Schema displayFields dropdown list */
    displayFields: Array<{ value: string; label: string }> = [];

    /** Providing data for Schema segmentFields dropdown list */
    segmentFields: Array<{ value: string; label: string }> = [];

    /** Providing data for Schema urlFields dropdown list */
    urlFields: Array<{ value: string; label: string }> = [];

    /** Regular expression for text input validation checking for allowed characters */
    allowedChars = new RegExp(/^[a-zA-Z0-9_]+$/);

    private destroyed$ = new Subject<void>();

    // CONSTRUCTOR //////////////////////////////////////////////////////////////////////////////

    constructor(
        private entities: EntitiesService,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private formBuilder: FormBuilder
    ) {}

    // LIFECYCLE HOOKS //////////////////////////////////////////////////////////////////////////////

    ngOnInit(): void {
        this.loadComponentData();
        this.formGroupInit();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // MANAGE COMPONENT DATA //////////////////////////////////////////////////////////////////////////////

    /**
     * Trigger loading of required data and assign data streams to component properties
     */
    protected loadComponentData(): void {
        // assign data streams
        this.allSchemas$ = this.entities
            .selectAllSchemas()
            .map(schemas => schemas.sort((a, b) => a.name.localeCompare(b.name)));
        this.allMicroschemas$ = this.entities
            .selectAllMicroschemas()
            .map(microschemas => microschemas.sort((a, b) => a.name.localeCompare(b.name)));
        // request data
        this.adminSchemaEffects.loadSchemas();
        this.adminSchemaEffects.loadMicroschemas();
    }

    // MANAGE FORM //////////////////////////////////////////////////////////////////////////////

    /**
     * Returns modified schema to fit the form's data structure
     * @param schema of original state
     */
    schemaAsFormValue(schema: SchemaUpdateRequest | Schema): SchemaUpdateRequest | Schema {
        return (
            (schema as any).fields
                // as formGroup.field[].allow.control values are represented not as input value, empty it
                .map((field: SchemaField) => this.objectRemoveProperty(field, 'allow') as SchemaField)
        );
    }

    /**
     * Initialize form with empty/default data and listen to changes
     */
    protected formGroupInit(): void {
        // build form group from provided input data or empty
        this.formGroup = this.formBuilder.group({
            name: [this._schema.name || '', [Validators.required, Validators.pattern(this.allowedChars)]],
            container: [this._schema.container || false],
            description: [this._schema.description || ''],
            displayField: [this._schema.displayField || ''],
            segmentField: [this._schema.segmentField || ''],
            urlFields: [this._schema.urlFields || []],
            fields: this.formBuilder.array(
                this._schema.fields
                    ? this.createFieldsFromData(this._schema.fields as SchemaField[])
                    : [this.createNewField()]
            )
        });

        // if init value has been provided, fill related data properties
        if (this._schema && this._schema.fields instanceof Array && this._schema.fields.length > 0) {
            (this._schema.fields as SchemaField[]).forEach(field => {
                this.displayFields.push({ value: field.name, label: field.name });
                this.segmentFields.push({ value: field.name, label: field.name });
            });
        }

        // listen to form changes
        this.formGroup.valueChanges
            .distinctUntilChanged()
            .takeUntil(this.destroyed$)
            .subscribe((value: any) => {
                // reset data
                this.displayFields = [];
                this.segmentFields = [];

                // assign form data to component data
                this._schema = {
                    name: value.name,
                    ...(value.container && ({ container: value.container } as any)),
                    ...(value.description.length > 0 && ({ description: value.description } as any)),
                    ...(value.displayField.length > 0 && ({ displayField: value.displayField } as any)),
                    ...(value.segmentField.length > 0 && ({ segmentField: value.segmentField } as any)),
                    ...(value.urlFields instanceof Array &&
                        value.urlFields.length > 0 &&
                        ({ urlFields: value.urlFields } as any)),
                    fields: value.fields.map((field: any, index: number) => {
                        const schemaField: FieldSchemaFromServer = {
                            name: field.name,
                            type: field.type,
                            ...(field.label.length > 0 && ({ label: field.label } as any)),
                            ...(field.required && ({ required: field.required } as any)),
                            ...(field.type !== 'list' ||
                                (field.listType.length > 0 &&
                                    ({ listType: field.listType as ListTypeFieldType } as any)))
                        };

                        // if not of type list anymore, clean up
                        if (field.type !== 'list') {
                            this.propertyPurge(field, index, 'listType');
                        }

                        // if list types has changed, clear up to prevent wrong form contents
                        if (
                            (this._schema &&
                                this._schema.fields &&
                                this._schema.fields[index] &&
                                this._schema.fields[index].type &&
                                this._schema.fields[index].type !== field.type) ||
                            (this._schema &&
                                this._schema.fields &&
                                this._schema.fields[index] &&
                                this._schema.fields[index].listType &&
                                this._schema.fields[index].listType !== field.listType)
                        ) {
                            this.allowValuesClearAt(index);
                            // this.propertyPurge(field, index, 'allow');
                        }

                        // if of type node or micronode, assign values
                        if (
                            field.type === 'node' ||
                            field.listType === 'node' ||
                            field.type === 'micronode' ||
                            field.listType === 'micronode'
                        ) {
                            console.log('!!! NOES:', Array.from(this.allowValues[index]));
                            // if entries in allow, assign them to data object but remove from form
                            if (Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                            }
                        }

                        // if of type string, trigger search bar functionality
                        if (field.type === 'string' || field.listType === 'string') {
                            this.allowValuesOnStringInputChangeAt(index);

                            // if entries in allow, assign them to data object but remove from form
                            if (Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                            }
                        }

                        // fill data for dropdown-inputs
                        if (field.name) {
                            this.displayFields.push({ value: field.name, label: field.name });
                            this.segmentFields.push({ value: field.name, label: field.name });
                        }

                        // EXTENDED VALIDATION LOGIC
                        this.fieldHasDuplicateValue(index, 'name');

                        return schemaField;
                    })
                };
                this.schemaChange.emit(JSON.stringify(this._schema, undefined, 4));
            });
    }

    formGroupIsValid(): boolean {
        return this.formGroup.valid;
    }

    hasNamedFields(): boolean {
        return this.displayFields.length > 0;
    }

    hasStringFields(): boolean {
        return this.schemaFields.value.filter((field: SchemaField) => field.type === 'string') > 0 || false;
    }

    // MANAGE SCHEMA.FIELD[] ENTRIES //////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize a new FormGroup instance and its related data analog to schema.field type
     */
    protected createNewField(): FormGroup {
        this.allowValues.push(new Set<string>());
        const test = this.formBuilder.group({
            name: ['', [Validators.required, Validators.pattern(this.allowedChars)]],
            label: [''],
            type: ['micronode', Validators.required],
            required: [false],
            listType: [''],
            allow: ['']
        });
        return test;
    }

    /**
     * Creating a new form group specifically initiated for specified index
     * @param index pointing at array position
     */
    protected createNewFieldForIndex(index: number): FormGroup {
        this.allowValues.splice(index, 0, new Set<string>());
        return this.createNewField();
    }

    protected createFieldFromData(field: SchemaField): FormGroup {
        if (field.allow instanceof Array && field.allow.length > 0) {
            this.allowValues.push(new Set<string>(field.allow));
        } else {
            this.allowValues.push(new Set<string>([]));
        }
        return this.formBuilder.group({
            name: [field.name || '', [Validators.required, Validators.pattern(this.allowedChars)]],
            label: [field.label || ''],
            type: [field.type || '', Validators.required],
            required: [field.required || false],
            listType: [field.listType || ''],
            allow: ['']
        });
    }

    protected createFieldsFromData(fields: SchemaField[]): FormGroup[] {
        return fields.map(field => this.createFieldFromData(field));
    }

    fieldAdd(): void {
        this.schemaFields.push(this.createNewField());
    }

    /**
     * Insert new field form at specified index
     * @param index form array index
     */
    fieldAddAt(index: number): void {
        this.schemaFields.insert(index, this.createNewFieldForIndex(index));
    }

    fieldRemoveAt(index: number): void {
        this.schemaFields.removeAt(index);
    }

    fieldRemoveLast(): void {
        this.fieldRemoveAt(this.schemaFields.value.length - 1);
    }

    fieldHasDuplicateValue(index: number, formControlName: 'name' | 'label'): boolean {
        const fields = this.schemaFields.value as SchemaField[];
        const ownValue = fields[index][formControlName];
        // if not existing, return default
        if (!ownValue) {
            return false;
        }
        // iterate over all existing fields
        const isDuplicate =
            fields.filter((field, fieldIndex) => {
                // if own index, skip
                if (fieldIndex === index) {
                    return;
                }
                // check values
                return field[formControlName] && field[formControlName]!.toLocaleLowerCase() === ownValue.toLowerCase();
            }).length > 0;
        // notify formControl in formGroup of this extended validation logic
        const control = this.schemaFields.controls[index].get(formControlName) as AbstractControl | any;
        if (isDuplicate === true) {
            // assign new error to field errors
            control!.setErrors({ ...control!.errors, ...{ duplicate: true } });
        } else {
            // if exist, create new error object without duplicate error
            const errors =
                control!.errors && (this.objectRemoveProperty(control!.errors, 'duplicate') as ValidationErrors | null);
            control!.setErrors(errors);
        }
        return isDuplicate;
    }

    getFormControlErrorOfType(formControlName: keyof Schema, errorType: TSchemaEditorErrors): boolean {
        return this.formGroup.get(formControlName)!.hasError(errorType);
    }

    getFormControlInArrayErrorOfType(
        index: number,
        formControlName: keyof SchemaField,
        errorType: TSchemaEditorErrors
    ): boolean {
        return this.schemaFields.controls[index].get(formControlName)!.hasError(errorType);
    }

    // MANAGE SCHEMA.FIELD[].ALLOW VALUES //////////////////////////////////////////////////////////////////////////////

    allowValueGetAt(index: number): string[] {
        return Array.from(this.allowValues[index]);
    }

    /**
     * Reset the entire allowValues Set at index
     * @param index of schmea.fields[]
     * @param values replacing previous values
     */
    allowValueSetAt(index: number, values: string[]): void {
        console.log('!!! allowValueSetAt:', values);
        // update allowed data
        this.allowValues[index] = new Set<string>(values);
        // update form
        this.formGroup.updateValueAndValidity();
    }

    /**
     * add value to schema.fields[] allow[]
     * @param index of schema.fields[]
     * @param value string to be added
     * */
    allowValueAddAt(index: number, value: string): void {
        // update allowed data
        this.allowValues[index].add(value);
        // update form
        this.formGroup.updateValueAndValidity();
    }

    /**
     * remove value from schema.fields[] allow[]
     * @param index of schema.fields[]
     * @param value string to be removed
     * */
    allowValueRemoveAt(index: number, value: string): void {
        // update allowed data
        this.allowValues[index].delete(value);
        // update form
        this.formGroup.updateValueAndValidity();
    }

    /**
     * change value of schema.fields[] allow[]
     * @param index of schema.fields[]
     * @param value string to be changed
     * @param action indicator: true = add, false = remove
     */
    allowValuesChangeAt(index: number, value: string, action: boolean): void {
        if (action === true) {
            this.allowValueAddAt(index, value);
        } else {
            this.allowValueRemoveAt(index, value);
        }
    }

    allowValueRemoveLastAt(index: number): void {
        // if input bar has text, which is not yet converted to chip, don't redirect backspace key
        const form = this.formGroup.value as Schema;
        const inputText = form.fields && form.fields[index] && form.fields[index].allow;
        if (inputText && inputText.length) {
            return;
        }

        const allowValues = this.allowValues[index];
        if (!allowValues) {
            return;
        }
        const lastValue = Array.from(allowValues).pop();
        if (!lastValue) {
            return;
        }
        this.allowValueRemoveAt(index, lastValue);
    }

    /**
     * Remove all entries from allowed string values of schema field
     * @param index of field to be cleared
     */
    allowValuesClearAt(index: number): void {
        // clear data
        this.allowValues[index] = new Set();
    }

    allowValuesContainsAt(index: number, value: string): boolean {
        return this.allowValues[index].has(value);
    }

    allowValueOnStringInputAddAt(index: number, value: any): void {
        if (typeof value === 'string' && value !== '') {
            // as formGroup.field[].allow.control values are represented not as input value, empty it
            if (this.schemaFields.controls[index].get('allow')) {
                this.schemaFields.controls[index].get('allow')!.setValue('', { emitEvent: false });
            }
            this.allowValues[index].add(value.replace(new RegExp(/\W/, 'g'), ''));
        }
    }

    allowValuesOnStringInputChangeAt(index: number): void {
        if (!this.schemaFields.controls[index].get('allow')) {
            return;
        }
        const allow = this.schemaFields.controls[index].get('allow')!.value;
        // if input value is seperated by space or comma, then add as chip
        if (new RegExp(/\w+\W/, 'g').test(allow)) {
            this.allowValueOnStringInputAddAt(index, allow);
        }
    }

    // SCHEMA MAIN BUTTON //////////////////////////////////////////////////////////////////////////////

    schemaCreate(): void {
        console.log('!!! schemaCreate()');
        this.save.emit();
    }

    schemaDelete(): void {
        console.log('!!! schemaDelete()');
    }

    // PRIVATE METHODS //////////////////////////////////////////////////////////////////////////////

    /**
     * Returns an object without the defined property
     * @param object to be cleared of defined property-value pair
     * @param propertyKey of property to be removed
     * @returns cleared object or null if object does not have any properties
     */
    private objectRemoveProperty(object: { [key: string]: any }, propertyKey: string): { [key: string]: any } | null {
        const propertyKeys = Object.getOwnPropertyNames(object);
        return propertyKeys.length > 0
            ? (propertyKeys
                  .map(key => key !== propertyKey && { [key]: object[key] })
                  .reduce((objects: object, object: object) => ({ ...objects, object })) as any)
            : null;
    }

    /**
     * Remove property from data structure entirely
     * @param field current field containing property to be deleted
     * @param index of field containing the property to be deleted
     * @param property key to be deleted
     */
    private propertyPurge(field: SchemaField, index: number, property: keyof SchemaField): void {
        if (field[property]) {
            delete field[property];
        }

        if (!this._schema) {
            return;
        }
        const fieldToDelete = (this._schema.fields && (this._schema.fields[index] as SchemaField)) || null;
        if (fieldToDelete && fieldToDelete[property]) {
            delete fieldToDelete[property];
        }
    }
}

export type TSchemaEditorErrors = 'required' | 'pattern' | 'duplicate';
