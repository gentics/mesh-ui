import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
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

    schema: SchemaUpdateRequest | Schema;

    allSchemas$: Observable<Schema[]>;

    allMicroschemas$: Observable<Microschema[]>;

    allowValues: Array<Set<string>> = [];

    schemaTypes: Array<{ value: SchemaFieldType; label: string }> = [
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
            value: 'list',
            label: 'List'
        },
        {
            value: 'string',
            label: 'String'
        }
    ];

    get schemaFields(): FormArray {
        return this.formGroup.get('fields') as FormArray;
    }

    // get displayFields(): Array<{ value: string; label: string; }> {
    //     return true;
    // }

    // get segmentFields(): Array<{ value: string; label: string; }> {
    //     return true;
    // }

    // get urlFieldss(): Array<{ value: string; label: string; }> {
    //     return true;
    // }

    private destroyed$: Subject<void> = new Subject();

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
            name: ['', Validators.required],
            container: [false],
            description: [''],
            displayField: [{ value: '', disabled: true }, Validators.required],
            segmentField: [{ value: '', disabled: true }, Validators.required],
            urlFields: [{ value: '', disabled: true }, Validators.required],
            fields: this.formBuilder.array([this.createNewField()])
        });

        // listen to form changes
        this.formGroup.valueChanges
            .distinctUntilChanged()
            .takeUntil(this.destroyed$)
            .subscribe((value: any) => {
                // assign form data to component data
                this.schema = {
                    name: value.name,
                    container: value.container,
                    description: value.description,
                    displayField: 'test',
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
                            (this.schema &&
                                this.schema.fields &&
                                this.schema.fields[index] &&
                                this.schema.fields[index].type !== field.type) ||
                            (this.schema &&
                                this.schema.fields &&
                                this.schema.fields[index] &&
                                this.schema.fields[index].listType !== field.listType)
                        ) {
                            this.allowValuesClearAt(index);
                            this.propertyPurge(field, index, 'allow');
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

                        return schemaField;
                    })
                };
                console.log('!!! schema:', this.schema);
            });
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

    fieldAdd(): void {
        this.schemaFields.push(this.createNewField());
    }

    fieldRemoveAt(index: number): void {
        this.schemaFields.removeAt(index);
    }

    fieldRemoveLast(): void {
        this.fieldRemoveAt(this.schemaFields.length - 1);
    }

    // MANAGE SCHEMA.FIELD[].ALLOW VALUES //////////////////////////////////////////////////////////////////////////////

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
        this.allowValues[index].add(newField.allow.replace(' ', '').replace(',', ''));
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
        if (newField.allow.indexOf(',') > -1 || newField.allow.indexOf(' ') > -1) {
            this.allowValueOnStringInputAddAt(index);
        }
    }

    // SCHEMA MAIN BUTTON //////////////////////////////////////////////////////////////////////////////

    schemaCreate(): void {
        console.log('!!! schemaCreate()');
    }

    schemaDelete(): void {
        console.log('!!! schemaDelete()');
    }

    // PRIVATE METHODS //////////////////////////////////////////////////////////////////////////////

    private propertyPurge(field: any, index: number, property: keyof SchemaField): void {
        delete field[property];
        if (!this.schema) {
            return;
        }
        const fieldToDelete = this.schema.fields[index] as SchemaField;
        if (!field) {
            return;
        }
        delete fieldToDelete[property];
    }
}
