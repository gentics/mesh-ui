import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGeneratorComponent } from './form-generator.component';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { MeshControlGroup } from '../../providers/field-control-group/mesh-control-group.service';
import { MeshNode } from '../../../../common/models/node.model';
import { Schema } from '../../../../common/models/schema.model';
import { NgModule, Type } from '@angular/core';
import { StringFieldComponent } from '../string-field/string-field.component';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { By } from '@angular/platform-browser';

describe('FormGeneratorComponent:', () => {

    let instance: FormGeneratorComponent;
    let fixture: ComponentFixture<FormGeneratorComponent>;

    @NgModule({
        imports: [GenticsUICoreModule, FormsModule],
        declarations: [StringFieldComponent, NumberFieldComponent],
        entryComponents: [StringFieldComponent, NumberFieldComponent],
        exports: [StringFieldComponent, NumberFieldComponent]
    })
    class TestModule {}

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
            declarations: [FormGeneratorComponent],
            providers: [FieldGeneratorService, MeshControlGroup]
        });
        fixture = TestBed.createComponent(FormGeneratorComponent);
        instance = fixture.componentInstance;
    }));

    it(`should be initialized`, () => {
        fixture.detectChanges();
        expect(fixture).toBeDefined();
        expect(instance).toBeDefined();
    });

    it('should generate the form', () => {
        populateMockData(fixture);

        const nameField = getFormField(fixture, StringFieldComponent);
        const ageField = getFormField(fixture, NumberFieldComponent);
        expect(nameField).toBeTruthy('nameField not found');
        expect(nameField.value).toBe('Ada');
        expect(ageField).toBeTruthy('ageField not found');
        expect(ageField.value).toBe(42);
    });

    it('isValid returns correct value', () => {
        populateMockData(fixture);

        expect(instance.isValid).toBe(true);
        const nameField = getFormField(fixture, StringFieldComponent);
        nameField.onChange('');

        expect(instance.isValid).toBe(false);
    });

    it('isDirty returns correct value', () => {
        populateMockData(fixture);

        expect(instance.isDirty).toBe(false);
        const nameField = getFormField(fixture, StringFieldComponent);
        nameField.onChange('bar');

        expect(instance.isDirty).toBe(true);
    });

    it('setPristine() resets the dirty state', () => {
        populateMockData(fixture);
        const nameField = getFormField(fixture, StringFieldComponent);
        nameField.onChange('bar');

        expect(instance.isDirty).toBe(true);
        instance.setPristine();
        expect(instance.isDirty).toBe(false);
    });

});

function getFormField<T>(fixture: ComponentFixture<FormGeneratorComponent>, type: Type<T>): T {
    return fixture.debugElement.query(By.directive(type)).componentInstance;
}

const mockUser = {
    uuid: 'abc',
    firstName: 'test',
    lastName: 'user'
};
const mockNode: MeshNode = {
    uuid: '6b415925881043f1815925881063f147',
    creator: mockUser,
    created: '2017-01-19T12:08:02Z',
    editor: mockUser,
    edited: '2017-01-19T12:08:05Z',
    permissions: [
        'create',
        'update',
        'delete',
        'readpublished',
        'read',
        'publish'
    ],
    availableLanguages: [
        'en'
    ],
    parentNode: {
        projectName: 'demo',
        uuid: '69e74dfa02a24a1da74dfa02a2aa1d6f',
        displayName: 'Aircraft',
        schema: {
            name: 'category',
            uuid: '1c401518014a407d801518014a507d2b'
        }
    },
    tags: {},
    childrenInfo: {},
    schema: {
        name: 'person',
        uuid: 'b85a103e9902460e9a103e9902b60eee',
        version: 1
    },
    fields: {
        name: 'Ada',
        age: 42,
    },
    languagePaths: {
        en: ''
    },
    path: '',
    breadcrumb: [
        {
            uuid: '69e74dfa02a24a1da74dfa02a2aa1d6f',
            displayName: 'Aircraft',
            path: ''
        }
    ],
    container: false
};

const mockSchema: Schema = {
    uuid: 'b85a103e9902460e9a103e9902b60eee',
    creator: mockUser,
    created: '2017-01-19T12:08:02Z',
    editor: mockUser,
    edited: '2017-01-19T12:08:05Z',
    permissions: [
        'create',
        'update',
        'delete',
        'readpublished',
        'read',
        'publish'
    ],
    version: 1,
    name: 'vehicle',
    fields: [
        {
            name: 'name',
            label: 'Name',
            required: true,
            type: 'string'
        },
        {
            name: 'age',
            label: 'Age',
            required: true,
            type: 'number'
        }
    ],
    displayField: 'name',
    segmentField: 'name',
    container: false
};

function populateMockData(fixture: ComponentFixture<FormGeneratorComponent>): void {
    const instance = fixture.componentInstance;
    fixture.detectChanges();
    instance.node = mockNode;
    instance.schema = mockSchema;
    instance.ngOnChanges({ schema: {} } as any);
    // run change detection on child components
    fixture.detectChanges();
}
