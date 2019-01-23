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
    formGroup: FormGroup;

    schema: SchemaUpdateRequest | Schema;

    allSchemas$: Observable<Schema[]>;

    allMicroschemas$: Observable<Microschema[]>;

    allowedBarValue: any = '';

    allowedBarStrings: Array<Set<string>> = [];

    schemaTypes: Array<{ value: SchemaFieldType; label: string }> = [
        {
            value: 'node',
            label: 'Node'
        },
        {
            value: 'boolean',
            label: 'Boolean'
        },
        {
            value: 'string',
            label: 'String'
        },
        {
            value: 'number',
            label: 'Number'
        },
        {
            value: 'date',
            label: 'Date'
        },
        {
            value: 'html',
            label: 'HTML'
        },
        {
            value: 'micronode',
            label: 'Micronode'
        },
        {
            value: 'binary',
            label: 'Binary'
        },
        {
            value: 'list',
            label: 'List'
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

    constructor(
        private entities: EntitiesService,
        private adminSchemaEffects: AdminSchemaEffectsService,
        private formBuilder: FormBuilder
    ) {}

    // LIFECYCLE HOOKS
    ngOnInit(): void {
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

        // initialize form
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
                            this.allowedStringsOnClear(index);
                            this.propertyPurge(field, index, 'allow');
                        }

                        // if of type string, trigger search bar functionality
                        if (field.type === 'string' || field.listType === 'string') {
                            this.allowedStringsOnChange(index);
                        }

                        // if allow property should exist, assign appropriate data
                        Object.assign(schemaField, {
                            allow: this.allowedBarStrings[index] ? Array.from(this.allowedBarStrings[index]) : null
                        });

                        // if field.allow proeprty is an empty array, clean it up
                        if (field.allow && field.allow.length && field.allow === 0) {
                            this.propertyPurge(field, index, 'allow');
                        }

                        // switch (field.type) {
                        //     case 'node':
                        //         if (field.allow) {
                        //             Object.assign(schemaField, { allow: field.allow });
                        //         }
                        //         break;
                        //     case 'micronode':
                        //         if (field.listType !== 'micronode') {
                        //             // clear properties not allowed for field of type 'micronode'
                        //             this.propertyPurge(field, index, 'listType');
                        //         }
                        //         if (field.allow) {
                        //             Object.assign(schemaField, { allow: field.allow });
                        //         }
                        //         break;
                        //     case 'list':
                        //         // // clear properties not allowed for field of type 'list'
                        //         // if (field.listType !== 'node' || 'micronode') {
                        //         //     this.propertyPurge(field, index, 'allow');
                        //         // }
                        //         // if previously field.type has been node or micronode, reset field.allow
                        //         if (this.schema && this.schema.fields && this.schema.fields[index].type !== 'list') {
                        //             this.allowedStringsOnClear(index);
                        //         }
                        //         Object.assign(schemaField, {
                        //             allow: this.allowedBarStrings[index]
                        //                 ? Array.from(this.allowedBarStrings[index])
                        //                 : null
                        //         });
                        //         if (field.listType) {
                        //             Object.assign(schemaField, { listType: field.listType });
                        //         }
                        //         break;
                        //     case 'string':
                        //         // if previously field.type has been node or micronode, reset field.allow
                        //         if (this.schema && this.schema.fields && this.schema.fields[index].type !== 'string') {
                        //             this.allowedStringsOnClear(index);
                        //         }
                        //         // clear properties not allowed for field of type 'micronode'
                        //         this.propertyPurge(field, index, 'listType');
                        //         this.allowedStringsOnChange(index);
                        //         Object.assign(schemaField, {
                        //             allow: this.allowedBarStrings[index]
                        //                 ? Array.from(this.allowedBarStrings[index])
                        //                 : null
                        //         });
                        //         break;
                        //     default:
                        //         break;
                        // }

                        return schemaField;
                    })
                };
                console.log('!!! schema:', this.schema);
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    createNewField(): FormGroup {
        this.allowedBarStrings.push(new Set<string>());
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

    schemaCreate(): void {
        console.log('!!! schemaCreate()');
    }

    schemaDelete(): void {
        console.log('!!! schemaDelete()');
    }

    /**
     * add entry to schema.fields[] allow[]
     * @param index of schema.fields[]
     * @param entry string to be added
     * */
    schemaFieldAllowEntryAdd(index: number, entry: string): void {
        // update allowed data
        this.allowedBarStrings[index].add(entry);
        // update form
        this.formGroup.updateValueAndValidity();
        // const newForm = simpleCloneDeep(this.formGroup.value) as SchemaUpdateRequest;
        // const newField = newForm.fields[index] as SchemaField;
        // // if array not yet existing, create it
        // if (!newField.allow) {
        //     newField.allow = [];
        // }
        // // make new set from array to keep entries unique
        // const allowSet = new Set<string>(newField.allow);
        // allowSet.add(entry);
        // newField.allow = Array.from<string>(allowSet);
        // // assign new value to form data
        // this.formGroup.patchValue(newForm);
    }

    /**
     * remove entry to schema.fields[] allow[]
     * @param index of schema.fields[]
     * @param entry string to be removed
     * */
    schemaFieldAllowEntryRemove(index: number, entry: string): void {
        // update allowed data
        this.allowedBarStrings[index].delete(entry);
        // update form
        this.formGroup.updateValueAndValidity();
        // // update form data
        // const newForm = simpleCloneDeep(this.formGroup.value) as SchemaUpdateRequest;
        // const newField = newForm.fields[index] as SchemaField;

        // if (!newField.allow || !(newField.allow instanceof Array)) {
        //     return;
        // }
        // // remove entry
        // newField.allow = newField.allow.filter(item => item !== entry);
        // // assign new value to form data
        // this.formGroup.patchValue(newForm);
    }

    /**
     * change entry of schema.fields[] allow[]
     * @param index of schema.fields[]
     * @param entry string to be changed
     * @param action indicator: true = add, false = remove
     */
    schemaFieldAllowEntryChange(index: number, entry: string, action: boolean): void {
        if (action === true) {
            this.schemaFieldAllowEntryAdd(index, entry);
        } else {
            this.schemaFieldAllowEntryRemove(index, entry);
        }
    }

    allowedStringsOnAdd(index: number): void {
        const newForm = simpleCloneDeep(this.formGroup.value);
        const newField = newForm.fields[index];
        // update mesh chip array cleaned from forbiddden characters
        this.allowedBarStrings[index].add(newField.allow.replace(' ', '').replace(',', ''));
        // empty field after new value is displayed as chip
        newField.allow = '';
        // assign new value to form data
        this.formGroup.patchValue(newForm);
    }

    /**
     * Remove entry from allowed string values of schema field
     * @param entry to be removed
     */
    allowedStringsOnRemove(index: number, entry: string): void {
        // remove from entries array
        this.allowedBarStrings[index].delete(entry);
        // update form
        this.formGroup.updateValueAndValidity();
    }

    allowedStringsOnRemoveLast(index: number): void {
        // if input bar has text, which is not yet converted to chip, don't redirect backspace key
        const form = this.formGroup.value as Schema;
        const inputText = form.fields && form.fields[index] && form.fields[index].allow;
        if (inputText && inputText.length) {
            return;
        }

        const allowedBarStrings = this.allowedBarStrings[index];
        if (!allowedBarStrings) {
            return;
        }
        const lastValue = Array.from(allowedBarStrings).pop();
        if (!lastValue) {
            return;
        }
        this.allowedStringsOnRemove(index, lastValue);
    }

    allowedStringsOnChange(index: number): void {
        const newForm = simpleCloneDeep(this.formGroup.value);
        const newField = newForm.fields[index];
        if (!newField.allow) {
            return;
        }
        // if input value is seperated by space or comma, then add as chip
        if (newField.allow.indexOf(',') > -1 || newField.allow.indexOf(' ') > -1) {
            this.allowedStringsOnAdd(index);
        }
    }

    /**
     * Remove all entries from allowed string values of schema field
     * @param index of field to be cleared
     */
    allowedStringsOnClear(index: number): void {
        this.allowedBarStrings[index] = new Set();
        const newForm = simpleCloneDeep(this.formGroup.value);
        const newField = newForm.fields[index];

        if (!newField.allow) {
            return;
        }
        newField.allow = '';

        // assign new value to form data
        this.formGroup.patchValue(newForm);
    }

    allowedBarStringsContains(index: number, value: string): boolean {
        // if (!this.formGroup.value) {
        //     return false;
        // }
        // const form = this.formGroup.value as Schema;
        // return form.fields &&
        //     form.fields[index] &&
        //     form.fields[index].allow &&
        //     form.fields[index].allow!.indexOf(value) > -1
        //         ? true
        //         : false;
        return this.allowedBarStrings[index].has(value);
    }

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
