import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
    ValidatorFn
} from '@angular/forms';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Microschema, MicroschemaField } from '../../../common/models/microschema.model';
import { MicroschemaFieldType, Schema, SchemaField, SchemaFieldType } from '../../../common/models/schema.model';
import { FieldSchemaFromServer, MicroschemaResponse } from '../../../common/models/server-models';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { AbstractSchemaEditorComponent } from '../abstract-schema-editor/abstract-schema-editor.component';

/**
 * Schema Builder for UI-friendly assembly of a new schema at app route /admin/schemas/new
 */
@Component({
    selector: 'mesh-microschema-editor',
    templateUrl: './microschema-editor.component.html',
    styleUrls: ['./microschema-editor.component.scss'],
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
export class MicroschemaEditorComponent extends AbstractSchemaEditorComponent<
    Microschema,
    MicroschemaResponse,
    MicroschemaField,
    MicroschemaFieldType
> {
    // PROPERTIES //////////////////////////////////////////////////////////////////////////////

    /** Providing data for Schema Field List Type dropdown list */
    schemaFieldListTypes: Array<{ value: MicroschemaFieldType; label: string }> = [
        {
            value: 'boolean',
            label: 'Boolean'
        },
        {
            value: 'date',
            label: 'Date'
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
    schemaFieldTypes: Array<{ value: MicroschemaFieldType; label: string }> = [
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
        value: MicroschemaFieldType;
        label: string;
    }>;

    /** Regular expression for text input validation checking for allowed characters */
    allowedChars = new RegExp(/^[a-zA-Z0-9_]+$/);

    /** Precondition functions to fill input select dropdown data */
    schemaInputSelectDataConditions: { [key: string]: (field: MicroschemaField) => boolean } = {
        // displayFields: field => field.name.length > 0 && (field.type === 'binary' || field.type === 'string'),
    };

    /** Central form initial validators reference */
    formValidators: { [key: string]: ValidatorFn[] | any } = {
        name: [Validators.required, Validators.pattern(this.allowedChars)],
        description: [],
        fields: {
            name: [Validators.required, Validators.pattern(this.allowedChars)],
            label: [],
            type: [Validators.required],
            required: [],
            listType: []
        }
    };

    /** Precondition functions to fill schema data */
    schemaDataConditions: { [key: string]: (property: any) => boolean } = {
        name: property => property.name,
        description: property => property.description.length > 0
    };

    /** Precondition functions to fill schema fields data */
    schemaFieldDataConditions: { [key: string]: (property: any) => boolean } = {
        name: property => property.name,
        type: property => property.type,
        label: property => property.label,
        required: property => property.required,
        listType: property => property.type !== 'list' || (property.listType && property.listType.length > 0)
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

    // MANAGE FORM //////////////////////////////////////////////////////////////////////////////

    /**
     * Returns modified schema to fit the form's data structure
     * @param schema of original state
     */
    schemaAsFormValue(schema: Microschema): Microschema {
        return schema;
    }

    /**
     * Fill input select dropdown data from schema data object
     */
    initInputSelectDataFromSchemaData(): void {
        // this.displayFields = this.getSchemaFieldsFilteredAsInputSelectDataFromSchemaData(field => {
        //     return this.schemaInputSelectDataConditions.displayFields(field);
        // });
    }

    /**
     * Fill input select dropdown data from method param
     */
    updateInputSelectData(field: MicroschemaField): void {
        // // displayFields
        // if (this.schemaInputSelectDataConditions.displayFields(field)) {
        //     this.displayFields.push({ value: field.name, label: field.name });
        // }
    }

    /**
     * Initialize form with empty/default data and listen to changes
     */
    protected formGroupInit(): void {
        // build form group from provided input data or empty
        this.formGroup = this.formBuilder.group({
            name: [this._schemaJson.name || '', this.formValidators.name],
            description: [this._schemaJson.description || '', this.formValidators.description],
            fields: this.formBuilder.array(
                this._schemaJson.fields
                    ? this.createFieldsFromData(this._schemaJson.fields as MicroschemaField[])
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
                // EXTENDED VALIDATION LOGIC
                this.isConflictingProperty('name', value.name);

                // map form data to component data
                this._schemaJson = {
                    ...(this.schemaDataConditions.name(value) && ({ name: value.name } as any)),
                    ...(this.schemaDataConditions.description(value) && ({ description: value.description } as any)),
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
            this.allMicroschemas.filter((schema: any) => schema[formControlName] === value).length > 0 ? true : false;
        const control = this.formGroup.get(formControlName) as AbstractControl | any;

        if (isConflict === true) {
            // assign new error to field errors
            this.controlErrorsAdd(control, { conflict: true });
            // control!.setErrors({ ...control!.errors, ...{ conflict: true } });
        } else {
            // if exist, create new error object without conflict error
            this.controlErrorsRemove(control, ['conflict']);
            // const errors =
            //     control!.errors && (this.objectRemoveProperties(control!.errors, 'conflict') as ValidationErrors | null);
            // control!.setErrors(errors);
        }
        return isConflict;
    }

    // MANAGE SCHEMA.FIELD[] ENTRIES //////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize a new FormGroup instance and its related data analog to schema.field type
     */
    protected createNewField(): FormGroup {
        return this.formBuilder.group({
            name: ['', this.formValidators.fields.name],
            label: ['', this.formValidators.fields.label],
            type: ['', this.formValidators.fields.type],
            required: [false, this.formValidators.fields.required],
            listType: [null, this.formValidators.fields.listType]
        });
    }

    protected createFieldFromData(field: MicroschemaField): FormGroup {
        return this.formBuilder.group({
            name: [field.name || '', this.formValidators.fields.name],
            label: [field.label || '', this.formValidators.fields.label],
            type: [field.type || '', this.formValidators.fields.type],
            required: [field.required || false, this.formValidators.fields.required],
            listType: [field.listType || null, this.formValidators.fields.listType]
        });
    }
}
