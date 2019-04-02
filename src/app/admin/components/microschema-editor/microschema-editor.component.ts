import { AnimationBuilder } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';

import { Microschema, MicroschemaField } from '../../../common/models/microschema.model';
import { MicroschemaFieldType } from '../../../common/models/schema.model';
import {
    FieldSchemaFromServer,
    MicroschemaResponse,
    MicroschemaUpdateRequest
} from '../../../common/models/server-models';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';
import { AbstractSchemaEditorComponent } from '../abstract-schema-editor/abstract-schema-editor.component';

/**
 * @description Schema Builder for UI-friendly assembly of a new microschema at app route /admin/microschemas/new
 */
@Component({
    selector: 'mesh-microschema-editor',
    templateUrl: './microschema-editor.component.html',
    styleUrls: ['./microschema-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroschemaEditorComponent extends AbstractSchemaEditorComponent<
    MicroschemaUpdateRequest,
    MicroschemaResponse,
    MicroschemaField,
    MicroschemaFieldType
> {
    // PROPERTIES //////////////////////////////////////////////////////////////////////////////

    /** Providing data for Schema Field List Type dropdown list */
    schemaFieldListTypes: Array<{ value: MicroschemaFieldType; label: string }> = [
        {
            value: 'boolean',
            label: 'boolean'
        },
        {
            value: 'date',
            label: 'date'
        },
        {
            value: 'node',
            label: 'node'
        },
        {
            value: 'number',
            label: 'number'
        },
        {
            value: 'html',
            label: 'html'
        },
        {
            value: 'string',
            label: 'string'
        }
    ];

    /** Providing data for Schema Field Type dropdown list */
    schemaFieldTypes: Array<{ value: MicroschemaFieldType; label: string }> = [
        ...this.schemaFieldListTypes,
        {
            value: 'list',
            label: 'list'
        }
    ].sort((a, b) => a.value.localeCompare(b.value)) as Array<{
        value: MicroschemaFieldType;
        label: string;
    }>;

    /** Precondition functions to fill input select dropdown data */
    schemaInputSelectDataConditions: { [key: string]: (field: MicroschemaField) => boolean } = {};

    /** Central form initial validators reference */
    formValidators: { [key: string]: ValidatorFn[] | any } = {
        name: [Validators.required, Validators.pattern(this.allowedCharsRegExp)],
        description: [],
        fields: {
            name: [Validators.required, Validators.pattern(this.allowedCharsRegExp)],
            type: [Validators.required],
            required: [],
            listType: []
        }
    };

    /** Precondition functions to fill schema data */
    schemaDataConditions: {
        [key: string]: (schema: MicroschemaUpdateRequest) => boolean;
    } = {
        name: () => true,
        description: schema => schema.description!.length > 0
    };

    /** Precondition functions to fill schema fields data */
    schemaFieldDataConditions: {
        [key: string]: (field: MicroschemaField) => boolean;
    } = {
        name: () => true,
        type: () => true,
        label: () => true,
        required: field => field.required === true,
        listType: field => (field.type === 'list' && field.listType && field.listType.length > 0) || false,
        allow: () => true
    };

    // CONSTRUCTOR //////////////////////////////////////////////////////////////////////////////
    constructor(
        router: Router,
        appState: ApplicationStateService,
        entities: EntitiesService,
        adminSchemaEffects: AdminSchemaEffectsService,
        formBuilder: FormBuilder,
        i18n: I18nService,
        modalService: ModalService,
        animationBuilder: AnimationBuilder
    ) {
        super(router, appState, entities, adminSchemaEffects, formBuilder, i18n, modalService, animationBuilder);
    }

    // MANAGE FORM //////////////////////////////////////////////////////////////////////////////

    schemaAsFormValue(schema: MicroschemaUpdateRequest | Microschema): Microschema {
        return (
            (schema as any).fields
                // as formGroup.field[].allow.control values are represented not as input value, empty it
                .map((field: MicroschemaField) => this.objectRemoveProperties(field, ['allow']) as MicroschemaField)
        );
    }

    initInputSelectDataFromSchemaData(): void {}

    updateInputSelectData(field: MicroschemaField): void {}

    protected formGroupInit(): void {
        // build form group from provided input data or empty
        this.formGroup = this.formBuilder.group({
            name: [this._schemaJson.name || this.schemaTitlePrefilled || '', this.formValidators.name],
            description: [this._schemaJson.description || '', this.formValidators.description],
            fields: this.formBuilder.array(
                this._schemaJson.fields ? this.createFieldsFromData(this._schemaJson.fields as MicroschemaField[]) : []
            )
        });

        // if init value has been provided, fill related data properties
        this.initInputSelectDataFromSchemaData();

        // listen to form changes
        this.formGroup.valueChanges
            .distinctUntilChanged()
            .takeUntil(this.destroyed$)
            .subscribe((value: any) => {
                // set flag to identify change trigger source
                this.schemaJsonFromExternalSource = false;

                // EXTENDED VALIDATION LOGIC
                this.isConflictingProperty('name', value.name);

                // map form data to component data
                this._schemaJson = {
                    ...(this.schemaDataConditions.name(value) && ({ name: value.name } as any)),
                    ...(this.schemaDataConditions.description(value) && ({ description: value.description } as any)),
                    // mapping the fields
                    fields: value.fields.map((field: any, index: number) => {
                        const oldField = this.schemaFields.value[index];
                        const schemaField: FieldSchemaFromServer = {
                            ...(this.schemaFieldDataConditions.name(field) && ({ name: field.name } as any)),
                            ...(this.schemaFieldDataConditions.type(field) && ({ type: field.type } as any)),
                            ...(this.schemaFieldDataConditions.label(field) && ({ label: field.label } as any)),
                            ...({ required: field.required || false } as any),
                            // check conditions and only assign if type has changed
                            ...(this.schemaFieldDataConditions.listType(field) && ({ listType: field.listType } as any))
                        };

                        // EXTENDED VALIDATION LOGIC
                        this.fieldHasDuplicateValue(index, 'name');

                        // conditional validators depending on type
                        if (field.type === 'list') {
                            this.controlValidatorsUpdate(this.schemaFields.controls[index].get('listType') as any, [
                                Validators.required
                            ]);
                        } else {
                            this.controlValidatorsUpdate(
                                this.schemaFields.controls[index].get('listType') as any,
                                null
                            );
                        }

                        // if not of type list anymore, update controls to display correct input elements
                        if (field.type !== 'list' || oldField.type !== field.type) {
                            this.schemaFields.controls[index].get('listType')!.setValue(null, {
                                onlySelf: true,
                                emitEvent: false
                            });
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
                        if (field.type === 'node' || field.listType === 'node') {
                            // if entries in allow, assign them to data object but remove from form
                            if (this.allowValues[index] && Array.from(this.allowValues[index]).length > 0) {
                                Object.assign(schemaField, { allow: Array.from(this.allowValues[index]) });
                                this.schemaFields.controls[index]
                                    .get('allow')!
                                    .setValue(Array.from(this.allowValues[index]), {
                                        onlySelf: true,
                                        emitEvent: false
                                    });
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

                        return schemaField;
                    })
                };
                this.schemaJsonChange.emit(JSON.stringify(this._schemaJson, undefined, 4));
                this.isValid.emit(this.formGroupIsValid());
            });

        // init first validation trigger
        this.formGroup.updateValueAndValidity();
        this.isValid.emit(this.formGroupIsValid());
    }

    isConflictingProperty(formControlName: keyof Microschema, value: any): boolean {
        // if editing an existing entity, always return false
        if (this.isNew === false || !this.allMicroschemas) {
            return false;
        }
        const isConflict =
            this.allMicroschemas.filter((schema: any) => schema[formControlName] === value).length > 0 ? true : false;
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
        return this.formBuilder.group({
            name: ['', this.formValidators.fields.name],
            label: ['', this.formValidators.fields.label],
            type: ['', this.formValidators.fields.type],
            required: [false, this.formValidators.fields.required],
            listType: [null, this.formValidators.fields.listType],
            allow: ['', this.formValidators.fields.allow]
        });
    }

    protected createFieldFromData(field: MicroschemaField): FormGroup {
        if (field.allow instanceof Array && field.allow.length > 0) {
            this.allowValues.push(new Set<string>(field.allow));
        } else {
            this.allowValues.push(new Set<string>());
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
