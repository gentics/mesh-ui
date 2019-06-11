import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import {
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService, SortableItem } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ADMIN_USER_NAME } from '../../../common/constants';
import { Microschema } from '../../../common/models/microschema.model';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminSchemaEffectsService } from '../../providers/effects/admin-schema-effects.service';

/**
 * @description Schema Builder for UI-friendly assembly of a new schema
 */
export abstract class AbstractSchemaEditorComponent<SchemaT, SchemaResponseT, SchemaFieldT, SchemaFieldTypeT>
    implements OnDestroy, OnInit {
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
        if (this.schemaJsonFromExternalSource === true) {
            this.formGroupInit();
        }
        // reset flag
        this.schemaJsonFromExternalSource = true;
    }
    @Output() schemaJsonChange = new EventEmitter<string>();
    protected _schemaJson: SchemaT;

    /** If TRUE this.schemaJson has been set by an external trigger instead of this component's formGroup.onChanges trigger */
    protected schemaJsonFromExternalSource = true;

    /** @description Non-editable schema data from server providing permission data */
    @Input() schema: SchemaResponseT;

    /** If true, form will create a new entity instead of editing an existing entity */
    @Input() isNew = false;

    /** Emitting on Create/Save Schema */
    @Output() save = new EventEmitter<void>();

    /** Emitting on Delete Schema */
    @Output() delete = new EventEmitter<void>();

    @Output() isValid = new EventEmitter<boolean>();

    /** Schema form */
    formGroup: FormGroup;

    /** All schemas of current Mesh instance */
    allSchemas$: Observable<Schema[]>;
    allSchemas: Schema[];

    /** All microschemas of current Mesh instance */
    allMicroschemas$: Observable<Microschema[]>;
    allMicroschemas: Microschema[];

    /** Stored values of schema.fields[].allow */
    allowValues: Array<Set<string>> = [];

    /** Providing data for Schema Field List Type dropdown list */
    abstract schemaFieldListTypes: Array<{ value: SchemaFieldTypeT; label: string }>;

    /** Providing data for Schema Field Type dropdown list */
    abstract schemaFieldTypes: Array<{ value: SchemaFieldTypeT; label: string }>;

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
    allowedSpecialChars = '_';
    protected allowedCharsRegExp = new RegExp(`^[a-zA-Z0-9${this.allowedSpecialChars}]+$`);

    /** Precondition functions to fill input select dropdown data */
    abstract schemaInputSelectDataConditions: { [key: string]: (field: SchemaFieldT) => boolean };

    /** Central form initial validators reference */
    abstract formValidators: { [key: string]: ValidatorFn[] | any };

    /** Precondition functions to fill schema fields data */
    abstract schemaFieldDataConditions: { [key: string]: (property: any) => boolean };

    /** Precondition functions to fill schema data */
    abstract schemaDataConditions: { [key: string]: (property: any) => boolean };

    /** Main container for autoscroll */
    @ViewChild('scrollContainer') protected scrollContainer: ElementRef;

    /** FormArray fields from template-ngFor */
    @ViewChildren('fields') protected fields: QueryList<ElementRef>;

    /** Duration of add/remove field animation in ms */
    animDuration = 200;

    /** Animation Player instance */
    protected player: AnimationPlayer;

    /** admin user identification string constant */
    ADMIN_USER_NAME = ADMIN_USER_NAME;

    /** If user entered/searched existing schema title in admin schema list, prefill here for convenience */
    schemaTitlePrefilled: string;

    /** subscriptions controller */
    protected destroyed$ = new Subject<void>();

    // CONSTRUCTOR //////////////////////////////////////////////////////////////////////////////
    constructor(
        protected router: Router,
        protected appState: ApplicationStateService,
        protected entities: EntitiesService,
        protected adminSchemaEffects: AdminSchemaEffectsService,
        protected formBuilder: FormBuilder,
        protected i18n: I18nService,
        protected modalService: ModalService,
        protected animationBuilder: AnimationBuilder
    ) {}

    // LIFECYCLE HOOKS //////////////////////////////////////////////////////////////////////////////
    ngOnInit(): void {
        this.loadComponentData();
        this.formGroupInit();

        // get all schemas
        this.allSchemas$.takeUntil(this.destroyed$).subscribe(allSchemas => (this.allSchemas = allSchemas));
        // get all microschemas
        this.allMicroschemas$
            .takeUntil(this.destroyed$)
            .subscribe(allMicroschemas => (this.allMicroschemas = allMicroschemas));

        // refresh entities on router change to update validators
        this.router.events.takeUntil(this.destroyed$).subscribe(() => {
            this.loadComponentData();
        });
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
        this.appState
            .select(state => {
                return state.adminSchemas.filterTerm;
            })
            .first()
            .subscribe(currentSearchTerm => {
                this.schemaTitlePrefilled = currentSearchTerm;
            });

        // assign data streams
        this.allSchemas$ = this.entities.selectAllSchemas().map(
            schemas =>
                schemas &&
                schemas.sort((a, b) => {
                    if (a && a.name) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return 0;
                    }
                })
        );
        this.allMicroschemas$ = this.entities.selectAllMicroschemas().map(
            microschemas =>
                microschemas &&
                microschemas.sort((a, b) => {
                    if (a && a.name) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return 0;
                    }
                })
        );
        // request data
        this.adminSchemaEffects.loadSchemas();
        this.adminSchemaEffects.loadMicroschemas();
    }

    // MANAGE FORM //////////////////////////////////////////////////////////////////////////////

    /**
     * @param schema of original state
     * @returns modified schema to fit the form's data structure
     */
    abstract schemaAsFormValue(schema: SchemaT): SchemaT;

    /** @description Fill input select dropdown data from schema data object */
    abstract initInputSelectDataFromSchemaData(): void;

    /** @description Fill input select dropdown data from method param */
    abstract updateInputSelectData(field: SchemaFieldT): void;

    /** @description Initialize form with empty/default data and listen to changes */
    protected abstract formGroupInit(): void;

    /** @returns true if all values are valid */
    formGroupIsValid(): boolean {
        return this.formGroup.valid;
    }

    /** @returns true if AbstractControl instance property equals value */
    abstract isConflictingProperty(formControlName: keyof SchemaT, value: any): boolean;

    /** @returns true if at least one field exists, and meets DisplayField conditions */
    hasDisplayFields(): boolean {
        return (
            this.getSchemaFieldsFilteredFromFormData(field => {
                return this.schemaInputSelectDataConditions.displayFields(field);
            }).length > 0
        );
    }

    /** @returns true if at least one field exists, and meets SegmentField conditions */
    hasSegmentFields(): boolean {
        return (
            this.getSchemaFieldsFilteredFromFormData(field => {
                return this.schemaInputSelectDataConditions.segmentFields(field);
            }).length > 0
        );
    }

    /** @returns true if at least one field exists, and meets UrlField conditions */
    hasUrlFields(): boolean {
        return (
            this.getSchemaFieldsFilteredFromFormData(field => {
                return this.schemaInputSelectDataConditions.urlFields(field);
            }).length > 0
        );
    }

    // MANAGE SCHEMA.FIELD[] ENTRIES //////////////////////////////////////////////////////////////////////////////

    /** @description Initialize a new FormGroup instance and its related data analogously to schema.field type */
    protected abstract createNewField(): FormGroup;

    /**
     * @description Create FormGroup instance from param data
     * @param field data to create from
     */
    protected abstract createFieldFromData(field: SchemaFieldT): FormGroup;

    /**
     * @description Creating a new form group specifically initiated for specified index
     * @param index pointing at array position
     */
    protected createNewFieldForIndex(index: number): FormGroup {
        this.allowValues.splice(index, 0, new Set<string>());
        return this.createNewField();
    }

    /**
     * @description Create multiple FormGroup instances from param data
     * @param fields data to create from
     */
    protected createFieldsFromData(fields: SchemaFieldT[]): FormGroup[] {
        return fields.map(field => this.createFieldFromData(field));
    }

    /**
     * @description Add new FormGroup instance to FormArray at specified index
     * @param index FormArray index
     */
    fieldAddAt(index: number): void {
        this.schemaFields.insert(index, this.createNewFieldForIndex(index));
        setTimeout(() => this.fieldFocus(index), 0);
    }
    fieldAddAtAnim(index: number): void {
        this.schemaFields.insert(index, this.createNewFieldForIndex(index));
        setTimeout(() => this.fieldAddAnimate(index), 0);
        setTimeout(() => this.fieldFocus(index), 0);
    }

    /** @description Add new FormGroup instance to FormArray */
    fieldAdd(): void {
        this.schemaFields.push(this.createNewField());
    }
    fieldAddAnim(): void {
        this.schemaFields.push(this.createNewField());
        setTimeout(() => this.fieldAddAnimate(this.schemaFields.value.length - 1), 0);
        setTimeout(() => this.fieldFocus(this.schemaFields.value.length), 0);
        this.scrollToFieldLast();
    }

    /**
     * @description Remove FormGroup instance from FormArray at specified index
     * @param index FormArray index
     */
    fieldRemoveAt(index: number): void {
        this.fieldRemoveAnimate(index);
    }
    fieldRemoveAtAnim(index: number): void {
        this.fieldRemoveAnimate(index);
        setTimeout(() => this.schemaFields.removeAt(index), this.animDuration);
    }

    /** @description remove last FormGroup instance from FormArray */
    fieldRemoveLast(): void {
        this.fieldRemoveAnimate(this.schemaFields.value.length - 1);
    }
    fieldRemoveLastAnim(): void {
        this.fieldRemoveAnimate(this.schemaFields.value.length - 1);
        setTimeout(() => this.fieldRemoveAt(this.schemaFields.value.length - 1), this.animDuration);
    }

    fieldHasMoveButtons(): boolean {
        return this.schemaFields.value && this.schemaFields.value.length > 1;
    }

    fieldHasMoveUpButton(index: number): boolean {
        const hasFieldBefore = this.schemaFields.controls[index - 1] ? true : false;
        return this.fieldHasMoveButtons() && hasFieldBefore;
    }

    fieldHasMoveDownButton(index: number): boolean {
        const hasFieldAfter = this.schemaFields.controls[index + 1] ? true : false;
        return this.fieldHasMoveButtons() && hasFieldAfter;
    }

    fieldMove(fromIndex: number, toIndex: number): void {
        const controlToMove = this.schemaFields.at(fromIndex);
        const allowValueToMove = this.allowValues[fromIndex] || null;
        const allowValueToMoveInData = (this._schemaJson as any).fields[fromIndex].allow || null;

        this.allowValues.splice(fromIndex, 1);
        (this._schemaJson as any).fields.splice(fromIndex, 1);
        // remove control from array current array position
        this.schemaFields.removeAt(fromIndex);

        this.allowValues.splice(toIndex, 0, allowValueToMove);
        (this._schemaJson as any).fields.splice(toIndex, 0, allowValueToMoveInData);
        // add control to new array positon
        this.schemaFields.insert(toIndex, controlToMove);

        // if allwo values, update moved control
        const type = this.getControlFromArrayAtIndex(toIndex, 'type')!.value;
        const listType = this.getControlFromArrayAtIndex(toIndex, 'listType')!.value;
        if (
            allowValueToMove &&
            this.getControlFromArrayAtIndex(toIndex, 'allow') &&
            !(type !== 'string' || listType !== 'string') &&
            this.getControlFromArrayAtIndex(toIndex, 'allow')
        ) {
            this.getControlFromArrayAtIndex(toIndex, 'allow')!.setValue(allowValueToMove);
        }
        // trigger validators
        this.formGroup.updateValueAndValidity();
    }

    fieldMoveUp(index: number): void {
        this.fieldMove(index, index - 1);
    }

    fieldMoveDown(index: number): void {
        this.fieldMove(index, index + 1);
    }

    /**
     * @param index of FormArray instance
     * @param formControlName FormControl instance string identifer
     * @returns TRUE if param property of defined FormControl in FormArray equals any other
     */
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
        const control = this.getControlFromArrayAtIndex(index, formControlName) as AbstractControl | any;
        if (isDuplicate === true) {
            // assign new error to field errors
            control!.setErrors({ ...control!.errors, ...{ duplicate: true } });
        } else {
            // if exist, create new error object without duplicate error
            const errors =
                control!.errors &&
                (this.objectRemoveProperties(control!.errors, ['duplicate']) as ValidationErrors | null);
            control!.setErrors(errors);
        }
        return isDuplicate;
    }

    /**
     * @param formControlName FormControl instance string identifer
     * @param errorType string-defined error type
     * @returns TRUE if defined FormControl instance has param error type
     */
    getFormControlErrorOfType(formControlName: keyof SchemaT, errorType: TSchemaEditorErrors): boolean {
        return this.formGroup.get(formControlName as any)!.hasError(errorType);
    }

    /**
     * @param formControlName FormControl instance string identifer
     * @returns TRUE if defined FormControl instance has been touched by user
     */
    isformControlTouched(formControlName: keyof SchemaT): boolean {
        // return this.formGroup.get(formControlName as any)!.touched;
        return true;
    }

    /**
     * @param index of FormControl instance in FormArray
     * @param formControlName FormControl instance string identifer
     * @param errorType string-defined error type
     * @returns TRUE if defined FormControl instance has param error type
     */
    getFormControlInArrayErrorOfType(
        index: number,
        formControlName: keyof SchemaFieldT,
        errorType: TSchemaEditorErrors
    ): boolean {
        return this.getControlFromArrayAtIndex(index, formControlName as any)!.hasError(errorType);
    }

    /**
     * @param index of FormControl instance in FormArray
     * @param formControlName FormControl instance string identifer
     * @returns TRUE if defined FormControl instance has been touched by user
     */
    isFormControlInArrayTouched(index: number, formControlName: keyof SchemaFieldT): boolean {
        return this.getControlFromArrayAtIndex(index, formControlName as any)!.touched;
    }

    /**
     * Resets control value in schemafields form array
     * @param index of FormControl instance in FormArray
     * @param property to be cleared
     */
    formControlInArrayClear(index: number, property: keyof SchemaFieldT): void {
        if (this.getControlFromArrayAtIndex(index, property as any)) {
            this.getControlFromArrayAtIndex(index, property as any)!.setValue('', { emitEvent: false });
        }
    }

    // MANAGE SCHEMA.FIELD[].ALLOW VALUES //////////////////////////////////////////////////////////////////////////////

    /**
     * Get allowed data entries
     * @param index of FormControl instance in FormArray
     */
    allowValueGetAt(index: number): string[] | null {
        if (this.allowValues[index]) {
            return Array.from(this.allowValues[index]);
        } else {
            return null;
        }
    }

    /**
     * Reset the entire allowValues Set at index
     * @param index of allowed data array
     * @param values replacing previous values
     */
    allowValueSetAt(index: number, values: string[]): void {
        // update allowed data
        this.allowValues[index] = new Set<string>(values);
        // update form
        this.formGroup.updateValueAndValidity();
    }

    /**
     * Add value to schema.fields[] allow[]
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
     * Remove value from schema.fields[] allow[]
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
     * Change value of schema.fields[] allow[]
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

    /**
     * Removes last entry of allow data array
     * @param index of allow data array
     */
    allowValueRemoveLastAt(index: number): void {
        // if input bar has text, which is not yet converted to chip, don't redirect backspace key
        const form = this.formGroup.value as SchemaT;
        const inputText = (form as any).fields && (form as any).fields[index] && (form as any).fields[index].allow;
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

    /**
     * @param index of allow data array
     * @param value to be checked
     * @returns TRUE if allow data entry equals value param
     */
    allowValuesContainsAt(index: number, value: string): boolean {
        return this.allowValues[index].has(value);
    }

    /**
     * Add allow data entry at index with param value
     * @param index of allow data array
     * @param value to be set at index
     */
    allowValueOnStringInputAddAt(index: number, value: any): void {
        if (typeof value === 'string' && value !== '') {
            // as formGroup.field[].allow.control values are represented not as input value, empty it
            this.formControlInArrayClear(index, 'allow' as any);
            this.allowValues[index].add(value.replace(new RegExp(/\s/, 'g'), ''));
            this.formGroup.updateValueAndValidity();
        }
    }

    /**
     * Checks allow data input element for user input
     * @param index of allow data array
     */
    allowValuesOnStringInputChangeAt(index: number): void {
        if (!this.getControlFromArrayAtIndex(index, 'allow')) {
            return;
        }
        const allow = this.getControlFromArrayAtIndex(index, 'allow')!.value;
        // if input value is seperated by space or comma, then add as chip
        if (new RegExp(/\w+\s/, 'g').test(allow)) {
            this.allowValueOnStringInputAddAt(index, allow);
        }
    }

    // SCHEMA MAIN BUTTON //////////////////////////////////////////////////////////////////////////////

    /** @returns TRUE if save button is available */
    schemaSaveIsPermitted(): boolean {
        // if no schema, this component is in CREATE mode
        if (!this.schema) {
            return true;
        }
        // if schema, check if hs permissions
        return (
            this.schema &&
            (this.schema as any).permissions &&
            ((this.schema as any).permissions.update || (this.schema as any).name !== ADMIN_USER_NAME)
        );
    }
    /** @description Create/update current schema if displayed warning modal has been confirmed by user */
    schemaSave(): void {
        if (
            this.schema &&
            (this.schema as any).permissions &&
            (this.schema as any).permissions.update &&
            (!(this.schema as any).permissions.update || (this.schema as any).name === ADMIN_USER_NAME)
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

    /** @returns true if delete button is available */
    schemaDeleteIsPermitted(): boolean {
        // if schema, check if hs permissions
        return (
            this.schema &&
            (this.schema as any).permissions &&
            ((this.schema as any).permissions.delete || (this.schema as any).name !== ADMIN_USER_NAME)
        );
    }
    /** @description Delete current schema if displayed warning modal has been confirmed by user */
    schemaDelete(): void {
        if (
            (this.schema as any) &&
            (this.schema as any).permissions &&
            (this.schema as any).permissions.delete &&
            (!(this.schema as any).permissions.delete || (this.schema as any).name === ADMIN_USER_NAME)
        ) {
            return;
        }
        this.displayDeleteModal(
            { token: 'admin.delete_schema' },
            { token: 'admin.delete_schema_confirmation', params: { name: (this.schema as any).name } }
        ).then(() => {
            this.delete.emit();
        });
    }

    /**
     * @description Delete field at index if displayed warning modal has been confirmed by user
     * @param field FormGroup instance to be removed
     * @param index of FormControl instance in FormArray
     * */
    fieldDelete(field: FormControl, index: number): void {
        // if field is valid, ask before deleting
        if (field.valid) {
            this.displayDeleteModal(
                { token: 'admin.delete_schemafield' },
                { token: 'admin.schemafield_delete_confirmation', params: { name: field.value.name } }
            ).then(() => {
                this.fieldRemoveAtAnim(index);
            });
            // otherwise delete without confirmation
        } else {
            this.fieldRemoveAtAnim(index);
        }
    }

    schemaDeleteButtonIsDisplayed(): boolean {
        return this.schema ? true : false;
    }

    // ANIMATIONS //////////////////////////////////////////////////////////////////////////////

    fieldAddAnimate(index: number) {
        const field = this.fields.toArray()[index].nativeElement;
        const animationFactory = this.animationBuilder.build([
            style({
                opacity: 0,
                'max-height': '0',
                'padding-top': '0',
                'padding-bottom': '0',
                'margin-top': '0',
                'margin-bottom': '0'
            }),
            animate(
                `${this.animDuration}ms ease`,
                style({
                    opacity: 1,
                    'max-height': '20rem',
                    'padding-top': '*',
                    'padding-bottom': '*',
                    'margin-top': '*',
                    'margin-bottom': '*'
                })
            )
        ]);
        this.player = animationFactory.create(field);
        this.player.play();
    }

    fieldRemoveAnimate(index: number) {
        const field = this.fields.toArray()[index].nativeElement;
        const animationFactory = this.animationBuilder.build([
            style({
                opacity: 1,
                'max-height': '20rem',
                'padding-top': '*',
                'padding-bottom': '*',
                'margin-top': '*',
                'margin-bottom': '*'
            }),
            animate(
                `${this.animDuration}ms ease`,
                style({
                    opacity: 0,
                    'max-height': '0',
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'margin-top': '0',
                    'margin-bottom': '0'
                })
            )
        ]);
        this.player = animationFactory.create(field);
        this.player.play();
    }

    /** Scroll to last form group in form array */
    scrollToFieldLast(): void {
        this.fields.last.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    // UTILITY METHODS //////////////////////////////////////////////////////////////////////////////

    /** @returns TRUE if there are any schema fields */
    hasSchemaFields(): boolean {
        if (this.schemaFields && this.schemaFields.length && this.schemaFields.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param index of control in form array instance
     * @param control string identifying control in form group
     * @returns control from form group in form array
     */
    protected getControlFromArrayAtIndex(index: number, control: string): AbstractControl | null {
        return this.schemaFields.controls[index].get(control);
    }

    /**
     * @description Return fields of schema data as data for select/drop-down input filtered by function
     * @param compareFn filtering fields
     * @returns array of value-label pairs fit for input select drop down data
     */
    protected getSchemaFieldsFilteredAsInputSelectDataFromSchemaData(
        compareFn: (field: SchemaFieldT) => boolean
    ): Array<{ value: string; label: string }> {
        return (this._schemaJson as any).fields
            ? ((this._schemaJson as any).fields as SchemaFieldT[])
                  .filter(field => compareFn(field))
                  .map(field => ({ value: (field as any).name, label: (field as any).name }))
            : [];
    }

    /**
     * @description Returns fields of schema from form data filtered by function
     * @param compareFn filtering fields
     */
    protected getSchemaFieldsFilteredFromFormData(compareFn: (field: SchemaFieldT) => boolean): SchemaFieldT[] {
        if (this.schemaFields.value) {
            return (this.schemaFields.value as SchemaFieldT[]).filter(field => compareFn(field));
        } else {
            return [];
        }
    }

    /**
     * @description Returns an object without the defined property
     * @param object to be cleared of defined property-value pair
     * @param removePropertyKeys of properties to be removed
     * @returns cleared object or null if object does not have any properties
     */
    protected objectRemoveProperties(
        object: { [key: string]: any },
        removePropertyKeys: string[]
    ): { [key: string]: any } | null {
        const objectPropertyKeys = Object.getOwnPropertyNames(object);
        if (objectPropertyKeys.length > 0) {
            return objectPropertyKeys
                .map(key => {
                    // if key in removePropertyKeys then don't include in new return object
                    return (
                        !removePropertyKeys.find(removePropertyKey => removePropertyKey === key) && {
                            [key]: object[key]
                        }
                    );
                })
                .reduce((objects: object, object: object) => ({ ...objects, object })) as any;
        } else {
            return null;
        }
    }

    protected displaySaveSchemaModal(
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
                    { type: 'secondary', label: this.i18n.translate('admin.yes_button') }
                ]
            })
            .then(modal => modal.open());
    }

    protected displayDeleteModal(
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

    protected displayProjectAssignModal(
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

    /**
     * @description Update Validators on form control
     * @param control form control to be modified
     * @param validators to be set
     */
    protected controlValidatorsUpdate(control: AbstractControl, validators: ValidatorFn | ValidatorFn[] | null): void {
        control.setValidators(validators);
        control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    /**
     * @description Add new error object to AbstractControl instance
     * @param control to add new error to
     * @param errors to be added to defined AbstractControl instance
     */
    protected controlErrorsAdd(control: AbstractControl, errors: ValidationErrors): void {
        // assign new errors to control errors
        control!.setErrors({ ...control!.errors, ...errors });
    }

    /**
     * @description Remove error object from AbstractControl instance
     * @param control to remove errors from
     * @param errorKeys as string array identifying errors to be removed
     */
    protected controlErrorsRemove(control: AbstractControl, errorKeys: string[]): void {
        // remove errors from control errors while retaining existing errors
        const updatedErrors =
            control!.errors &&
            (this.objectRemoveProperties(
                control!.errors as { [key: string]: any },
                errorKeys
            ) as ValidationErrors | null);
        control!.setErrors(updatedErrors);
    }

    /**
     * @description set focus on first input element of created field
     * @param index FormArray index
     */
    protected fieldFocus(index: number): void {
        const field = this.fields.toArray()[index] || this.fields.last;
        const input = field.nativeElement.querySelector('[formcontrolname="name"] input');
        input.focus();
    }
}

/** Possible invalid types of this form group */
export type TSchemaEditorErrors = 'required' | 'pattern' | 'duplicate' | 'conflict';
