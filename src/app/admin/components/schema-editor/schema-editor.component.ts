import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { ModalService } from 'gentics-ui-core';

import { Schema, SchemaField, SchemaFieldType } from '../../../common/models/schema.model';
import { FieldSchemaFromServer, SchemaResponse, SchemaUpdateRequest } from '../../../common/models/server-models';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { AbstractSchemaEditorComponent } from '../abstract-schema-editor/abstract-schema-editor.component';

/**
 * @description Schema Builder for UI-friendly assembly of a new schema at app route /admin/schemas/new
 */
@Component({
    selector: 'mesh-schema-editor',
    templateUrl: './schema-editor.component.html',
    styleUrls: ['./schema-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('animNgIf', [
            transition(':enter', [style({ opacity: 0 }), animate('0.2s', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('0.2s', style({ opacity: 0 }))])
        ]),
        trigger('animNgForParent', [transition(':enter, :leave', [query('@animNgForChild', [animateChild()])])]),
        trigger('animNgForChild', [
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
export class SchemaEditorComponent extends AbstractSchemaEditorComponent<
    SchemaUpdateRequest | Schema,
    SchemaResponse,
    SchemaField,
    SchemaFieldType
> {
    // PROPERTIES //////////////////////////////////////////////////////////////////////////////

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

    /** Regular expression for text input validation checking for allowed characters */
    allowedChars = new RegExp(/^[a-zA-Z0-9_]+$/);

    /** Precondition functions to fill input select dropdown data */
    schemaInputSelectDataConditions: { [key: string]: (field: SchemaField) => boolean } = {
        displayFields: field => field.name.length > 0 && (field.type === 'binary' || field.type === 'string'),
        segmentFields: field => field.name.length > 0 && (field.type === 'binary' || field.type === 'string'),
        urlFields: field => field.name.length > 0 && (field.type === 'string' || field.listType === 'string')
    };

    /** Central form initial validators reference */
    formValidators: { [key: string]: ValidatorFn[] | any } = {
        name: [Validators.required, Validators.pattern(this.allowedChars)],
        container: [],
        description: [],
        displayField: [],
        segmentField: [],
        urlFields: [],
        fields: {
            name: [Validators.required, Validators.pattern(this.allowedChars)],
            label: [],
            type: [Validators.required],
            required: [],
            listType: [],
            allow: []
        }
    };

    /** Precondition functions to fill schema data */
    schemaDataConditions: { [key: string]: (property: any) => boolean } = {
        name: property => property.name,
        container: property => property.container,
        description: property => property.description.length > 0,
        displayField: () => {
            return (
                this.getSchemaFieldsFilteredFromFormData(field => {
                    return this.schemaInputSelectDataConditions.segmentFields(field);
                }).length > 0
            );
        },
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
        listType: property => property.type === 'list' && property.listType && property.listType.length > 0
    };

    // CONSTRUCTOR //////////////////////////////////////////////////////////////////////////////
    constructor(
        entities: EntitiesService,
        adminSchemaEffects: AdminSchemaEffectsService,
        formBuilder: FormBuilder,
        i18n: I18nService,
        modalService: ModalService
    ) {
        super(entities, adminSchemaEffects, formBuilder, i18n, modalService);
    }

    // MANAGE COMPONENT DATA //////////////////////////////////////////////////////////////////////////////

    /**
     * Returns modified schema to fit the form's data structure
     * @param schema of original state
     */
    schemaAsFormValue(schema: SchemaUpdateRequest | Schema): SchemaUpdateRequest | Schema {
        return (
            (schema as any).fields
                // as formGroup.field[].allow.control values are represented not as input value, empty it
                .map((field: SchemaField) => this.objectRemoveProperties(field, ['allow']) as SchemaField)
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

    protected formGroupInit(): void {
        // build form group from provided input data or empty
        this.formGroup = this.formBuilder.group({
            name: [this._schemaJson.name || '', this.formValidators.name],
            container: [this._schemaJson.container || false, this.formValidators.container],
            description: [this._schemaJson.description || '', this.formValidators.description],
            displayField: [this._schemaJson.displayField || '', this.formValidators.displayField],
            segmentField: [this._schemaJson.segmentField || '', this.formValidators.segmentField],
            urlFields: [this._schemaJson.urlFields || [], this.formValidators.urlFields],
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

                // EXTENDED VALIDATION LOGIC
                this.isConflictingProperty('name', value.name);

                // map form data to component data
                this._schemaJson = {
                    ...(this.schemaDataConditions.name(value) && ({ name: value.name } as any)),
                    ...(this.schemaDataConditions.container(value) && ({ container: value.container } as any)),
                    ...(this.schemaDataConditions.description(value) && ({ description: value.description } as any)),
                    // assign data meeting conditions only
                    ...(this.schemaDataConditions.displayField(value) &&
                        (this.getSchemaFieldsFilteredFromFormData(field => {
                            return this.schemaInputSelectDataConditions.displayFields(field);
                        }).find(field => field.name === value.displayField) as SchemaField) &&
                        ({ displayField: value.displayField } as any)),
                    // assign data meeting conditions only
                    ...(this.schemaDataConditions.segmentField(value) &&
                        (this.getSchemaFieldsFilteredFromFormData(field => {
                            return this.schemaInputSelectDataConditions.segmentFields(field);
                        }).find(field => field.name === value.segmentField) as SchemaField) &&
                        ({ segmentField: value.segmentField } as any)),
                    // assign data meeting conditions only
                    ...(this.schemaDataConditions.urlFields(value) &&
                        ({
                            urlFields: this.getSchemaFieldsFilteredFromFormData(field => {
                                return this.schemaInputSelectDataConditions.urlFields(field);
                            })
                                .map(field => field.name)
                                .filter(fieldName =>
                                    (value.urlFields as string[]).find(urlFieldName => urlFieldName === fieldName)
                                )
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
                            if (this.allowValues[index] && Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                            }
                        }

                        // if of type string, trigger search bar functionality
                        if (field.type === 'string' || field.listType === 'string') {
                            // trigger allow-input
                            this.allowValuesOnStringInputChangeAt(index);
                            // if entries in allow, assign them to data object but remove from form
                            if (this.allowValues[index] && Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                            }
                        }

                        // if init value has been provided, fill related data properties
                        this.updateInputSelectData(field);

                        // EXTENDED VALIDATION LOGIC
                        this.fieldHasDuplicateValue(index, 'name');

                        if (field.type === 'list') {
                            this.validatorUpdate(this.schemaFields.controls[index].get('listType') as any, [
                                Validators.required
                            ]);
                        } else {
                            this.validatorUpdate(this.schemaFields.controls[index].get('listType') as any, []);
                        }

                        return schemaField;
                    })
                };
                this.schemaJsonChange.emit(JSON.stringify(this._schemaJson, undefined, 4));
            });
    }

    isConflictingProperty(formControlName: any, value: any): boolean {
        // if editing an existing entity, always return false
        if (this.isNew === false) {
            return false;
        }
        const isConflict =
            this.allSchemas.filter((schema: any) => schema[formControlName] === value).length > 0 ? true : false;
        const control = this.formGroup.get(formControlName) as AbstractControl | any;

        if (isConflict === true) {
            // assign new error to field errors
            this.controlErrorsAdd(control, { conflict: true });
        } else {
            // if exist, create new error object without conflict error
            this.controlErrorsRemove(control, ['conflict']);
        }
        return isConflict;
    }

    // MANAGE SCHEMA.FIELD[] ENTRIES //////////////////////////////////////////////////////////////////////////////

    protected createNewField(): FormGroup {
        this.allowValues.push(new Set<string>());
        const test = this.formBuilder.group({
            name: ['', this.formValidators.fields.name],
            label: ['', this.formValidators.fields.label],
            type: ['', this.formValidators.fields.type],
            required: [false, this.formValidators.fields.required],
            listType: [null, this.formValidators.fields.listType],
            allow: ['', this.formValidators.fields.allow]
        });
        return test;
    }

    protected createFieldFromData(field: SchemaField): FormGroup {
        if (field.allow instanceof Array && field.allow.length > 0) {
            this.allowValues.push(new Set<string>(field.allow));
        } else {
            this.allowValues.push(new Set<string>([]));
        }
        return this.formBuilder.group({
            name: [field.name || '', this.formValidators.fields.name],
            label: [field.label || '', this.formValidators.fields.label],
            type: [field.type || '', this.formValidators.fields.type],
            required: [field.required || false, this.formValidators.fields.required],
            listType: [field.listType || null, this.formValidators.fields.listType],
            allow: ['', this.formValidators.fields.allow]
        });
    }
}
