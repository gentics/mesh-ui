import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GenticsUICoreModule, ModalService } from 'gentics-ui-core';

import { provideMockI18n } from '../../../../testing/configure-component-test';
import { MockModalService } from '../../../../testing/modal.service.mock';
import { MeshNode } from '../../../common/models/node.model';
import { Schema } from '../../../common/models/schema.model';
import { ConfigService } from '../../../core/providers/config/config.service';
import { MockConfigService } from '../../../core/providers/config/config.service.mock';
import { TestStateModule } from '../../../state/testing/test-state.module';
import { MeshControlGroupService } from '../../providers/field-control-group/mesh-control-group.service';
import { FieldGeneratorService } from '../../providers/field-generator/field-generator.service';
import { FieldErrorsComponent } from '../field-errors/field-errors.component';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { StringFieldComponent } from '../string-field/string-field.component';

import { FormGeneratorComponent } from './form-generator.component';

describe('FormGeneratorComponent:', () => {
    let instance: FormGeneratorComponent;
    let fixture: ComponentFixture<FormGeneratorComponent>;
    let meshControlGroup: MeshControlGroupService;

    @NgModule(
        provideMockI18n({
            imports: [GenticsUICoreModule, FormsModule, CommonModule],
            declarations: [StringFieldComponent, NumberFieldComponent, FieldErrorsComponent],
            entryComponents: [StringFieldComponent, NumberFieldComponent, FieldErrorsComponent],
            exports: [StringFieldComponent, NumberFieldComponent]
        })
    )
    class TestModule {}

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TestModule, TestStateModule],
            declarations: [FormGeneratorComponent],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                FieldGeneratorService,
                MeshControlGroupService,
                { provide: ModalService, useClass: MockModalService }
            ]
        });
        fixture = TestBed.createComponent(FormGeneratorComponent);
        instance = fixture.componentInstance;
        meshControlGroup = TestBed.get(MeshControlGroupService);
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

    it('setPristine() invokes meshControlGroup.reset()', () => {
        populateMockData(fixture);
        const resetSpy = spyOn(meshControlGroup, 'reset');
        const nameField = getFormField(fixture, StringFieldComponent);
        nameField.onChange('bar');

        expect(resetSpy).not.toHaveBeenCalled();
        instance.setPristine({} as any);
        expect(resetSpy).toHaveBeenCalled();
    });

    it('attaches a FieldErrorsComponent to each field', () => {
        populateMockData(fixture);
        const fieldErrorComponents = fixture.debugElement.queryAll(By.directive(FieldErrorsComponent));

        expect(fieldErrorComponents.length).toBe(2);
    });

    describe('MeshControlGroupService interop', () => {
        it('should invoke MeshControlGroupService.init() with a getNodeFn', () => {
            const initSpy = spyOn(meshControlGroup, 'init').and.callThrough();
            populateMockData(fixture);

            expect(initSpy).toHaveBeenCalledTimes(1);
            expect(typeof initSpy.calls.argsFor(0)[0]).toBe('function');
        });

        describe('getNodeFn', () => {
            let getNodeFn: (arg?: any) => any;
            /*tslint:disable no-use-before-declare */
            const complexNode = Object.assign({}, mockNode, {
                fields: {
                    name: 'Ada',
                    age: 42,
                    locations: [
                        {
                            uuid: '2f26db6facc047c7a6db6facc027c76b',
                            microschema: {
                                name: 'geolocation',
                                uuid: '95b6cbb75638477fb6cbb75638b77f96'
                            },
                            fields: {
                                latitude: 48.208330230278,
                                longitude: 16.373063840833,
                                addresses: ['22 Acacia Avenue', '42 Deepthought Lane']
                            },
                            type: 'micronode'
                        }
                    ]
                }
            });
            /*tslint:enable no-use-before-declare */

            beforeEach(() => {
                const initSpy = spyOn(meshControlGroup, 'init').and.callThrough();
                populateMockData(fixture, complexNode);
                getNodeFn = initSpy.calls.argsFor(0)[0];
            });

            it('should return a clone of the entire node if called without a path', () => {
                expect(getNodeFn()).toEqual(complexNode, 'equal value');
                expect(getNodeFn()).not.toBe(complexNode, 'identical reference');
            });

            it('should return the field value for a valid top-level path', () => {
                expect(getNodeFn(['name'])).toEqual(complexNode.fields.name);
                expect(getNodeFn(['age'])).toEqual(complexNode.fields.age);
            });

            it('should return the field value for a valid list index path', () => {
                expect(getNodeFn(['locations', 0])).toEqual(complexNode.fields.locations[0]);
            });

            it('nested values should be equal but not identical', () => {
                expect(getNodeFn(['locations', 0])).not.toBe(complexNode.fields.locations[0]);
            });

            it('should return the field value for a valid deeply-nested path', () => {
                expect(getNodeFn(['locations', 0, 'fields', 'addresses', 1])).toEqual(
                    complexNode.fields.locations[0].fields.addresses[1]
                );
            });

            it('should return undefined for invalid top-level path ', () => {
                expect(getNodeFn(['nonexistent'])).toBeUndefined();
            });

            it('should return undefined for invalid nested path ', () => {
                expect(getNodeFn(['nonexistent', 1, 'bar', 'baz'])).toBeUndefined();
            });
        });
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
    displayField: 'name',
    project: {
        uuid: '079bc38c5cb94db69bc38c5cb97db6b0',
        name: 'demo'
    },
    language: 'en',
    creator: mockUser,
    created: '2017-01-19T12:08:02Z',
    editor: mockUser,
    edited: '2017-01-19T12:08:05Z',
    permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
        publish: true,
        readPublished: true
    },
    rolePerms: {} as any,
    availableLanguages: {
        en: {
            published: false,
            version: '0.1',
            publisher: {
                uuid: 'publisher_uuid'
            }
        }
    },
    parentNode: {
        projectName: 'demo',
        uuid: '69e74dfa02a24a1da74dfa02a2aa1d6f',
        displayName: 'Aircraft',
        schema: {
            name: 'category',
            uuid: '1c401518014a407d801518014a507d2b',
            version: '1.0'
        }
    },
    tags: [],
    version: '0.1',
    childrenInfo: {},
    schema: {
        name: 'person',
        uuid: 'b85a103e9902460e9a103e9902b60eee',
        version: '1.0'
    },
    fields: {
        name: 'Ada',
        age: 42
    } as any,
    languagePaths: {
        en: ''
    },
    path: '',
    breadcrumb: [
        {
            uuid: '69e74dfa02a24a1da74dfa02a2aa1d6f',
            displayName: 'Aircraft',
            projectName: 'demo',
            schema: {
                name: 'folder',
                uuid: 'abcdef',
                version: '1.0'
            }
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
    permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
        publish: true,
        readPublished: true
    },
    version: '1.0',
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
    container: false,
    rolePerms: {} as any
};

function populateMockData(fixture: ComponentFixture<FormGeneratorComponent>, node: MeshNode = mockNode): void {
    const instance = fixture.componentInstance;
    fixture.detectChanges();
    instance.node = node;
    instance.schema = mockSchema;
    instance.ngOnChanges({ schema: {} } as any);
    // run change detection on child components
    fixture.detectChanges();
}
