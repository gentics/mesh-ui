import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ADMIN_USER_NAME } from '../../../common/constants';
import { Microschema } from '../../../common/models/microschema.model';
import { Schema, SchemaField, SchemaFieldType } from '../../../common/models/schema.model';
import { FieldSchemaFromServer, SchemaResponse, SchemaUpdateRequest } from '../../../common/models/server-models';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
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
    get schemaJson(): string {
        return this._schemaJson && JSON.stringify(this._schemaJson, undefined, 4);
    }
    @Input()
    set schemaJson(value: string) {
        if (!value) {
            return;
        }
        this._schemaJson = JSON.parse(value);
        // if formGroup initiated, fill it with provided data
        if (this.formGroup instanceof FormGroup) {
            this.formGroup.patchValue(this.schemaAsFormValue(this._schemaJson));
        }
    }
    @Output() schemaJsonChange = new EventEmitter<string>();
    protected _schemaJson: SchemaUpdateRequest | Schema;

    /**
     * Non-editable schema data from server providing permission data
     */
    @Input() schema: SchemaResponse;

    /** Schema form */
    formGroup: FormGroup;

    /** Emitting on Create/Save Schema */
    @Output() save = new EventEmitter<void>();

    /** Emitting on Delete Schema */
    @Output() delete = new EventEmitter<void>();

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
    ].sort((a, b) => a.value.localeCompare(b.value)) as Array<{
        value: SchemaFieldType;
        label: string;
    }>;

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

    /** Precondition functions to fill input select dropdown data */
    schemaInputSelectDataConditions: { [key: string]: (field: SchemaField) => boolean } = {
        displayFields: field => field.name.length > 0,
        segmentFields: field => field.name.length > 0 && (field.type === 'binary' || field.type === 'string'),
        urlFields: field => field.name.length > 0 && (field.type === 'string' || field.listType === 'string')
    };

    /** Precondition functions to fill schema data */
    schemaDataConditions: { [key: string]: (property: any) => boolean } = {
        name: property => property.name,
        container: property => property.container,
        description: property => property.description.length > 0,
        displayField: property => property.displayField.length > 0,
        segmentField: () => {
            return (
                this.getSchemaFieldsFilteredFromFormData(field => {
                    return this.schemaInputSelectDataConditions.segmentFields(field);
                }).length > 0
            );
        },
        urlFields: () => {
            return (
                this.getSchemaFieldsFilteredFromFormData(field => {
                    return this.schemaInputSelectDataConditions.urlFields(field);
                }).length > 0
            );
        }
    };

    /** Precondition functions to fill schema fields data */
    schemaFieldDataConditions: { [key: string]: (property: any) => boolean } = {
        name: property => property.name,
        type: property => property.type,
        label: property => property.label,
        required: property => property.required,
        listType: property => property.type !== 'list' || property.listType.length > 0
    };

    ADMIN_USER_NAME = ADMIN_USER_NAME;

    private destroyed$ = new Subject<void>();

    // CONSTRUCTOR //////////////////////////////////////////////////////////////////////////////
    constructor(
        private entities: EntitiesService,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private formBuilder: FormBuilder,
        private i18n: I18nService,
        private modalService: ModalService
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
     * Fill input select dropdown data from schema data object
     */
    initInputSelectDataFromSchemaData(): void {
        this.displayFields = this.getSchemaFieldsFilteredAsInputSelectDataFromSchemaData(field => {
            return this.schemaInputSelectDataConditions.displayFields(field);
        });
        this.segmentFields = this.getSchemaFieldsFilteredAsInputSelectDataFromSchemaData(field => {
            return this.schemaInputSelectDataConditions.segmentFields(field);
        });
        this.urlFields = this.getSchemaFieldsFilteredAsInputSelectDataFromSchemaData(field => {
            return this.schemaInputSelectDataConditions.urlFields(field);
        });
    }

    /**
     * Fill input select dropdown data from method param
     */
    updateInputSelectData(field: SchemaField): void {
        // displayFields
        if (this.schemaInputSelectDataConditions.displayFields(field)) {
            this.displayFields.push({ value: field.name, label: field.name });
        }

        // segmentFields
        if (this.schemaInputSelectDataConditions.segmentFields(field)) {
            this.segmentFields.push({ value: field.name, label: field.name });
        }

        // urlFields
        if (this.schemaInputSelectDataConditions.urlFields(field)) {
            this.urlFields.push({ value: field.name, label: field.name });
        }
    }

    /**
     * Initialize form with empty/default data and listen to changes
     */
    protected formGroupInit(): void {
        // build form group from provided input data or empty
        this.formGroup = this.formBuilder.group({
            name: [this._schemaJson.name || '', [Validators.required, Validators.pattern(this.allowedChars)]],
            container: [this._schemaJson.container || false],
            description: [this._schemaJson.description || ''],
            displayField: [this._schemaJson.displayField || ''],
            segmentField: [this._schemaJson.segmentField || ''],
            urlFields: [this._schemaJson.urlFields || []],
            fields: this.formBuilder.array(
                this._schemaJson.fields
                    ? this.createFieldsFromData(this._schemaJson.fields as SchemaField[])
                    : [this.createNewField()]
            )
        });
        // init first validation trigger
        this.formGroup.updateValueAndValidity();

        // if init value has been provided, fill related data properties
        this.initInputSelectDataFromSchemaData();

        // listen to form changes
        this.formGroup.valueChanges
            .distinctUntilChanged()
            .takeUntil(this.destroyed$)
            .subscribe((value: any) => {
                // reset data
                this.displayFields = [];
                this.segmentFields = [];
                this.urlFields = [];

                // map form data to component data
                this._schemaJson = {
                    ...(this.schemaDataConditions.name(value) && ({ name: value.name } as any)),
                    ...(this.schemaDataConditions.container(value) && ({ container: value.container } as any)),
                    ...(this.schemaDataConditions.description(value) && ({ description: value.description } as any)),
                    ...(this.schemaDataConditions.displayField(value) && ({ displayField: value.displayField } as any)),
                    // check, if existing data still meets conditions
                    ...(this.schemaDataConditions.displayField(value) &&
                        (this.getSchemaFieldsFilteredFromFormData(field => {
                            return this.schemaInputSelectDataConditions.displayFields(field);
                        }).find(field => field.name === value.displayField) as SchemaField) &&
                        ({ displayField: value.displayField } as any)),
                    // check, if existing data still meets conditions
                    ...(this.schemaDataConditions.segmentField(value) &&
                        (this.getSchemaFieldsFilteredFromFormData(field => {
                            return this.schemaInputSelectDataConditions.segmentFields(field);
                        }).find(field => field.name === value.segmentField) as SchemaField) &&
                        ({ segmentField: value.segmentField } as any)),
                    // check, if existing data still meets conditions
                    ...(this.schemaDataConditions.urlFields(value) &&
                        ({
                            urlFields: this.getSchemaFieldsFilteredFromFormData(field => {
                                return this.schemaInputSelectDataConditions.urlFields(field);
                            }).map(field => field.name)
                        } as any)),
                    // mapping the fields
                    fields: value.fields.map((field: any, index: number) => {
                        const schemaField: FieldSchemaFromServer = {
                            ...(this.schemaFieldDataConditions.name(field) && ({ name: field.name } as any)),
                            ...(this.schemaFieldDataConditions.type(field) && ({ type: field.type } as any)),
                            ...(this.schemaFieldDataConditions.label(field) && ({ label: field.label } as any)),
                            ...(this.schemaFieldDataConditions.required(field) &&
                                ({ required: field.required } as any)),
                            ...(this.schemaFieldDataConditions.listType(field) && ({ listType: field.listType } as any))
                        };

                        // if not of type list anymore, clean up
                        if (field.type !== 'list') {
                            this.propertyPurge(field, index, 'listType');
                        }

                        // if list types has changed, clear up to prevent wrong form contents
                        if (
                            (this._schemaJson &&
                                this._schemaJson.fields &&
                                this._schemaJson.fields[index] &&
                                this._schemaJson.fields[index].type &&
                                this._schemaJson.fields[index].type !== field.type) ||
                            (this._schemaJson &&
                                this._schemaJson.fields &&
                                this._schemaJson.fields[index] &&
                                this._schemaJson.fields[index].listType &&
                                this._schemaJson.fields[index].listType !== field.listType)
                        ) {
                            this.allowValuesClearAt(index);
                        }

                        // if of type node or micronode, assign values
                        if (
                            field.type === 'node' ||
                            field.listType === 'node' ||
                            field.type === 'micronode' ||
                            field.listType === 'micronode'
                        ) {
                            // if entries in allow, assign them to data object but remove from form
                            if (Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                            }
                        }

                        // if of type string, trigger search bar functionality
                        if (field.type === 'string' || field.listType === 'string') {
                            // trigger allow-input
                            this.allowValuesOnStringInputChangeAt(index);

                            // if entries in allow, assign them to data object but remove from form
                            if (Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                            }
                        }

                        // if init value has been provided, fill related data properties
                        this.updateInputSelectData(field);

                        // EXTENDED VALIDATION LOGIC
                        this.fieldHasDuplicateValue(index, 'name');

                        return schemaField;
                    })
                };
                this.schemaJsonChange.emit(JSON.stringify(this._schemaJson, undefined, 4));
            });
    }

    /** True if all values are valid */
    formGroupIsValid(): boolean {
        return this.formGroup.valid;
    }

    /**
     * True if at least one field exists and is valid
     */
    hasValidFields(): boolean {
        return (
            this.schemaFields.controls.filter(field => {
                return field.valid;
            }).length > 0
        );
    }

    /**
     * True if at least one field exists, and meets SegmentField conditions
     */
    hasSegmentFields(): boolean {
        return (
            this.getSchemaFieldsFilteredFromFormData(field => {
                return this.schemaInputSelectDataConditions.segmentFields(field);
            }).length > 0
        );
    }

    /**
     * True if at least one field exists, and meets UrlField conditions
     */
    hasUrlFields(): boolean {
        return (
            this.getSchemaFieldsFilteredFromFormData(field => {
                return this.schemaInputSelectDataConditions.urlFields(field);
            }).length > 0
        );
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
            type: ['', Validators.required],
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

    formControlInArrayClear(index: number, property: keyof SchemaField): void {
        if (this.schemaFields.controls[index].get(property)) {
            this.schemaFields.controls[index].get(property)!.setValue('', { emitEvent: false });
        }
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
            this.formControlInArrayClear(index, 'allow');
            this.allowValues[index].add(value.replace(new RegExp(/\s/, 'g'), ''));
        }
    }

    allowValuesOnStringInputChangeAt(index: number): void {
        if (!this.schemaFields.controls[index].get('allow')) {
            return;
        }
        const allow = this.schemaFields.controls[index].get('allow')!.value;
        // if input value is seperated by space or comma, then add as chip
        if (new RegExp(/\w+\s/, 'g').test(allow)) {
            this.allowValueOnStringInputAddAt(index, allow);
        }
    }

    // SCHEMA MAIN BUTTON //////////////////////////////////////////////////////////////////////////////

    schemaSaveIsPermitted(): boolean {
        // if no schema, this component is in CREATE mode
        if (!this.schema) {
            return true;
        }
        // if schema, check if hs permissions
        return (
            this.schema &&
            this.schema.permissions &&
            (this.schema.permissions.update || this.schema.name !== ADMIN_USER_NAME)
        );
    }
    /**
     * Create/update current schema if displayed warning modal has been confirmed by user
     */
    schemaSave(): void {
        if (
            this.schema &&
            this.schema.permissions &&
            this.schema.permissions.update &&
            (!this.schema.permissions.update || this.schema.name === ADMIN_USER_NAME)
        ) {
            return;
        } else {
            // if no schema, this component is in CREATE mode
            this.displaySaveSchemaModal(
                { token: 'admin.schema_update' },
                { token: 'admin.schema_updated_confirmation', params: { name: this.formGroup.value.name } }
            ).then(() => {
                this.save.emit();
            });
        }
    }

    schemaDeleteIsPermitted(): boolean {
        // if schema, check if hs permissions
        return (
            this.schema &&
            this.schema.permissions &&
            (this.schema.permissions.delete || this.schema.name !== ADMIN_USER_NAME)
        );
    }
    /**
     * Delete current schema if displayed warning modal has been confirmed by user
     */
    schemaDelete(): void {
        if (
            this.schema &&
            this.schema.permissions &&
            this.schema.permissions.delete &&
            (!this.schema.permissions.delete || this.schema.name === ADMIN_USER_NAME)
        ) {
            return;
        }
        this.displayDeleteSchemaModal(
            { token: 'admin.delete_schema' },
            { token: 'admin.delete_schema_confirmation', params: { name: this.schema.name } }
        ).then(() => {
            this.delete.emit();
        });
    }

    /**
     * Delete field at index if displayed warning modal has been confirmed by user
     */
    fieldDelete(field: FormControl, index: number): void {
        // if field is valid, ask before deleting
        if (field.valid) {
            this.displayDeleteFieldModal(
                { token: 'admin.delete_schemafield' },
                { token: 'admin.schemafield_delete_confirmation', params: { name: field.value.name } }
            ).then(() => {
                this.fieldRemoveAt(index);
            });
            // otherwise delete without confirmation
        } else {
            this.fieldRemoveAt(index);
        }
    }

    schemaDeleteButtonIsDisplayed(): boolean {
        return this.schema ? true : false;
    }

    // PRIVATE METHODS //////////////////////////////////////////////////////////////////////////////

    /**
     * Return fields of schema data as data for select/drop-down input filtered by function
     * @param compareFn filtering fields
     * @returns array of value-label pairs fit for input select drop down data
     */
    private getSchemaFieldsFilteredAsInputSelectDataFromSchemaData(
        compareFn: (field: SchemaField) => boolean
    ): Array<{ value: string; label: string }> {
        return this._schemaJson.fields
            ? (this._schemaJson.fields as SchemaField[])
                  .filter(field => compareFn(field))
                  .map(field => ({ value: field.name, label: field.name }))
            : [];
    }

    /**
     * Returns fields of schema from form data filtered by function
     * @param compareFn filtering fields
     */
    private getSchemaFieldsFilteredFromFormData(compareFn: (field: SchemaField) => boolean): SchemaField[] {
        return this.schemaFields.value
            ? (this.schemaFields.value as SchemaField[]).filter(field => compareFn(field))
            : [];
    }

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

        if (!this._schemaJson) {
            return;
        }
        const fieldToDelete = (this._schemaJson.fields && (this._schemaJson.fields[index] as SchemaField)) || null;
        if (fieldToDelete && fieldToDelete[property]) {
            delete fieldToDelete[property];
        }
    }

    private displaySaveSchemaModal(
        title: { token: string; params?: { [key: string]: any } },
        body: { token: string; params?: { [key: string]: any } }
    ): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate(title.token, title.params) + '?',
                body: this.i18n.translate(body.token, body.params),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        shouldReject: true,
                        label: this.i18n.translate('common.cancel_button')
                    },
                    { type: 'secondary', label: this.i18n.translate('admin.schema_update') }
                ]
            })
            .then(modal => modal.open());
    }

    private displayDeleteSchemaModal(
        title: { token: string; params?: { [key: string]: any } },
        body: { token: string; params?: { [key: string]: any } }
    ): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate(title.token, title.params) + '?',
                body: this.i18n.translate(body.token, body.params),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        shouldReject: true,
                        label: this.i18n.translate('common.cancel_button')
                    },
                    { type: 'alert', label: this.i18n.translate('admin.delete_label') }
                ]
            })
            .then(modal => modal.open());
    }

    private displayDeleteFieldModal(
        title: { token: string; params?: { [key: string]: any } },
        body: { token: string; params?: { [key: string]: any } }
    ): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate(title.token, title.params) + '?',
                body: this.i18n.translate(body.token, body.params),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        shouldReject: true,
                        label: this.i18n.translate('common.cancel_button')
                    },
                    { type: 'alert', label: this.i18n.translate('admin.delete_label') }
                ]
            })
            .then(modal => modal.open());
    }
}

export type TSchemaEditorErrors = 'required' | 'pattern' | 'duplicate';
