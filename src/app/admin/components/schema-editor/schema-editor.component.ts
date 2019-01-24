import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Microschema } from '../../../common/models/microschema.model';
import { ListTypeFieldType, Schema, SchemaField, SchemaFieldType } from '../../../common/models/schema.model';
import { SchemaUpdateRequest } from '../../../common/models/server-models';
import { simpleCloneDeep } from '../../../common/util/util';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

/**
 * Schema Builder for UI-friendly assembly of a new schema at app route /admin/schemas/new
 */
@Component({
    selector: 'mesh-schema-editor',
    templateUrl: './schema-editor.component.html',
    styleUrls: ['./schema-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaEditorComponent implements OnInit, OnDestroy {
    // PROPERTIES //////////////////////////////////////////////////////////////////////////////

    formGroup: FormGroup;

    @Input()
    get schema(): string {
        return JSON.stringify(this._schema, undefined, 4);
    }
    set schema(value: string) {
        this._schema = JSON.parse(value);
        if (this.formGroup instanceof FormGroup) {
            this.formGroup.patchValue(this._schema, { emitEvent: false });
        }
    }
    @Output() schemaChange = new EventEmitter<string>();

    @Output() save = new EventEmitter<string>();

    private _schema: SchemaUpdateRequest | Schema = {
        name: '',
        displayField: '',
        fields: [
            {
                name: '',
                type: ''
            }
        ]
    };

    allSchemas$: Observable<Schema[]>;

    allMicroschemas$: Observable<Microschema[]>;

    allowValues: Array<Set<string>> = [];

    schemaFieldListTypes: Array<{ value: SchemaFieldType; label: string }> = [
        {
            value: 'binary',
            label: 'Binary'
        },
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

    schemaFieldTypes: Array<{ value: SchemaFieldType; label: string }> = [
        ...this.schemaFieldListTypes,
        {
            value: 'list',
            label: 'List'
        }
    ];

    get schemaFields(): FormArray {
        return this.formGroup.get('fields') as FormArray;
    }

    displayFields: Array<{ value: string; label: string }> = [];

    segmentFields: Array<{ value: string; label: string }> = [];

    urlFields: Array<{ value: string; label: string }> = [];

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
     * Initialize form with empty/default data and listen to changes
     */
    protected formGroupInit(): void {
        this.formGroup = this.formBuilder.group({
            name: [this._schema.name || '', Validators.required],
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
                    container: value.container,
                    description: value.description,
                    displayField: value.displayField,
                    segmentField: value.segmentField,
                    urlFields: ['test'],
                    fields: value.fields.map((field: any, index: number) => {
                        const schemaField: SchemaField = {
                            name: field.name,
                            label: field.label,
                            type: field.type,
                            required: field.required,
                            listType: field.listType as ListTypeFieldType
                        };

                        // if something has changed, clear up before saving
                        if (
                            (this._schema &&
                                this._schema.fields &&
                                this._schema.fields[index] &&
                                this._schema.fields[index].type !== field.type) ||
                            (this._schema &&
                                this._schema.fields &&
                                this._schema.fields[index] &&
                                this._schema.fields[index].listType !== field.listType)
                        ) {
                            this.allowValuesClearAt(index);
                            this.propertyPurge(field, index, 'allow');
                        }

                        // if not of type list anymore, clean up
                        if (field.type !== 'list') {
                            this.propertyPurge(field, index, 'listType');
                        }

                        // if of type string, trigger search bar functionality
                        if (field.type === 'string' || field.listType === 'string') {
                            this.allowValuesOnStringInputChangeAt(index);
                        }

                        // if allow property should exist, assign appropriate data
                        Object.assign(schemaField, {
                            allow: this.allowValues[index] ? Array.from(this.allowValues[index]) : null
                        });

                        // if field.allow proeprty is an empty array, clean it up
                        if (field.allow && field.allow.length && field.allow === 0) {
                            this.propertyPurge(field, index, 'allow');
                        }

                        // fill data for displayFields input
                        if (field.name) {
                            this.displayFields.push({ value: field.name, label: field.name });
                            this.segmentFields.push({ value: field.name, label: field.name });
                        }

                        // EXTENDED VALIDATION LOGIC
                        this.fieldHasDuplicateValue(index, 'name');
                        this.fieldHasDuplicateValue(index, 'label');

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

    // MANAGE SCHEMA.FIELD[] ENTRIES //////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize a new FormGroup instance and its related data analog to schema.field type
     */
    protected createNewField(): FormGroup {
        this.allowValues.push(new Set<string>());
        return this.formBuilder.group({
            name: ['', Validators.required],
            label: ['', Validators.required],
            type: ['', Validators.required],
            required: [false],
            listType: [null],
            allow: [null]
        });
    }

    protected createFieldFromData(field: SchemaField): FormGroup {
        return this.formBuilder.group({
            name: [field.name || '', Validators.required],
            label: [field.label || '', Validators.required],
            type: [field.type || '', Validators.required],
            required: [field.required || false],
            listType: [field.listType || ''],
            allow: [field.allow || '']
        });
    }

    protected createFieldsFromData(fields: SchemaField[]): FormGroup[] {
        return fields.map(field => {
            return this.createFieldFromData(field);
        });
    }

    fieldAdd(): void {
        this.schemaFields.push(this.createNewField());
    }

    fieldRemoveAt(index: number): void {
        this.schemaFields.removeAt(index);
    }

    fieldRemoveLast(): void {
        this.fieldRemoveAt(this.schemaFields.length - 1);
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
        const control = this.schemaFields.controls[index].get(formControlName);
        if (isDuplicate === true) {
            control!.setErrors({ duplicate: true });
        } else {
            control!.setErrors(null);
        }
        return isDuplicate;
    }

    getErrorFromControlOfType(formControlName: keyof Schema, errorType: string): boolean {
        return this.formGroup.get(formControlName)!.hasError(errorType);
    }

    getErrorFromControlInFromArrayOfType(
        index: number,
        formControlName: keyof SchemaField,
        errorType: string
    ): boolean {
        return this.schemaFields.controls[index].get(formControlName)!.hasError(errorType);
    }

    // MANAGE SCHEMA.FIELD[].ALLOW VALUES //////////////////////////////////////////////////////////////////////////////

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

        // clear form values
        const newForm = simpleCloneDeep(this.formGroup.value);
        const newField = newForm.fields[index];
        if (!newField.allow) {
            return;
        }
        newField.allow = '';
        this.formGroup.patchValue(newForm);
    }

    allowValuesContainsAt(index: number, value: string): boolean {
        return this.allowValues[index].has(value);
    }

    allowValueOnStringInputAddAt(index: number): void {
        const newForm = simpleCloneDeep(this.formGroup.value);
        const newField = newForm.fields[index];
        // update mesh chip array cleaned from forbiddden characters
        this.allowValues[index].add(newField.allow.replace(new RegExp(/\W/, 'g'), ''));
        // empty field after new value is displayed as chip
        newField.allow = '';
        // assign new value to form data
        this.formGroup.patchValue(newForm);
    }

    allowValuesOnStringInputChangeAt(index: number): void {
        const newForm = simpleCloneDeep(this.formGroup.value);
        const newField = newForm.fields[index];
        if (!newField.allow) {
            return;
        }
        // if input value is seperated by space or comma, then add as chip
        if (new RegExp(/\w+\W/, 'g').test(newField.allow)) {
            this.allowValueOnStringInputAddAt(index);
        }
    }

    // SCHEMA MAIN BUTTON //////////////////////////////////////////////////////////////////////////////

    schemaCreate(): void {
        console.log('!!! schemaCreate()');
        this.save.emit(JSON.stringify(this._schema, undefined, 4));
    }

    schemaDelete(): void {
        console.log('!!! schemaDelete()');
    }

    // PRIVATE METHODS //////////////////////////////////////////////////////////////////////////////

    private propertyPurge(field: any, index: number, property: keyof SchemaField): void {
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
